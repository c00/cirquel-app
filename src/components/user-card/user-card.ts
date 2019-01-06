import { Component, Input, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';

import { ENV } from '../../environments/environment';
import { Author } from '../../model/Author';
import { ImagePipe } from '../../pipes/image/image';
import { DialogService } from '../../providers/dialogs';
import { SocialService } from '../../providers/social-service';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'user-card',
  templateUrl: 'user-card.html'
})
export class UserCardComponent implements OnChanges {

  @Input() author: Author;
  isMe: boolean;

  constructor(
    private dialogs: DialogService,
    private sharing: SocialSharing,
    private translate: TranslateService,
    private social: SocialService,
    private userService: UserService,
  ) {

  }

  public ngOnChanges() {
    console.log(this.author);
    if (this.author) {
      this.author.following = this.social.isFollowing(this.author.userName);
      this.isMe = (this.author.userName === this.userService.user.userName);
    }
  }

  public getImage(base: string) {
    let url: string;

    const p = new ImagePipe();
    url = p.transform(base, 'lg');

    return `url(${url})`;
  }

  public comingSoon() {
    this.dialogs.showAlert('user.coming-soon-message', 'user.coming-soon-title');
  }

  public async follow() {
    const oldState = this.author.following;
    const newState = !oldState;

    if (!newState) {
      const result = await this.dialogs.showConfirm('user.unfollow-confirm-message', 'user.unfollow-confirm', 'user.unfollow-ok', 'user.unfollow-cancel', {name: this.author.userName});
      if (!result) return;
    }

    this.author.following = newState;
    try {
      await this.social.follow(this.author.userName, newState);
    } catch (err) {
      this.author.following = oldState;
      throw err;
    }  
  }

  public share() {
    const settings = ENV;
    const message = `${this.translate.instant('share.profile-message', this.author)}`;
    const subject = `${this.translate.instant('title')}`;
    const link = `${settings.shareRoot}@/${this.author.stub}`;
    this.sharing.share(message, subject, undefined, link);
  }

}
