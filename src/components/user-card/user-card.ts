import { Component, Input, OnChanges } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController } from 'ionic-angular';

import { SendMessageModalComponent } from '../../chat-module/send-message-modal/send-message-modal';
import { ENV } from '../../environments/environment';
import { Author } from '../../model/Author';
import { ImagePipe } from '../../pipes/image/image';
import { UserService } from '../../providers/user-service';
import { ChatPage } from '../../chat-module/chat/chat';

@Component({
  selector: 'user-card',
  templateUrl: 'user-card.html'
})
export class UserCardComponent implements OnChanges {

  @Input() author: Author;
  isMe: boolean;

  constructor(
    private sharing: SocialSharing,
    private translate: TranslateService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) {

  }

  public ngOnChanges() {
    if (this.author) {
      this.isMe = (this.userService.user && this.author.userName === this.userService.user.userName);
    }
  }

  public getImage(base: string) {
    let url: string;

    const p = new ImagePipe();
    url = p.transform(base, 'lg');

    return `url(${url})`;
  }

  public sendMessage() {
    //todo Check if we already have a conversation

    const modal = this.modalCtrl.create(SendMessageModalComponent, { author: this.author }, {cssClass: 'modal-sm'});
    modal.onDidDismiss(result => {
      if (result.message) {
        this.navCtrl.push(ChatPage, { author: this.author });
      }
    });
    modal.present();
  }

  public share() {
    const settings = ENV;
    const message = `${this.translate.instant('share.profile-message', this.author)}`;
    const subject = `${this.translate.instant('title')}`;
    const link = `${settings.shareRoot}@/${this.author.stub}`;
    this.sharing.share(message, subject, undefined, link);
  }

}
