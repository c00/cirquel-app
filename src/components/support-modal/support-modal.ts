import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';

import { DialogService } from '../../providers/dialogs';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'support-modal',
  templateUrl: 'support-modal.html'
})
export class SupportModalComponent {
  reason: string;
  form: FormGroup;
  loggedIn = false;
  isReport = false;

  reasons = [
    'general',
    'bug',
    'support',
    'content',
    'contribute',
    'compliment'
  ];

  contentReasons = [
    'bad-language',
    'bad-media',
    'copyright',
    'bullying',
    'other'
  ];

  constructor(
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private viewCtrl: ViewController,
    private dialogs: DialogService,
  ) {
    //Setup the form
    this.form = this.formBuilder.group({
      name:        ['', [Validators.required, Validators.maxLength(100)] ],
      email:       ['', [Validators.required, Validators.email] ],
      reason:      ['', Validators.required],
      subject:     ['', Validators.required],
      description: '',
      itemId:      '',
      contentReason: '',
    });

    //Set the defaults
    this.form.get('reason').setValue(this.navParams.get('reason'));
    const itemId = this.navParams.get('itemId');
    this.form.get('itemId').setValue(itemId);
    if (itemId) {
      this.isReport = true;
      this.form.get('subject').setValue("Report content");
    }

    userService.ready()
    .then(() => userService.isLoggedInWithReject())
    .then(() => {
      this.loggedIn = true;
      this.form.get('email').setValue(this.userService.user.email);
      this.form.get('name').setValue(this.userService.user.userName);
    })
    .catch(() => {/* fine. */});
  }

  public add() {
    if (this.form.invalid || (this.form.value.reason === 'content' && !this.form.value.contentReason)) {
      //complain
      this.dialogs.showToast('support-modal.form-incomplete', 3000);
      return;
    }

    this.dialogs.showLoader();
    this.userService.sendSupport(this.form.value)
    .then(() => {
      this.dialogs.showToast('support-modal.request-received', 3000);
      this.dialogs.dismissLoader();
      this.dismiss();
    })
    .catch(() => {
      this.dialogs.dismissLoader();
      this.dialogs.showToast('support-modal.request-error');
    });


  }
  
  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
