import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { EventEmitter, Injectable } from '@angular/core';
import { PhotoResource } from 'model/Resources';

import { AdvancedSearchResult, UserItemsResult } from '../model/ApiResult';
import { Comment } from '../model/Comment';
import { Dictionary, Item, ItemInfo, ItemName } from '../model/Item';
import { Search } from '../model/Search';
import { ApiProvider } from './api';
import { UserSettingsProvider } from './user-settings';

@Injectable()
export class ItemService {

  public itemAdded = new EventEmitter<Item>();
  public searchComplete = new EventEmitter<Item[]>();

  constructor(
    private api: ApiProvider,
    private userSettingsProvider: UserSettingsProvider,
  ) {

  }

  /**
   * Search on name / variation / venue
   * @param q the (partial) trick name
   * @param on can be "name", "variation", "venue"
   */
  public searchValue(q: string, on: string) {
    q = encodeURIComponent(q.trim());
    const urls = {
      name: "trick-name",
      variation: "u/variation",
      venue: "venue-name",
    };

    const url = urls[on];

    return this.api.cacheGet(`${url}?q=${q}`);
  }

  public getUserItems(userName: string, page: number): Promise<UserItemsResult> {
    return this.api.cacheGet(`user-items/${userName}?page=${page}`);
  }

  public getItem(id: number): Promise<Item> {
    return this.api.cacheGet(`item/${id}`);
  }

  private getCategoryName() {
    const c = this.userSettingsProvider.getCategorySync();
    if (!c || c.name === 'all') return null;
    return c.name;
  }

  public search(q: string) {
    const url = UrlBuilder.new('search')
      .addParam('q', q)
      .addParam('category', this.getCategoryName())
      .toString();

    return this.api.cacheGet(url);
  }

  public advancedSearch(s: Search): Promise<AdvancedSearchResult> {
    const url = UrlBuilder.new('advanced-search')
      .addParams(s)
      .toString();

    return this.api.cacheGet(url);
  }

  public getItems(page: number) {
    const url = UrlBuilder.new('items')
      .addParam('page', String(page))
      .addParam('category', this.getCategoryName())
      .toString();

    return this.api.get(url)
      .then(result => {
        this.searchComplete.emit(result);
        return result;
      });
  }

  public async getSubsItems(page: number) {
    const s: Search = {
      category: this.getCategoryName(),
      page,
      subsOnly: true
    };

    const result = await  this.advancedSearch(s);
    return result;
  }

  public getFavorites(page: number) {
    const url = UrlBuilder.new('u/favorites')
      .addParam('page', String(page))
      .addParam('category', this.getCategoryName())
      .toString();

    return this.api.get(url)
      .then(result => {
        this.searchComplete.emit(result);
        return result;
      });
  }

  public getDictionary(page: number): Promise<Dictionary> {
    const url = UrlBuilder.new('dictionary')
      .addParam('page', String(page))
      .addParam('category', this.getCategoryName())
      .toString();

    return this.api.cacheGet(url)
      .then((names: ItemName[]) => {
        return Dictionary.fromItemNames(names);
      });
  }

  public postImage(fileUri: string): Promise<PhotoResource> {
    return this.api.postImage('u/image', fileUri)
      .catch(err => {
        console.warn("error in postImage", err);
        if (err === 'cordova_not_available') {
          //Create a resource just for testing
          return { imgBase: "test-silk", type: "photo", extension: "jpg", id: -1 };
        }

        throw new Error(err);
      });
  }

  public postItem(item: Item) {
    return this.api.post('u/item', item)
      .then(item => {
        this.itemAdded.emit(item);
        return item;
      });
  }

  public voteForName(name: ItemName) {
    return this.api.post('u/vote-for-name', name);
  }

  public vote(type: string, itemId: number, vote) {
    //todo add type to vote param
    console.log("vote is type: ", typeof vote);
    return this.api.post('u/vote', { itemId, type, vote });
  }

  public voteForComment(comment: Comment, vote: number) {
    return this.api.post('u/vote-for-comment', { id: comment.id, vote });
  }

  public async sendComment(text: string, itemId: number, parentId?: number): Promise<Comment> {
    text = text.trim();
    const result = await this.api.post('u/comment', { itemId, text, parentId });
    return result.comment;
  }

  public async getCommentThread(commentId: number) {
    const result = await this.api.get(`comment-thread/${commentId}`);

    return result.comments;
  }

  public async loadMoreComments(offset: number, amount: number, commentId?: number, itemId?: number) {
    if (!itemId && !commentId) throw new Error("I need some context");
    
    let result;
    if (commentId) {
      result = await this.api.get(`comment-thread/${commentId}?offset=${offset}&amount=${amount}`);  
    } else {
      result = await this.api.get(`item-comment-thread/${itemId}?offset=${offset}&amount=${amount}`);
    }    

    return result.comments;
  }

  public getItemInfo(itemId: number): Promise<ItemInfo> {
    return this.api.get('item-info/' + itemId);
  }

  public love(itemId: number) {

    return this.api.post('u/love', { id: itemId });
  }

  public unlove(itemId: number) {
    return this.api.delete('u/love/' + itemId);
  }

}

export class UrlBuilder {
  params: { key: string, value: string }[] = [];

  constructor(private base: string) { }

  static new(base: string): UrlBuilder {
    const u = new UrlBuilder(base);

    return u;
  }

  public addParams(object: any) {
    for (let key in object) {
      if (!object.hasOwnProperty(key)) continue;

      let value = object[key];

      if (Array.isArray(value)) value = value.join(',');

      this.addParam(key, value);
    }

    return this;
  }

  public addParam(key: string, value: string | number): UrlBuilder {
    if (value === null || value === undefined || value === '') return this;

    key = key.trim();
    value = String(value).trim();

    this.params.push({ key, value });
    return this;
  }

  public toString(): string {
    let string = this.base;

    if (this.params.length === 0) return string;

    let pairs = [];
    for (let p of this.params) {
      pairs.push(encodeURIComponent(p.key) + '=' + encodeURIComponent(p.value));
    }

    string += '?' + pairs.join('&');

    return string;
  }
}