import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Platform } from 'ionic-angular';

import { DialogService } from './dialogs';
import { Observable } from 'rxjs/Rx';
import { SimpleCache } from '../model/SimpleCache';


@Injectable()
export class ApiProvider {
  private cache = new SimpleCache();
  private token: string;
  private headers: Headers;
  private errorMessages = {
    0: 'error.no-internet',
    500: 'error.server-error',
    timeout: 'error.timeout'
  };
  private timeout = 10000;
  private settings = ENV;
  
  constructor(
    private platform: Platform,
    private fileTransfer: FileTransfer,
    private dialogs: DialogService,
    private http: Http
  ) {
    
    
  }
  
  
  public setToken(token: string) {
    this.token = token;
    
    this.headers = new Headers();
    this.headers.append('X-Auth-Token', token);
  }
  
  public getToken() {
    return this.token;
  }
  
  public clearToken() {
    this.token = undefined;
  }
  
  public getSecuredImageUrl(filename: string, size: string) {
    return `${this.settings.api}u/image/${filename}?t=${this.token}&size=${size}`;
  }
  
  private checkCordova(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        resolve('ok');
      } else {
        reject('cordova_not_available');
      }
    })
  }
  
  public postImage(path: string, fileUri: string, data?: any): Promise<any> {
    
    let ft = this.fileTransfer.create();
    let options = {
      fileKey: 'image',
      fileName: 'image.jpg',
      headers: { 'X-Auth-Token': this.token },
      params: data
    }
    
    return this.checkCordova()
    .then(() => ft.upload(fileUri, this.settings.api + path, options))
    .then(res => JSON.parse(res.response));
  }
  
  public post(path: string, body: any): Promise<any> {
    
    return this.http.post(this.settings.api + path, body, { headers: this.headers })
    .map((res: Response) => { return res.json(); })
    .catch((err: Response, obs: Observable<any>) => {
      return this.handleError(err, obs);
    })
    .toPromise();
  }
  
  public put(path: string, body: any): Promise<any> {
    
    return this.http.put(this.settings.api + path, body, { headers: this.headers })
    .map((res: Response) => { return res.json(); })
    .catch((err, obs: Observable<any>) => {
      return this.handleError(err, obs);
    })
    .toPromise();
  }
  
  /**Cache requests and return those instead.
  * 
  * @param path url stub for the api
  */
  public cacheGet(path: string): Promise<any> {
    
    if (this.cache.has(path)) return this.cache.get(path);
    
    return this.cache.add(path, this.get(path))
    .catch((err) => {
      //I don't want to cache rejects. 
      this.cache.remove(path);
      console.info("Removing rejection from cache");
      
      Promise.reject(err);
    });
  }
  
  public get(path: string): Promise<any> {
    return this.http.get(this.settings.api + path, { headers: this.headers })
    .timeout(this.timeout)
    .map((res: Response) => { return res.json(); })
    .catch((err, obs: Observable<any>) => {
      return this.handleError(err, obs);
    })
    .toPromise();
  }
  
  public delete(path: string): Promise<any> {
    return this.http.delete(this.settings.api + path, { headers: this.headers })
    .timeout(this.timeout)
    .map((res: Response) => { return res.json(); })
    .catch((err, obs: Observable<any>) => {
      return this.handleError(err, obs);
    })
    .toPromise();
  }
  
  public getObservable(path: string): Observable<any> {
    return this.http.get(this.settings.api + path, { headers: this.headers })
    .timeout(this.timeout)
    .map((res: Response) => { return res.json(); })
    .catch((err, obs: Observable<any>) => {
      return this.handleError(err, obs);
    })
  }
  
  private handleError(err, obs: Observable<any>){
    
    console.log("error", err);
    
    //Show a message Toast if appropriate
    if (err.status !== undefined && this.errorMessages[err.status]) {
      this.dialogs.showToast(this.errorMessages[err.status]);
    } else if (err.name === 'TimeoutError') {
      this.dialogs.showToast(this.errorMessages.timeout);
    } else if (err.status === 401) {
      //Logout?
    }

    //how to detect if this has that function
    let body;
    if(typeof err.json === 'function') {
      body = err.json();
    } else {
      body = err;
    }
    
    if (typeof body === 'object' && !body.statusCode) body.statusCode = err.status;
    
    return Observable.throw(body);
  }
}
