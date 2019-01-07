import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { ApiProvider } from './api';
import { Cache } from './cache';
import { DialogService } from './dialogs';
import { UserService } from './user-service';
import { Author } from '../model/Author';

@Injectable()
export class SocialService {
  
  constructor(
    private cache: Cache,
    private api: ApiProvider,
    private userService: UserService,
    private dialogs: DialogService,
  ) {

  }

  public setFollowing(a: Author) {
    a.following = this.isFollowing(a.userName);
  }

  public isFollowing(userName: string): boolean {
    const sub = this.cache.userSubscriptions.find(s => s.followee && s.followee.userName === userName);
    return Boolean(sub);
  }

  public async follow(userName: string, newState: boolean) {
    
    try {
      if (!this.userService.loggedIn) await this.dialogs.showLoginModal();
    } catch (err) {
      //not logged in
      this.dialogs.showToast("error.login-required-to-follow", 3000);
      throw err;
    }

    //Are you sure?
    if (!newState) {
      const result = await this.dialogs.showConfirm('user.unfollow-confirm-message', 'user.unfollow-confirm', 'user.unfollow-ok', 'user.unfollow-cancel', {name: userName});
      if (!result) return true;
    }

    try {
      if (newState) {
        this.dialogs.showToast('user.follow-toast', 4000, {user: userName});
        await this.subscribe(userName);
      } else {
        await this.unsubscribe(userName);
      }
    } catch (err) {
      this.dialogs.showToast('user.follow-error-toast', 2500, {user: userName});
      throw err;
    }
    return newState;    
  }

  private async subscribe(userName: string) {
    const response = await this.api.post('u/follow', { userName });

    const sub = this.cache.userSubscriptions.find(s => s.followee.userName === userName);
    if (sub) {
      console.warn("That's weird, we already have that sub... Not adding it again!");
      return;
    }
    
    this.cache.userSubscriptions.push(response.sub);
  }

  private async unsubscribe(userName: string) {
    await this.api.post('u/unfollow', { userName });

    const index = this.cache.userSubscriptions.findIndex(s => s.followee.userName === userName);
    if (index) this.cache.userSubscriptions.splice(index, 1);
  }
}