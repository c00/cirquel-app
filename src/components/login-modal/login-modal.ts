import { Component, ViewChild } from '@angular/core';
import { Slides, ViewController } from 'ionic-angular';

import { User } from '../../model/User';

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.html',
  //providers: [UserService]
})
export class LoginModalComponent {
  @ViewChild(Slides) slides: Slides;

  constructor(
    private viewCtrl: ViewController,
    //private userService: UserService,
  ) {
    
  }

  public ionViewDidLoad() {
    this.slides.lockSwipes(true);
  }

  public toSignup() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

  public toLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  public dismiss(user?: User) {
    this.viewCtrl.dismiss(user);
  }
}
