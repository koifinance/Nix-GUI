import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ModalsComponent } from './modals.component';
import { ModalsService } from './modals.service';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { SuccessComponent } from './success/success.component';

@NgModule({
  declarations: [
    ModalsComponent,
    SendComponent,
    ReceiveComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule
  ],
  exports: [
    ModalsComponent
  ],
  providers: [
    ModalsService,
  ],
  entryComponents: [
    ModalsComponent,
    SendComponent,
    ReceiveComponent,
    SuccessComponent
  ]
})
export class ModalsModule {
}
