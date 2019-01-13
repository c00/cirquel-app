import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { ViewController } from 'ionic-angular';
import { DialogService } from '../../providers/dialogs';

@Component({
  selector: 'forgot-password-modal',
  templateUrl: 'forgot-password-modal.html'
})
export class ForgotPasswordModalComponent {
  form: FormGroup;
  apiError = null;
  
  constructor(
    private viewCtrl: ViewController,
    formBuilder: FormBuilder,
    private userService: UserService,
    private dialogs: DialogService,
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss('close');
  }

  public async reset() {
    this.dialogs.showLoader();
    try {
      await this.userService.requestPasswordReset(this.form.value.email);
      this.dialogs.dismissLoader();

      await this.dialogs.showAlert("forgot-password-modal.sent-message");
      this.dismiss();
    } catch (err) {
      if (err.data) {
        this.apiError = err.data.reason;
      } else {
        this.apiError = "error.server-error";
      }
      console.error(err);
      this.dialogs.dismissLoader();
    }
    
  }

}
