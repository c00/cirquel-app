import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { UserSubscription } from '../model/UserSubscription';
import { BehaviorSubject } from 'rxjs';

/**
 * This provider just stores a bunch of variables that are useful throughout the app.
 * 
 * It should have no dependencies, so that all other providers can link to it, without circular dependency hell.
 *
 * @export
 * @class Cache
 */
@Injectable()
export class Cache {
  userSubscriptions: UserSubscription[] = [];

  public newMessageCountChange = new BehaviorSubject<Number>(0);
  private _newMessageCount = 0;
  set newMessageCount(value: number) {
    if (value !== this._newMessageCount);
    this._newMessageCount = value;
    this.newMessageCountChange.next(value);
  }
  get newMessageCount(): number {
    return this._newMessageCount
  }


  constructor() {
    
  }

  public clear() {
    this.userSubscriptions = [];
  }

}
