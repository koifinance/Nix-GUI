import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { WalletService } from '../../wallet.service';
import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { WalletSendToNix, IWalletSendToNix } from '../../business-model/entities';
import { wallet } from '../../datamodel/model';
import { Log } from 'ng2-logger';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  // providers: [ModalsService]
})
export class SendComponent implements OnInit, OnDestroy {
  data: any;
  sendToNix: IWalletSendToNix = new WalletSendToNix();
  sendToNixvault: IWalletSendToNix = new WalletSendToNix();

  private log: any = Log.create(`send to nix `);
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;

  constructor(
    private walletServices: WalletService,
    private _rpcState: RpcStateService, private flashNotification: SnackbarService,
    public _dialogRef: MatDialogRef<SendComponent>) {

    }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

 // send for wallet

  sendData() {
     var result = this.walletServices.SendToNix(this.sendToNix).subscribe(res => {  
      this.openSuccess('wallet');
    }, error => {
     this.flashNotification.open('Wallet Failed to get balance!', 'err');
     this.log.er('Failed to get balance', error)
   });
  }
  
  // Send from Ghost Vault

  sendGhostVaultData() {
    var result = this.walletServices.SendToNixVault(this.sendToNixvault).subscribe(res => {
     this.openSuccess('vault');
   }, 
   error => {
    this.flashNotification.open('Ghost vault Failed to get balance!', 'err');
    // this.log.er('Ghost vault Failed to get balance', error)
  });
 }

  openSuccess(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      actionType: 'send'
    };
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('success', data);
  }
  
  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
