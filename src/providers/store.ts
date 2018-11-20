import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";

@Injectable()
export class Store {
  
  constructor(
    private storage: Storage
  ) {
    this.storage.ready().then(() => {
      console.log("Storage ready. Driver: " + this.storage.driver);
    });
  }
  
  private tryParse(value: string){
    try {
      return JSON.parse(value);
    } catch (e) {
      return value
    }
  }
  
  public remove(key){
    return this.storage.remove(key);
  }
  
  //region storage
  /**
  * Returns a promise with the value stored at 'key'.
  * Will reject when key not found. Will return an object if an object was set.
  * @param key
  * @returns {Promise<any>}
  */
  public get(key): Promise<any>{
    return this.storage.get(key)
    .then((value) => {
      if (value === null || value === undefined) {
        throw new Error("no_value_for_key");
      } else {
        return this.tryParse(value);
      }
    });
  }
  
  public set(key: string, value: any){
    //to string
    if (typeof value === 'object') value = JSON.stringify(value);
    
    return this.storage.set(key, value);
  }
  //endregion
  
}
