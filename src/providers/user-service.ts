import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { EventEmitter, Injectable } from '@angular/core';

import { User } from '../model/User';
import { ApiProvider } from './api';
import { Store } from './store';
import { RegisterCredentials, LoginCredentials } from '../model/Credentials';
import { Platform } from 'ionic-angular';
import { SupportRequest } from 'model/SupportRequest';
import { PushService } from './push-service';

@Injectable()
export class UserService {
  loggedIn: boolean = false;
  user: User = undefined;
  userChanged = new EventEmitter<User|null>();
  isFirstUse = true;
  private verifyQ: Promise<void>;
  
  constructor(
    private api: ApiProvider,
    private store: Store,
    private push: PushService,
    private platform: Platform,
  ) {
    this.platform.ready()
    .then(() => this.init());
  }
  
  private init() {
    this.store.get('isFirstUse')
    .then(() => { this.isFirstUse = false; })
    .catch(() => { this.isFirstUse = true; });
    
    this.ready();
  }
  
  public markFirstUse() {
    this.store.set('isFirstUse', false);
    this.isFirstUse = false;
  }
  
  //region storage
  public getUserFromStorage(): Promise<any> {
    
    return this.store.get('user')
    .then(user => {
      this.user = user;
      this.loggedIn = true;
      this.api.setToken(user.session.token);
      return user;
    })
    .catch(() => Promise.reject('no_user_in_storage'));
  }
  
  private saveUserToStorage(user: User) {
    this.store.set('user', user)
    .then()
    .catch(err => {
      console.error("Nope.", err);
    });
    
  }
  //endregion
  
  public ready(): Promise<void> {
    if (!this.verifyQ){
      this.verifyQ = this.getUserFromStorage()
      .then(() => this.checkSession() )
      .catch((res) => { 
        //User is not verified.
        console.warn(res);
        
        //Don't reject the promise, the promise only cares whether the checking process is complete.
      });
    }
    
    return this.verifyQ;
  }

  /**
   * This is purely a check function to make chaining promises easy.
   */
  public isLoggedIn(): Promise<void> {
    if (this.loggedIn) return Promise.resolve();

    return Promise.reject("not_logged_in");
  }
  
  private checkSession(): Promise<any> {
    return this.api.get('check-session\\' + this.user.session.token)
    .then((res) => {
      this.processUserResponse(res);
      return res.user;
    })
    .catch(error => {
      const code = (error && error.statusCode) ? error.statusCode : 999;
      
      if (code === 401) {
        this.logout();
      }
      
      return Promise.reject(code);
    });
  }
  
  public logout(): Promise<any> {
    return this.processLogout();
  }
  
  private async processLogout() {
    this.user = null;
    this.loggedIn = false;
    this.push.stop();
    await this.store.remove('user')
    this.userChanged.emit(null);
  }
  
  public async register(creds: RegisterCredentials): Promise<User> {
    const user = await this.api.post("register", creds);
    this.processUserResponse(user);
    return user;
  }
  
  public async login(creds: LoginCredentials): Promise<User> {
    const res = await this.api.post("login", creds);
    this.processUserResponse(res);
    return res.user;
  }

  public sendSupport(request: SupportRequest) {
    return this.api.post('support', request);
  }
  
  private processUserResponse(res) {
    this.user = res.user;
    this.loggedIn = true;
    this.api.setToken(this.user.session.token);
    this.push.start();
    
    this.saveUserToStorage(this.user);
    this.userChanged.emit(this.user);
  }

  public updateProfileImage(uri: string) {
    return this.api.postImage('u/profile-image', uri)
    .then((result) => {
      const imgBase = result.imgBase;
      this.user.imgBase = imgBase;
      return this.saveUserToStorage(this.user);
    })
    .then(() => this.userChanged.emit(this.user));
  }
  
}
