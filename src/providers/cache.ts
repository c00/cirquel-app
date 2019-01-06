import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { UserSubscription } from '../model/UserSubscription';

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

  constructor() {
    
  }

  public clear() {
    this.userSubscriptions = [];
  }

}
