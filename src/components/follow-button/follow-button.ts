import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { Author } from '../../model/Author';
import { SocialService } from '../../providers/social-service';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'follow-button',
  templateUrl: 'follow-button.html'
})
export class FollowButtonComponent implements OnChanges, OnDestroy {

  @Input() author: Author
  @Input() buttonStyle = "icon"; //or full
  
  shouldShow = false;
  following = false;
  
  sub;

  public get showIconButton(): boolean {
    //Only show when the style is 'icon'
    if (this.buttonStyle !== 'icon') return false;
    //Only show when we're not yet following
    if (this.following) return false;
    if (!this.shouldShow) return false;
    return true;
  }

  public get showFullButton(): boolean {
    if (this.buttonStyle !== 'full') return false;
    if (!this.shouldShow) return false;
    return true;
  }

  constructor(
    private social: SocialService,
    private userService: UserService,
  ) {
    this.sub = userService.userChanged.subscribe(() => this.updateState());
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }

  public ngOnChanges() {
    this.updateState();
  }

  public async follow() {
    const oldState = this.following;
    
    this.author.following = !this.following;
    this.following = !this.following;

    try {
      const newState = await this.social.follow(this.author.userName, this.author.following);
      this.author.following = newState;
      this.following = newState;
      console.log("new statr", newState);
    } catch (err) {
      this.author.following = oldState;
      this.following = oldState;
      console.error(err);
    }  
    
  }

  private updateState(){
    if (!this.author) {
      //If no author, just hide.
      this.shouldShow = false;
      this.following = false;
    } else if (!this.userService.loggedIn) {
      //If not logged in, return true;
      this.shouldShow = true;
      this.following = false;
    } else if (this.author.userName === this.userService.user.userName) {
      //Don't show button for myself.
      this.shouldShow = false;
      this.following = false;
    } else {
      this.shouldShow = true;
      this.following = this.social.isFollowing(this.author.userName);
    }
  }

}
