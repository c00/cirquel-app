import { Injectable, EventEmitter } from '@angular/core';

import { UserSettings } from '../model/UserSettings';
import { Store } from './store';
import { CategoryHelper, Category } from '../model/Category';

@Injectable()
export class UserSettingsProvider {
  
  categoryChanged = new EventEmitter<Category>();
  
  private _settings: UserSettings;
  private ready: Promise<void>;
  
  set settings(s: UserSettings) {
    this._settings = s;
    this.save();
  }

  get settings(): UserSettings {
    return this._settings;
  }
  
  constructor(
    private store: Store,
  ) {
    this.init();
  }
  
  public init() {
    this.ready = this.store.get('userSettings')
    .then((res) => {
      this._settings = res;
    })
    .catch(() => {
      console.warn("No settings yet, setting defaults");
      this.setDefaults();
      this.save();
    });
  }

  public get(): Promise<UserSettings> {
    return this.ready
    .then(() => this._settings);
  }

  /**
   * Will return null if settings isn't yet loaded.
   */
  public getCategorySync(): Category {
    if (!this._settings) return null;

    return this._settings.category;
  }

  public set(key, value) {
    this.get()
    .then(() => {
      if (this._settings[key] === value) return;
      
      this._settings[key] = value;
      this.save();
    });
  }
  
  public save() {
    this.store.set('userSettings', this._settings);
  }
  
  public setCategory(c: Category) {
    this._settings.category = c;
    this.save();
    this.categoryChanged.emit(c);
  }

  private setDefaults() {
    this._settings = {
      category: CategoryHelper.all,
      userAgreement: false,
      menuShown: false,
      profileClicked: false,
      filterClicked: false,
      authorBubbleClicked: false,
    };
  }
}
