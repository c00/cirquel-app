import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ActionSheetController,
  AlertController,
  Loading,
  LoadingController,
  ModalController,
  PopoverController,
  ToastController,
} from 'ionic-angular';

import { ContextMenuComponent, ContextMenuItem } from '../components/context-menu/context-menu';
import { LoginModalComponent } from '../components/login-modal/login-modal';
import { User } from '../model/User';

@Injectable()
export class DialogService {
  static INTERNET_ERROR = 'error.no-internet';
  static SERVER_ERROR = 'error.server-error';
  static TIMEOUT_ERROR = 'error.timout';
  
  private loader: Loading = null;
  private showingOfflineToast: boolean = false;
  constructor(
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController, 
    private toast: ToastController,
    private popCtrl: PopoverController,
    private modalCtrl: ModalController, 
    private translate: TranslateService,
    private asCtrl: ActionSheetController,
  ) {
    
  }
  
  public showLoader() {
    if (this.loader) {
      console.warn("Loader already showing.");
      return;
    }
    
    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
    });
    
    this.loader.present();
  }
  
  public dismissLoader() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }
  
  public showUndoToast(message: string){
    //Build message
    let body: any = {
      message: this.translate.instant(message),
      duration: 4000,
      showCloseButton: true,
      closeButtonText: this.translate.instant('undo'),
    };    
    
    return new Promise((resolve, reject) => {
      let toast = this.toast.create(body);
      
      toast.onWillDismiss((_null, role) => {
        switch (role) {
          case 'close':
          resolve('undo');
          break;
          case 'backdrop':
          resolve('timedout');
          break;
          case 'custom':
          resolve('custom');
          break;
        }
      });
      
      toast.present();
    }); 
  }
  
  
  public showToast(message: string, milliseconds?: number, params?: any){
    //Guard for multiple offline messages
    if(message == DialogService.INTERNET_ERROR && this.showingOfflineToast === true) return;
    
    //Set showing offline message flag if that's the message we want to show
    if(message == DialogService.INTERNET_ERROR) this.showingOfflineToast = true;
    
    //Build message
    let body: any = {
      message: this.translate.instant(message, params),
    };
    
    if (milliseconds) {
      body.duration = milliseconds;
    } else {
      body.showCloseButton = true;
    }
    
    let toast = this.toast.create(body);
    toast.onDidDismiss(() => {
      //Set reset offline message flag in dismiss
      if(message == DialogService.INTERNET_ERROR)
      this.showingOfflineToast = false;
    });
    
    toast.present();
  }
  
  public showAlert(message: string, title?: string, okButton?: string): Promise<any> {
    return new Promise((accept, reject) => {
      if (!okButton) okButton = 'ok';
      
      let alert = this.alertCtrl.create({
        title: (title) ? this.translate.instant(title) : undefined,
        subTitle: this.translate.instant(message),
        buttons: [
          { 
            text: this.translate.instant(okButton),
            handler: () => { accept(); }
          }
        ]
      });
      alert.present();
    });    
  }
  
  public showConfirm(message: string, title: string, okButton?: string, cancelButton?: string) : Promise<any> {
    
    return new Promise<any>((resolve, reject) => {
      if (!okButton) okButton = 'ok';
      if (!cancelButton) cancelButton = 'cancel';
      
      let alert = this.alertCtrl.create({
        title: this.translate.instant(title),
        subTitle: this.translate.instant(message),
        buttons: [
          {
            text: this.translate.instant(cancelButton),
            role: 'cancel',
            handler: () => { reject(); }
          },
          {
            text: this.translate.instant(okButton),
            handler: () => { resolve(); }
          }
        ]
      });
      
      alert.present();
    }); 
    
  }
  
  public showPopover(items: ContextMenuItem[], title?: string, hideCancel?: boolean, event?: Event) {
    
    return new Promise<any>((resolve, reject) => {
      let data = {
        title,
        items,
        hideCancel
      };
      
      let p = this.popCtrl.create(ContextMenuComponent, data);
      
      p.onWillDismiss(value => {
        resolve(value);
      });
      
      p.present({ev: event});
    });
    
  }
  
  public showLoginModal(): Promise<User> {     
    return new Promise<User>((resolve, reject) => { 
      let modal = this.modalCtrl.create(LoginModalComponent); 
      
      modal.onDidDismiss((user: User) => { 
        console.log("modal dismissed");
        if (user) return resolve(user); 
        
        return reject(); 
      }); 
      
      modal.present();  
    }); 
  }
  
  public showActionSheet(items: ContextMenuItem[], title: string, hideCancel?: boolean) {
    
    return new Promise<any>((resolve, reject) => {
      
      let buttons = [];
      for (let i of items) {
        buttons.push({
          text: this.translate.instant(i.title),
          icon: i.icon,
          handler: () => resolve(i.value)
        });
      }

      if (!hideCancel) {
        buttons.push({
          text: this.translate.instant('cancel'),
          role: 'cancel',
          handler: () => reject()
        });
      }
      
      let actionSheet = this.asCtrl.create({
        title: this.translate.instant(title),
        buttons
      });
      
      //If it hasn't already, it should now.
      actionSheet.onDidDismiss(() => reject());

      actionSheet.present();      
    });
  }
}
