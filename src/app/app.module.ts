import { NgModule, ErrorHandler,LOCALE_ID  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {  HttpModule } from '@angular/http';
import { HttpClient } from './sdk/clienteHttp';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';

registerLocaleData(localePt, 'pt-BR');


//import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ConfiguracoesPage,
    TabsPage
  ],
  imports: [
    HttpModule,
    //HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name:'_dbLocal'
    })    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ConfiguracoesPage,
    TabsPage
  ],
  providers: [
    HttpClient,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: "pt" },
  ]
})
export class AppModule { }
