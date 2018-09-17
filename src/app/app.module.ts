import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

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
    ClipboardModule
    
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor() {
  }
}
