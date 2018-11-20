import { Component } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
import { UserSettingsProvider } from '../../providers/user-settings';

@Component({
  selector: 'agreement-modal',
  templateUrl: 'agreement-modal.html'
})
export class AgreementModalComponent {


  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
    private userSettingsProvider: UserSettingsProvider
  ) {
    
  }

  public accept() {
    this.userSettingsProvider.settings.userAgreement = true;
    this.userSettingsProvider.save();
    this.viewCtrl.dismiss();
  }

  public decline() {
    this.platform.exitApp();
  }

  public toUA() {
    this.toLink('https://cirquelapp.com/user-agreement.txt');
  }

  public toPP() {
    this.toLink('https://cirquelapp.com/privacy-policy.txt');
  }

  private toLink(link) {
    window.open(link, '_system', 'location=yes');
  }

}
