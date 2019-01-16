import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as zxcvbn from 'zxcvbn';
import { UserService } from '../../providers/user-service';
import { ModalController } from 'ionic-angular';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal';

@Component({
  selector: 'signup',
  templateUrl: 'signup.html'
})
export class SignupComponent {
  @Output() toLogin = new EventEmitter();
  @Output() done = new EventEmitter();
  form: FormGroup;
  passwordBlurred = false;
  password2Blurred = false;
  apiError = null;
  
  constructor(
    formBuilder: FormBuilder,
    private userService: UserService,
    private modalCtrl: ModalController,
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)] ],
      password1: ['', [Validators.required, this.validatePassword()] ],
      password2: ['', [Validators.required, this.passwordsAreSame()] ],
    });
  }
  
  validatePassword(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const result = zxcvbn(control.value);

      if (result.score > 0) return null;
      return { weakPassword: true };
    };
  }

  passwordsAreSame(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      
      if (!control.parent) return null;
      if (control.value === control.parent.get('password1').value) return null;

      return { passwordDiff: true };
    };
  }
  
  public register() {
    const creds = this.form.value;
    this.userService.register(creds)
    .then(user => {
      this.done.emit(user);
    })
    .catch(err => {
      console.error(err);
      this.apiError = err.data.reason;
    });
  }
  
  public goLogin(){
    this.toLogin.emit();
  }

  public resetPassword() {
    const modal = this.modalCtrl.create(ForgotPasswordModalComponent);
    modal.present();
  }
  
}
