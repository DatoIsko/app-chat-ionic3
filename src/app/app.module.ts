import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { EmojiProvider } from '../providers/emoji';
import { ChatService } from '../providers/chat-service';
import { ChatComponent } from '../pages/chat/chat.component';
import { EmojiPickerComponent } from '../components/emoji-picker/emoji-picker';
import { RelativeTime } from '../pipes/relative-time';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ChatComponent,
    EmojiPickerComponent,
    RelativeTime
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages:true,
      tabsLayout:'icon-left',
      preloadModules: true
    }),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ChatComponent,
    EmojiPickerComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmojiProvider,
    ChatService
  ]
})
export class AppModule {}
