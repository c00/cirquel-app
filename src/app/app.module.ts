import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { Deeplinks } from '@ionic-native/deeplinks';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { VideoEditor } from '@ionic-native/video-editor';
import { FCM } from '@ionic-native/fcm';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { InlineSVGModule } from 'ng-inline-svg';

import { AgreementModalComponent } from '../components/agreement-modal/agreement-modal';
import { AnnouncementModalComponent } from '../components/announcement-modal/announcement-modal';
import { AvatarComponent } from '../components/avatar/avatar';
import { ContextMenuComponent } from '../components/context-menu/context-menu';
import { EmptyPlaceholderComponent } from '../components/empty-placeholder/empty-placeholder';
import { EndOfStreamComponent } from '../components/end-of-stream/end-of-stream';
import { FollowButtonComponent } from '../components/follow-button/follow-button';
import { ForgotPasswordModalComponent } from '../components/forgot-password-modal/forgot-password-modal';
import { GrowChildComponent } from '../components/grow-child/grow-child';
import { GrowerComponent } from '../components/grower/grower';
import { ItemListComponent } from '../components/item-list/item-list';
import { ItemComponent } from '../components/item/item';
import { LoaderComponent } from '../components/loader/loader';
import { LoginModalComponent } from '../components/login-modal/login-modal';
import { LoginComponent } from '../components/login/login';
import { NameVoteComponent } from '../components/name-vote/name-vote';
import { OtherNameModalComponent } from '../components/other-name-modal/other-name-modal';
import { SearchSummaryComponent } from '../components/search-summary/search-summary';
import { SearchValueComponent } from '../components/search-value/search-value';
import { SelectCategoryModalComponent } from '../components/select-category-modal/select-category-modal';
import { SignupComponent } from '../components/signup/signup';
import { SubsBannerComponent } from '../components/subs-banner/subs-banner';
import { SupportModalComponent } from '../components/support-modal/support-modal';
import { UploadProgressComponent } from '../components/upload-progress/upload-progress';
import { UserCardComponent } from '../components/user-card/user-card';
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
import { SubsPage } from '../pages/subs/subs';
import { UserItemsPage } from '../pages/user-items/user-items';
import { ImagePipe } from '../pipes/image/image';
import { TimePipe } from '../pipes/time/time';
import { AnnouncementService } from '../providers/announcement-service';
import { ApiProvider } from '../providers/api';
import { Cache } from '../providers/cache';
import { DialogService } from '../providers/dialogs';
import { ItemService } from '../providers/item-service';
import { NativeImageProvider } from '../providers/native-image';
import { PushService } from '../providers/push-service';
import { ResourceService } from '../providers/resource-service';
import { SocialService } from '../providers/social-service';
import { Store } from '../providers/store';
import { UploadProvider } from '../providers/upload';
import { UserService } from '../providers/user-service';
import { UserSettingsProvider } from '../providers/user-settings';
import { VideoService } from '../providers/video-service';
import { MyApp } from './app.component';
import { LocalImagePipe } from '../pipes/image/localImage';
import { CommentComponent } from '../components/comment/comment';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const PAGES_AND_MODALS = [
  HomePage,
  ListPage,
  ProfilePage,
  SearchPage,
  SubsPage,
  AddItemPage,
  DictionaryPage,
  FavoritesPage,
  ItemDetailPage,
  UserItemsPage,
  LoginModalComponent,
  SelectCategoryModalComponent,
  SupportModalComponent,
  AgreementModalComponent,
  ForgotPasswordModalComponent,
  OtherNameModalComponent,
  VoteModalComponent,
  AnnouncementModalComponent,
];

@NgModule({
  declarations: [
    MyApp,
    ItemComponent,
    ItemListComponent,
    SearchSummaryComponent,
    GrowChildComponent,
    UserCardComponent,
    ImagePipe,
    TimePipe,
    LocalImagePipe,
    ContextMenuComponent,
    EmptyPlaceholderComponent,
    CommentComponent,
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
    SearchValueComponent,
    SubsBannerComponent,
    AvatarComponent,
    FollowButtonComponent,
    ...PAGES_AND_MODALS
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
    SearchValueComponent,
    ContextMenuComponent,
    ...PAGES_AND_MODALS,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
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
    AnnouncementService,
    File,
    Network,
    Deeplinks,
    SocialSharing,
    FCM,
    PushService,
    SocialService,
    Cache,
    AppVersion,
  ]
})
export class AppModule { }
