import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams, normalizeURL } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { ContextMenuItem } from '../../components/context-menu/context-menu';
import { SearchValueComponent } from '../../components/search-value/search-value';
import { CategoryHelper } from '../../model/Category';
import { Item } from '../../model/Item';
import { SearchState } from '../../model/PageState';
import { BaseResource } from '../../model/Resources';
import { ValueResult } from '../../model/ValueResult';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { NativeImageProvider } from '../../providers/native-image';
import { UserService } from '../../providers/user-service';
import { VideoService } from '../../providers/video-service';
import { UserSettingsProvider } from '../../providers/user-settings';

@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {
  sub: Subscription;
  categories = CategoryHelper.categories;
  form: FormGroup;
  formSubmitted = false;
  
  constructor(
    formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userService: UserService,
    private dialogs: DialogService,
    private modalCtrl: ModalController,
    private images: NativeImageProvider,
    private itemService: ItemService,
    private video: VideoService,
    private settings: UserSettingsProvider,

  ) {
    //Setup the form
    this.form = formBuilder.group({
      name:          ['',      [Validators.required, Validators.maxLength(100)]],
      variation:     ['',      Validators.maxLength(100)],
      resourceType:  ['photo', Validators.required],
      category:      ['silks', Validators.required],
      resourceLink:  ['',      Validators.required],
      videoUri:      '',
      skillLevel:    3,
      flexiLevel:    3,
      strengthLevel: 3,
      venue:         ['',      Validators.maxLength(100)],
      description:   ['',      Validators.maxLength(500)],
      addSkill:      [true],
      addFlexi:      [false],
      addStrength:   [false],
    });
    
    let cat = this.settings.getCategorySync();
    if (cat && cat.name !== 'all') {
      this.form.get('category').setValue(cat.name);
    }
  }
  
  public ionViewCanEnter(){
    if (this.userService.loggedIn) return true;
    return this.dialogs.showLoginModal();
  }
  
  public ionViewDidLoad() {
    this.sub = this.userService.userChanged.subscribe((user) => {
      if (!user) this.navCtrl.pop();
    });
  }
  
  public ionViewWillLeave() {
    this.sub.unsubscribe();
  }
  
  public showMediaSheet() {
    const items: ContextMenuItem[] = [
      { title: "trick.media.camera", value: "camera", icon: "camera" },
      { title: "trick.media.gallery", value: "gallery", icon: "image" },
      { title: "trick.media.video", value: "video", icon: "videocam"},/* 
      { title: "trick.media.youtube", value: "youtube", icon: "logo-youtube" },
      { title: "trick.media.instagram", value: "instagram", icon: "logo-instagram" }, */
    ]
    this.dialogs.showActionSheet(items, 'trick.media.title')
    .then(r => {      
      if (r === 'camera') {
        this.getPicture(r, true);
      } else if (r === 'gallery') {
        this.getPicture(r, false);
      } else if (r === 'video') {
        this.getPicture(r, false);
      }
    })
    .catch(() => {
      console.log("canceled");
    })
  }
  
  public getImage() {
    let link = this.form.get('resourceLink').value;
    return normalizeURL(link);
  }
  
  private getPicture(type: string, fromCamera: boolean) {
    const video = Boolean(type === 'video');
    
    this.images.getPicture(fromCamera, video)
    .then(result => {
      if (type === 'video') {
        //Create thumbnail, set as resourceLink
        //Check if video isn't too long.
        this.form.get('videoUri').setValue(result);
        this.form.get('resourceType').setValue('video');
        
        this.video.getInfo(result)
        .then(r => {
          if (r.duration > 90) {
            this.dialogs.showAlert('item.video-too-long', 'item.video-too-long-title');
            this.form.get('videoUri').reset();
            this.form.get('resourceType').reset();
            return;
          }

          this.form.get('resourceLink').setValue(r.screenUri);
        });
      } else {
        this.form.get('resourceLink').setValue(result);
        this.form.get('resourceType').setValue('photo');
      }
      
    })
    .catch(() => {});
  }
  
  public searchValue(type) {
    const value = this.form.get(type).value;
    let modal = this.modalCtrl.create(SearchValueComponent, {type, value, for: SearchState.FOR_NAMING});
    modal.onDidDismiss((val: ValueResult) => {
      if (val) {
        this.form.get(type).setValue(val.name);
      }
    }); 
    
    modal.present();  
  }
  
  public add() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      console.warn("Form invalid");
      return;
    }
    this.dialogs.showLoader();
    
    const formValue = this.form.value;
    //Note, item will have some extra properties that we don't need... However they don't hurt either.
    //Fields to ignore are "resourceType", "resourceLink" and "add[...]"
    let item: Item = {...formValue};
    if (!formValue.addSkill) item.skillLevel = undefined;
    if (!formValue.addStrength) item.strengthLevel = undefined;
    if (!formValue.addFlexi) item.flexiLevel = undefined;
    
    if (formValue.resourceType === 'photo'){
      //It's a local photo we need to send first.
      this.itemService.postImage(formValue.resourceLink)
      .then((res: BaseResource) => {
        item.resource = res;
        item.resourceId = res.id;
        return this.itemService.postItem(item)
      })      
      .then((item: Item) => {
        this.dialogs.dismissLoader();
        this.navCtrl.pop();
      })
      .catch((err) => {
        this.dialogs.dismissLoader();
        Promise.reject(err);
      });
    } else {
      //It's a video
      this.video.process(item, formValue.resourceLink, formValue.videoUri)
      .then(() => {
        this.dialogs.dismissLoader();
        this.navCtrl.pop();
      })
      .catch((err) => {
        this.dialogs.dismissLoader();
        throw err;
      });
    }
    
  }

  public clearVariation(e){
    e.stopPropagation();
    this.form.get('variation').setValue('');
  }

  public clearVenue(e){
    e.stopPropagation();
    this.form.get('venue').setValue('');
  }
  
  public getIcon() {
    const s = this.form.get('category').value;
    return 'assets/svg/' + CategoryHelper.getIcon(s);
  }
}
