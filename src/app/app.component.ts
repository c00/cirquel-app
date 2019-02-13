import { Component, ElementRef, ViewChild } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, ModalController, Nav, Platform, PopoverController } from 'ionic-angular';
import { User } from 'model/User';

import { AgreementModalComponent } from '../components/agreement-modal/agreement-modal';
import { SelectCategoryModalComponent } from '../components/select-category-modal/select-category-modal';
import { SupportModalComponent } from '../components/support-modal/support-modal';
import { Category } from '../model/Category';
import { PushNotification, PushType } from '../model/PushNotification';
import { UserSettings } from '../model/UserSettings';
import { DictionaryPage } from '../pages/dictionary/dictionary';
import { FavoritesPage } from '../pages/favorites/favorites';
import { HomePage } from '../pages/home/home';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { SubsPage } from '../pages/subs/subs';
import { UserItemsPage } from '../pages/user-items/user-items';
import { DialogService } from '../providers/dialogs';
import { ItemService } from '../providers/item-service';
import { PushService } from '../providers/push-service';
import { UserService } from '../providers/user-service';
import { UserSettingsProvider } from '../providers/user-settings';
import { AnnouncementService } from '../providers/announcement-service';
import { AnnouncementModalComponent } from '../components/announcement-modal/announcement-modal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  user: User;
  pages: MenuItem[] = [
    { id: 1, icon: "time", title: 'menu.recent', component: HomePage, isRoot: true, selected: true },
    { id: 2, icon: "bookmark", title: 'menu.dictionary', component: DictionaryPage, isRoot: true, selected: false },
    { id: 6, icon: "person-add", title: 'menu.subs', component: SubsPage, isRoot: true, selected: false, requireLogin: true },
    { id: 3, icon: "heart", title: 'menu.favorites', component: FavoritesPage, isRoot: true, selected: false, requireLogin: true },
    { id: 4, icon: "contact", title: 'menu.my-contributions', component: UserItemsPage, isRoot: false, selected: false, data: { mine: true }, requireLogin: true },
    { id: 5, icon: "search", title: 'menu.search', component: SearchPage, isRoot: true, selected: false },
  ];
  settings: UserSettings;
  rotated: boolean = false;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public userService: UserService,
    private popoverCtrl: PopoverController,
    public userSettingsProvider: UserSettingsProvider,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private ref: ElementRef,
    private push: PushService,
    private deeplinks: Deeplinks,
    private dialogs: DialogService,
    private items: ItemService,
    private as: AnnouncementService,
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready()
    this.splashScreen.hide();
    this.initUser();
    this.setupLanguage();
    this.setupNotifications();
    this.setupDeeplinks();

    this.settings = await this.userSettingsProvider.get();
    await this.initSettings();

    this.as.newAnnouncement.subscribe((announcement) => {
      if (!announcement) return;

      //Show announcement modal
      this.modalCtrl.create(AnnouncementModalComponent, {announcement}).present();
    })
    
  }

  private async initSettings() {
    //Navigate to the last opened page.
    if (this.settings.lastPageId) {
      this.openPage(this.getPage(this.settings.lastPageId));
    } else {
      this.openPage(this.getPage(1));
    }

    //Open menu
    if (!this.settings.menuShown) {
      this.menuCtrl.open();
      this.settings.menuShown = true;
      this.userSettingsProvider.save();
    }

    //Show user agreement
    if (!this.settings.userAgreement) {
      return new Promise((resolve, reject) => {
        const modal = this.modalCtrl.create(AgreementModalComponent, {}, { enableBackdropDismiss: false });
        modal.onDidDismiss(() => {
          resolve();
        });
        modal.present();
      });
    } 
    return;
  }

  private initUser() {
    this.userService.userChanged.subscribe(user => {
      this.user = user;
    });
  }

  private setupLanguage() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  private setupDeeplinks() {
    this.deeplinks.routeWithNavController(this.nav, {
      '/item/:itemId': ItemDetailPage,
      '/@/:userName': UserItemsPage,
    }).subscribe(match => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      console.log('Successfully matched route', match);
    }, nomatch => {
      // nomatch.$link - the full link data
      console.warn('Deeplink error', nomatch);
    });
  }

  public toProfile() {
    this.userSettingsProvider.set('profileClicked', true);
    this.openPage({ icon: "contact", title: 'profile.title', component: ProfilePage, isRoot: false, selected: false });
  }

  public trainingMode() {
    if (!this.rotated) {
      this.rotated = true;
      this.ref.nativeElement.style.transform = 'rotate(180deg)';
    } else {
      this.ref.nativeElement.style.transform = '';
      this.rotated = false;
    }
  }

  public async openPage(page: MenuItem) {
    if (!page) {
      console.warn("No page. Defaulting to home.");
      page = this.pages[0];
    }
    if (page.requireLogin && !this.userService.loggedIn) {
      try {
        await this.dialogs.showLoginModal();
      } catch (err) {
        //Not logged in.
        this.dialogs.showToast("error.login-required", 3000);
        return;
      }
      
    }
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.isRoot) {
      for (let p of this.pages) {
        p.selected = false;
      }
      this.nav.setRoot(page.component, page.data);
      page.selected = true;
      this.userSettingsProvider.set('lastPageId', page.id);
    } else {
      this.nav.push(page.component, page.data);
    }

  }

  private getPage(id: number) {
    return this.pages.find(p => {
      return p.id === id;
    });
  }

  public getName() {
    if (!this.user) return this.translate.instant('menu.not-logged-in');

    if (this.user.firstName || this.user.lastName) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }

    return this.user.userName;
  }

  public getInitials() {
    if (!this.user) return '';

    let parts;
    if (this.user.firstName || this.user.lastName) {
      parts = `${this.user.firstName} ${this.user.lastName}`.split(' ');

      return parts.map(part => part.substring(0, 1)).join('');

    } else {
      return this.user.userName.substring(0, 1);
    }

  }

  public toSupport() {
    //Open up the support modal
    const modal = this.modalCtrl.create(SupportModalComponent, { reason: 'general' });
    modal.present();
  }

  public getMenuBackground() {
    return `url('assets/imgs/${this.settings.category.name}-small.jpg')`;
  }

  public getIcon() {
    return `assets/svg/${this.settings.category.icon}`;
  }

  public selectCategory() {
    this.userSettingsProvider.set('filterClicked', true);

    const modal = this.popoverCtrl.create(SelectCategoryModalComponent, { selected: this.settings.category }, { cssClass: 'backdrop-dark' });

    modal.onWillDismiss((c: Category) => {
      if (!c) return;

      this.userSettingsProvider.setCategory(c);
      this.menuCtrl.close();
    });

    modal.present();
  }

  private setupNotifications() {
    this.push.updates
      .subscribe((n: PushNotification) => {

        if (!n.tap) {
          this.showNotificationToast(n);
          return;
        }

        //Navigate to the correct page
        if (n.type === PushType.LOVE) {
          this.dialogs.showLoader();
          this.items.getItem(n.itemId)
            .then((item) => {
              this.dialogs.dismissLoader();
              this.nav.push(ItemDetailPage, { item })
            })
            .catch((err) => {
              this.dialogs.dismissLoader();
              throw err;
            });
        } else if (n.type === PushType.NEW_ITEM_FROM_SUB) {
          console.log(n);
          this.dialogs.showLoader();
          this.items.getItem(n.itemId)
            .then((item) => {
              this.dialogs.dismissLoader();
              this.nav.push(ItemDetailPage, { item })
            })
            .catch((err) => {
              this.dialogs.dismissLoader();
              throw err;
            });
        } else {
          //todo add video processed route.
          console.warn("Unknown notification type", n)
        }

        //Else

      });
  }

  private async showNotificationToast(n: PushNotification) {
    const result = await this.dialogs.showToastWithButton(`notification.toast.${n.type}`, n);
    if (result === 'button') {
      console.log("pressed");
    }

  }
}

export interface MenuItem {
  id?: number;
  title: string;
  component: any;
  data?: any;
  isRoot: boolean;
  selected: boolean;
  icon: string;
  requireLogin?: boolean;
}