import { Component, Input, OnChanges } from '@angular/core';
import { Item, ItemName } from '../../model/Item';
import { ItemService } from '../../providers/item-service';
import { DialogService } from '../../providers/dialogs';
import { UserService } from '../../providers/user-service';
import { NavController, ModalController } from 'ionic-angular';
import { ItemDetailPage } from '../../pages/item-detail/item-detail';
import { CategoryHelper } from '../../model/Category';
import { VoteModalComponent } from '../vote-modal/vote-modal';
import { ContextMenuItem } from '../context-menu/context-menu';
import { SupportModalComponent } from '../support-modal/support-modal';
import { UserItemsPage } from '../../pages/user-items/user-items';
import { UserSettings } from '../../model/UserSettings';
import { UserSettingsProvider } from '../../providers/user-settings';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { ENV } from '@app/env';
import { SocialService } from '../../providers/social-service';

@Component({
  selector: 'item',
  templateUrl: 'item.html'
})
export class ItemComponent implements OnChanges {
  
  @Input() item: Item;
  showMaxAltNames = 2;
  settings: UserSettings;
  
  constructor(
    private itemService: ItemService,
    private dialogs: DialogService,
    private userService: UserService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private settingsProvider: UserSettingsProvider,
    private sharing: SocialSharing,
    private social: SocialService,
    private translate: TranslateService,
    ) {
      this.settingsProvider.get().then(s => this.settings = s);
    }

    public ngOnChanges() {
      if (this.item) this.social.setFollowing(this.item.author);
    }
    
    public toAuthor() {
      this.settingsProvider.set('authorBubbleClicked', true);

      this.navCtrl.push(UserItemsPage, { userName: this.item.author.userName });
    }
    
    public getAltNames(): string {
      let names = [];
      let count = 1;
      for (let n of this.item.otherNames) {
        
        if (count > this.showMaxAltNames) break;
        
        let name = n.name;
        if (n.variation) name += ", " + n.variation;
        names.push(name);
        count++;
      }
      
      return names.join('; ');
    }
    
    public getColor() {
      return CategoryHelper.getColor(this.item.category);
    }
    
    public tryLove() {
      
      this.userService.isLoggedInWithReject()
      .catch(() => this.dialogs.showLoginModal())
      .then(() => {
        //Logged in.
        this.loveItem();
      })
      .catch(() => {
        this.dialogs.showToast("error.login-required-to-love", 3000);
      });
      
    }
    
    private loveItem(){
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
    
    public more() {
      this.navCtrl.push(ItemDetailPage, {item: this.item});

      //todo find out if we are at root, and if not, pop before pushing.
    }

    public async follow() {
      this.dialogs.showToast('user.follow-toast', 4000, {user: this.item.author.userName});
      this.item.author.following = true;
      try {
        await this.social.follow(this.item.author.userName, true);
      } catch (err) {
        this.dialogs.showToast('user.follow-error-toast', 2500, {user: this.item.author.userName});
        this.item.author.following = false;
        throw err;
      }  
    }
    
    public voteDialog() {
      const modal = this.modalCtrl.create(VoteModalComponent, {type: 'name', item: this.item }, {cssClass: 'modal-sm', enableBackdropDismiss: true});
      
      modal.onDidDismiss((value) => {
        if (!value) return;
        this.voteForName(value);
      });
      
      modal.present();
    }

    public share(){
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
    
    private voteForName(name: ItemName) {
      name.itemId = this.item.id;
      
      this.itemService.voteForName(name)
      .then((result) => {
        this.item.itemName = result.item.itemName;
        this.item.itemNameId = result.item.itemNameId;
        this.item.otherNames = result.item.otherNames;
        
        this.dialogs.showToast('item.name-vote-toast', 3000, {name: name.name});
      });
      
    }
    
  }
  