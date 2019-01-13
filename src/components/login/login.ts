import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { DialogService } from '../../providers/dialogs';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {
  @Output() toSignup = new EventEmitter();
  @Output() done = new EventEmitter();
  form: FormGroup;
  
  passwordError = false;

  constructor(
    formBuilder: FormBuilder,
    private userService: UserService,
    private dialogs: DialogService,
    private modalCtrl: ModalController,
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  
  public login() {
    this.dialogs.showLoader();
    this.passwordError = false;
    const creds = this.form.value;
    this.userService.login(creds)
    .then((user) => {
      this.done.emit(user);
      this.dialogs.dismissLoader();
    })
    .catch((err) => {
      console.error("Got error", err);
      if (err.statusCode === 422) {
        this.passwordError = true;
      }

      this.dialogs.dismissLoader();
    });
    
  }
  
  public goSignup() {
    this.toSignup.emit();
  }

  public resetPassword() {
    const modal = this.modalCtrl.create(ForgotPasswordModalComponent);
    modal.present();
  }
  
}
