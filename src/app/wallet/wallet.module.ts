import { NgModule } from '@angular/core';

import { ModalsModule } from './modals/modals.module';
import { SharedModule } from './shared/shared.module';
import { routing } from './wallet.routing';

@NgModule({
  declarations: [
  ],
  imports: [
    ModalsModule,
    routing,
    SharedModule,
  ],
})

export class WalletModule {
}
