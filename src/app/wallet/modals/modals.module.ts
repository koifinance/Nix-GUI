import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';
import { ModalsComponent } from './modals.component';
import { ModalsService } from './modals.service';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { SuccessComponent } from './success/success.component';
import { TransactionComponent } from './transaction/transaction.component';
import { EditNodeComponent } from './edit-node/edit-node.component';
import { GhostNode1Component } from './ghost-node1/ghost-node1.component';
import { CancelNodeComponent } from './cancel-node/cancel-node.component';
import { WithdrawRewardsComponent } from './withdraw-rewards/withdraw-rewards.component';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { AddaddressComponent } from './addaddress/addaddress.component';
import { SyncingWalletComponent } from './syncing-wallet/syncing-wallet.component';
import { RestoreWalletComponent } from './restore-wallet/restore-wallet.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';

@NgModule({
  declarations: [
    ModalsComponent,
    SendComponent,
    ReceiveComponent,
    SuccessComponent,
	  TransactionComponent,
    GhostNode1Component,
    EditNodeComponent,
    CancelNodeComponent,
    TransactionComponent,
    WithdrawRewardsComponent,
    PasswordchangeComponent,
    RecoveryComponent,
    AddaddressComponent,
    SyncingWalletComponent,
    RestoreWalletComponent,
    CreateWalletComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    ClipboardModule
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
    SuccessComponent,
    GhostNode1Component,
    EditNodeComponent,
    CancelNodeComponent,
    TransactionComponent,
    WithdrawRewardsComponent,
    SyncingWalletComponent,
    RestoreWalletComponent,
    CreateWalletComponent
  ]
})
export class ModalsModule {
}
