import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule} from 'angular2-notifications';
import { NgModule } from '@angular/core';
import { Ng2CsvModule } from 'ng2csv';
import { NgxSpinnerModule } from 'ngx-spinner';

import { WalletModule } from './wallet/wallet.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http'; 
import { routing } from './app.routing';
import {HttpModule} from '@angular/http';
import { AppComponent } from './app.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    routing,
    WalletModule,
    HttpClientModule,
    HttpModule,
    ClipboardModule,
    Ng2CsvModule,
    NgxSpinnerModule,
    SimpleNotificationsModule.forRoot()
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor() {
  }
}
