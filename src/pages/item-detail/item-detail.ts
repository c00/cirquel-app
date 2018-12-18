import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, InfiniteScroll } from 'ionic-angular';

import { VoteModalComponent } from '../../components/vote-modal/vote-modal';
import { VoteOptions } from '../../components/vote/vote';
import { Item, ItemName, VoteInfo, ItemInfo } from '../../model/Item';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';
import { UserItemsPage } from '../../pages/user-items/user-items';
import { UserSettingsProvider } from '../../providers/user-settings';
import { UserSettings } from 'model/UserSettings';
import { PageState } from '../../model/PageState';
import { Search } from 'model/Search';
import { CategoryHelper } from '../../model/Category';
import { ENV } from '@app/env';
import { ContextMenuItem } from '../../components/context-menu/context-menu';
import { SupportModalComponent } from '../../components/support-modal/support-modal';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {
  item: Item;
  votes: VoteInfo;
  skillVoteOptions: VoteOptions = {
    text: 'item.skill-question',
    iconLeft: 'flash',
    iconRight: 'flash',
  };
  loggedIn: boolean;
  voteBoxes = {
    name: false,
    skill: false,
    flexi: false,
    strength: false,
  };
  settings: UserSettings;

  //Stuff for related items
  relatedItems: Item[] = [];
  page = 0;
  state = PageState.LOADING;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemService,
    private userService: UserService,
    private dialogs: DialogService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private sharing: SocialSharing,
    private settingsProvider: UserSettingsProvider,
  ) {
    this.item = navParams.get('item');
    this.settingsProvider.get().then(s => this.settings = s);

    if (this.item) this.search();
  }

  public ionViewCanEnter() {
    return this.userService.isLoggedIn()
      .then(() => this.loggedIn = true)
      .catch(() => {
        //Note, if this returns false, the view will not load.
        this.loggedIn = false;
      });
  }

  public ionViewWillEnter() {
    if (this.loggedIn) {
      this.itemService.getItemInfo(this.item.id)
        .then((result: ItemInfo) => {
          this.votes = result.voteInfo;
          this.item.loveNames = result.loveNames;
          this.askRandomQuestion();
        });
    }

    //Load item.
    const itemId = this.navParams.get('itemId');

    if (itemId && !this.item) {
      return this.itemService.getItem(itemId)
        .then((item: Item) => {
          this.item = item;
          this.search();
        });
    }
  }

  public getLoveText(): string {
    //Still loading?
    if (!this.votes) return '';

    //DEBUG
    //todo rearrange html so it looks nicer
    this.item.loveNames = ['co the long name man', 'dude', 'pete', 'phil'];
    this.item.loves = 42;
    //END DEBUG

    if (!this.item.loveNames || this.item.loveNames.length === 0) {
      return this.translate.instant('item.first-love');
    }

    const last = this.item.loveNames[this.item.loveNames.length - 1];
    //If it's just 1 person
    if (this.item.loveNames.length === 1) {
      return this.translate.instant('item.love-name-single', { name: last });
    }
    //If it's less than 5 persons
    if (this.item.loves < 5) {
      const others = this.item.loveNames.slice(0, this.item.loveNames.length - 1);
      return this.translate.instant('item.love-names-some', { last, others: others.join(', ') });
    }
    //If it's a lot
    return this.translate.instant('item.love-names-many', { names: this.item.loveNames.join(', '), count: this.item.loves - this.item.loveNames.length });
  }

  public toAuthor() {
    this.settingsProvider.set('authorBubbleClicked', true);
    this.navCtrl.push(UserItemsPage, { userName: this.item.author.userName });
  }

  public getColor() {
    return CategoryHelper.getColor(this.item.category);
  }

  public share() {
    const settings = ENV;
    const message = `${this.translate.instant('share.item-message', this.item)}`;
    const subject = `${this.translate.instant('title')}`;
    const link = `${settings.shareRoot}item/${this.item.id}`;
    this.sharing.share(message, subject, undefined, link);
  }

  public openMenu(event) {
    const items: ContextMenuItem[] = [
      { title: 'item.report', value: 'report' }
    ];
    this.dialogs.showPopover(items, '', true, event)
      .then(res => {
        if (res === 'report') {
          this.modalCtrl.create(SupportModalComponent, { itemId: this.item.id, reason: 'content' }).present();
        }
      });
  }

  private askRandomQuestion() {

    //Let's build an array of questions we don't have answer to yet.
    let open = [];
    for (let key in this.voteBoxes) {
      if (!this.votes.hasOwnProperty(key)) continue;
      if (this.votes[key]) continue;
      open.push(key);
    }

    //Now let's choose something from that array.
    if (open.length === 0) return;

    const random = Math.floor(Math.random() * open.length);
    this.voteBoxes[open[random]] = true;
  }

  public vote(type, vote) {
    this.voteBoxes[type] = false;
    return this.itemService.vote(type, this.item.id, vote);
  }

  public dismissVoteBox(type) {
    this.voteBoxes[type] = false;
  }

  public voteForName(name: ItemName) {
    const oldItemNameId = this.item.itemNameId;
    //this.votes.name = name.id;
    this.voteBoxes.name = false;
    name.itemId = this.item.id;

    this.itemService.voteForName(name)
      .then((result) => {
        this.item.itemName = result.item.itemName;
        this.item.itemNameId = result.item.itemNameId;
        this.item.otherNames = result.item.otherNames;

        this.votes.name = result.newName.id;

        this.dialogs.showToast('item.name-vote-toast', 3000, { name: name.name });
      })
      .catch(() => {
        //undo setting
        this.votes.name = oldItemNameId;
      });

  }

  public getAltNames(): string {
    let names = [];
    for (let n of this.item.otherNames) {
      let name = n.name;
      if (n.variation) name += ", " + n.variation;
      names.push(name);
    }

    return names.join('; ');
  }

  public tryLove() {

    this.userService.isLoggedIn()
      .catch(() => this.dialogs.showLoginModal())
      .then(() => {
        //Logged in.
        this.loveItem();
      })
      .catch(() => {
        this.dialogs.showToast("error.login-required-to-love", 3000);
      });

  }

  public voteFor(type) {
    const modal = this.modalCtrl.create(VoteModalComponent, { type, item: this.item, vote: this.votes[type] }, { cssClass: 'modal-sm', enableBackdropDismiss: true });

    modal.onDidDismiss((value) => {
      if (!value) return;

      if (type !== 'name') {
        this.itemService.vote(type, this.item.id, value)
          .then(res => {
            this.item[type + 'Level'] = res.newValue;
          });
      } else {
        this.voteForName(value);
      }
    });

    modal.present();
  }

  private loveItem() {
    if (this.item.iLoved) {
      this.item.loves--;
      this.itemService.unlove(this.item.id)
        .catch(() => {
          this.item.loves++;
          this.item.iLoved = !this.item.iLoved;
        });
    } else {
      this.item.loves++;
      this.itemService.love(this.item.id)
        .catch(() => {
          this.item.loves--;
          this.item.iLoved = !this.item.iLoved;
        });
    }
    this.item.iLoved = !this.item.iLoved;
  }

  public search() {
    const s: Search = {
      name: this.item.itemName.displayName,
      page: this.page,
      category: this.item.category,
      excludeItemIds: [this.item.id]
    };

    return this.itemService.advancedSearch(s)
      .then((res) => {
        this.relatedItems.push.apply(this.relatedItems, res.items);

        if (this.state === PageState.LOADING) this.state = PageState.SHOWING;

        if (res.items.length === 0 || res.pages === (this.page + 1)) {
          this.state = PageState.SHOWING_LAST;
        }
      })
      .catch((err) => {
        this.state = PageState.ERROR;
        throw err;
      });
  }

  public loadNextPage(is?: InfiniteScroll) {
    //Check state
    if (this.state !== PageState.SHOWING) {
      if (is) {
        is.complete();
      }
      return;
    }

    this.page++;
    this.search()
      .then((res) => {
        if (is) is.complete();
      })
      .catch((err) => {
        if (is) is.complete();
        console.error(err);
      });

  }

}
