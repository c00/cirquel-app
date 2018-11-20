import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { VideoEditor } from '@ionic-native/video-editor';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { InlineSVGModule } from 'ng-inline-svg';

import { AgreementModalComponent } from '../components/agreement-modal/agreement-modal';
import { ContextMenuComponent } from '../components/context-menu/context-menu';
import { EmptyPlaceholderComponent } from '../components/empty-placeholder/empty-placeholder';
import { EndOfStreamComponent } from '../components/end-of-stream/end-of-stream';
import { ItemComponent } from '../components/item/item';
import { LoaderComponent } from '../components/loader/loader';
import { LoginModalComponent } from '../components/login-modal/login-modal';
import { LoginComponent } from '../components/login/login';
import { NameVoteComponent } from '../components/name-vote/name-vote';
import { OtherNameModalComponent } from '../components/other-name-modal/other-name-modal';
import { SearchValueComponent } from '../components/search-value/search-value';
import { SelectCategoryModalComponent } from '../components/select-category-modal/select-category-modal';
import { SignupComponent } from '../components/signup/signup';
import { SupportModalComponent } from '../components/support-modal/support-modal';
import { UploadProgressComponent } from '../components/upload-progress/upload-progress';
import { VideoPlayerComponent } from '../components/video-player/video-player';
import { VoteModalComponent } from '../components/vote-modal/vote-modal';
import { VoteComponent } from '../components/vote/vote';
import { TouchingDirective } from '../directives/touching';
import { AddItemPage } from '../pages/add-item/add-item';
import { DictionaryPage } from '../pages/dictionary/dictionary';
import { FavoritesPage } from '../pages/favorites/favorites';
import { HomePage } from '../pages/home/home';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { UserItemsPage } from '../pages/user-items/user-items';
import { ImagePipe } from '../pipes/image/image';
import { TimePipe } from '../pipes/time/time';
import { ApiProvider } from '../providers/api';
import { DialogService } from '../providers/dialogs';
import { ItemService } from '../providers/item-service';
import { NativeImageProvider } from '../providers/native-image';
import { ResourceService } from '../providers/resource-service';
import { Store } from '../providers/store';
import { UploadProvider } from '../providers/upload';
import { UserService } from '../providers/user-service';
import { UserSettingsProvider } from '../providers/user-settings';
import { VideoService } from '../providers/video-service';
import { MyApp } from './app.component';
import { ItemListComponent } from '../components/item-list/item-list';
import { UserCardComponent } from '../components/user-card/user-card';
import { GrowerComponent } from '../components/grower/grower';
import { GrowChildComponent } from '../components/grow-child/grow-child';
import { SearchSummaryComponent } from '../components/search-summary/search-summary';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SocialSharing } from '@ionic-native/social-sharing';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProfilePage,
    SearchPage,
    AddItemPage,
    DictionaryPage,
    FavoritesPage,
    ItemDetailPage,
    UserItemsPage,
    ItemComponent,
    ItemListComponent,
    SearchSummaryComponent,
    GrowChildComponent,
    UserCardComponent,
    ImagePipe,
    TimePipe,
    ContextMenuComponent,
    EmptyPlaceholderComponent,
    EndOfStreamComponent,
    VoteComponent,
    LoaderComponent,
    NameVoteComponent,
    TouchingDirective,
    VideoPlayerComponent,
    GrowerComponent,
    UploadProgressComponent,
    LoginComponent,
    SignupComponent,
    LoginModalComponent,
    SelectCategoryModalComponent,
    SupportModalComponent,
    AgreementModalComponent,
    OtherNameModalComponent,
    SearchValueComponent,
    VoteModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      scrollAssist: false,
      autoFocusAssist: false,
    }),
    InlineSVGModule.forRoot({ baseUrl: 'assets/svg/' }),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule, 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ProfilePage,
    SearchPage,
    AddItemPage,
    DictionaryPage,
    FavoritesPage,
    ItemDetailPage,
    UserItemsPage,
    LoginModalComponent,
    SelectCategoryModalComponent,
    SupportModalComponent,
    AgreementModalComponent,
    OtherNameModalComponent,
    SearchValueComponent,
    VoteModalComponent,
    ContextMenuComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    DialogService,
    FileTransfer,
    UserService,
    UserSettingsProvider,
    ResourceService,
    Store,
    ItemService,
    Camera,
    UploadProvider,
    NativeImageProvider,
    VideoEditor,
    VideoService,
    File,
    Network,
    Deeplinks,
    SocialSharing,
  ]
})
export class AppModule {}
