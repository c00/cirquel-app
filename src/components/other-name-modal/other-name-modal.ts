import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchValueComponent } from '../search-value/search-value';
import { ValueResult } from '../../model/ValueResult';
import { SearchState } from '../../model/PageState';

@Component({
  selector: 'other-name-modal',
  templateUrl: 'other-name-modal.html'
})
export class OtherNameModalComponent {
  form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
  ) {

    //Setup the form
    this.form = formBuilder.group({
      name:          ['', [Validators.required, Validators.maxLength(100)]],
      variation:     ['', Validators.maxLength(100)],
    });
  }

  public searchValue(type) {
    const value = this.form.get(type).value;
    let modal = this.modalCtrl.create(SearchValueComponent, { type, value, for: SearchState.FOR_NAMING });     
    modal.onDidDismiss((val: ValueResult) => {
      if (val) {
        this.form.get(type).setValue(val.name);
      }
    }); 
    
    modal.present();  
  }

  public dismiss(){
    this.viewCtrl.dismiss();
  }

  public add() {
    this.viewCtrl.dismiss(this.form.value);
  }
}
