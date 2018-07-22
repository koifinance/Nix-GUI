import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { WalletModule } from './wallet/wallet.module';
import { CoreModule } from './core/core.module';

import { routing } from './app.routing';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    routing,
    WalletModule
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor() {
  }
}
