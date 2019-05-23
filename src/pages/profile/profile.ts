import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { ContextMenuItem } from '../../components/context-menu/context-menu';
import { ENV } from '../../environments/environment';
import { User } from '../../model/User';
import { ImagePipe } from '../../pipes/image/image';
import { LocalImagePipe } from '../../pipes/image/localImage';
import { DialogService } from '../../providers/dialogs';
import { NativeImageProvider } from '../../providers/native-image';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  sub: Subscription;
  form: FormGroup;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private images: NativeImageProvider,
    private userService: UserService,
    private dialogs: DialogService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private sharing: SocialSharing,
    private platform: Platform,
    private sanitize: DomSanitizer,
  ) {
    
  }
  
  public ionViewCanEnter(){
    if (this.userService.loggedIn) return true;
    
    return this.dialogs.showLoginModal();
  }
  
  
  public ionViewDidLoad() {
    this.user = this.userService.user;
    
    //Setup the form
    this.form = this.formBuilder.group({
      imgBase:   '',
      imgUri:    '',
      enablePush: Boolean(this.user.enablePush)
    });

    if (this.user) {
      this.form.get('imgBase').setValue(this.user.imgBase);
    }

    this.sub = this.userService.userChanged.subscribe((user) => {
      if (!user) {
        this.navCtrl.pop();
        return;
      }
      this.user = user;
      this.form.get('imgBase').setValue(this.user.imgBase);
    });
  }
  
  public ionViewWillLeave() {
    this.sub.unsubscribe();
  }
  
  public logout() {
    this.userService.logout();
  }
  
  public getImage() {
    let url;

    if (this.form.get('imgUri').value) {
      url = this.form.get('imgUri').value;
      
      //Fix for IOS file url stuff
      const li = new LocalImagePipe(this.platform, this.sanitize);
      url = li.transform(url);
  
    } else if (this.form.get('imgBase').value) {
      const p = new ImagePipe();
      url = p.transform(this.form.get('imgBase').value, 'lg');
    } else {
      url = 'assets/imgs/blank_avatar_lg.jpg';
    }

    return `url(${url})`;
  }
  
  public showMediaSheet() {
    const items: ContextMenuItem[] = [
      { title: "trick.media.camera", value: "camera", icon: "camera" },
      { title: "trick.media.gallery", value: "gallery", icon: "image" },
    ]
    this.dialogs.showActionSheet(items, 'profile.media-title')
    .then(r => {      
      if (r === 'camera') {
        this.getPictureFromDevice(true);
      } else if (r === 'gallery') {
        this.getPictureFromDevice(false);
      }
    })
    .catch(() => { })
  }
  
  private getPictureFromDevice(fromCamera: boolean) {    
    this.images.getPicture(fromCamera)
    .then(result => {
      if (!result) return;

      this.form.get('imgUri').setValue(result);

      //Save
      this.dialogs.showToast('profile.image-updating', 1000);
      return this.userService.updateProfileImage(result)
      .then(() => {
        this.dialogs.showToast('profile.image-updated', 3000);
      })
      .catch(() => {
        this.form.get('imgUri').setValue('');
        this.dialogs.showToast('profile.image-update-error');
      });
    })
    .catch(() => {});
  }
  
  public hasImage() {
    return (this.form.value.imgBase !== '' || this.form.value.imgUri !== '');
  }

  public getShareUrl() {
    const settings = ENV;
    return `${settings.shareRoot}@/${this.user.stub}`;
  }

  public share(){
    const settings = ENV;
    const message = `${this.translate.instant('share.my-profile-message', this.user)}`;
    const subject = `${this.translate.instant('title')}`;
    const link = `${settings.shareRoot}@/${this.user.stub}`;
    this.sharing.share(message, subject, undefined, link);
  }

  public async togglePush() {
    const oldState = Boolean(this.user.enablePush);
    const newState = Boolean(this.form.get('enablePush').value);

    if (newState !== oldState) {
      this.user.enablePush = newState;
      console.log("We should switch");
      this.userService.enablePush(newState)
      .catch(() => {
        this.form.get('enablePush').setValue(oldState);
        this.user.enablePush = oldState;
      });
    }
  }
}
