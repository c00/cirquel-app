import { Component, Input } from '@angular/core';
import { Author } from '../../model/Author';
import { User } from '../../model/User';
import { ImagePipe } from '../../pipes/image/image';
import { DialogService } from '../../providers/dialogs';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ENV } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'user-card',
  templateUrl: 'user-card.html'
})
export class UserCardComponent {

  @Input() author: Author|User;

  constructor(
    private dialogs: DialogService,
    private sharing: SocialSharing,
    private translate: TranslateService,
  ) {
    
  }

  public getImage(base: string) {
    let url;

    const p = new ImagePipe();
    url = p.transform(base, 'lg');

    return `url(${url})`;
  }

  public comingSoon() {
    this.dialogs.showAlert('user.coming-soon-message', 'user.coming-soon-title');
  }

  public share(){
    const settings = ENV;
    const message = `${this.translate.instant('share.profile-message', this.author)}`;
    const subject = `${this.translate.instant('title')}`;
    const link = `${settings.shareRoot}@/${this.author.stub}`;
    this.sharing.share(message, subject, undefined, link);
  }

}
