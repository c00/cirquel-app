import { Component } from '@angular/core';
import { Cache } from '../../providers/cache';
import { UserSettingsProvider } from '../../providers/user-settings';
import { UserSettings } from '../../model/UserSettings';
import { Author } from '../../model/Author';
import { UserItemsPage } from '../../pages/user-items/user-items';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'subs-banner',
  templateUrl: 'subs-banner.html'
})
export class SubsBannerComponent {

  settings: UserSettings;
  showOnboarding = false;

  constructor(private navCtrl: NavController, public cache: Cache, private userSettings: UserSettingsProvider) {
    this.load();
  }

  private async load() {
    this.settings = await this.userSettings.get();
    if (!this.settings.subsBannerShown) {
      this.showOnboarding = true;

      if (this.cache.userSubscriptions.length > 0) this.userSettings.set('subsBannerShown', true);
    }
  }

  public toAuthor(a: Author) {
    this.navCtrl.push(UserItemsPage, { userName: a.userName });
  }

}
