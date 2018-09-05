import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { WalletService } from '../../wallet.service';
import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { WalletSendToNix, IWalletSendToNix } from '../../business-model/entities';
import { wallet } from '../../datamodel/model';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  // providers: [ModalsService]
})
export class SendComponent implements OnInit, OnDestroy {
  data: any;
  sendToNix: IWalletSendToNix = new WalletSendToNix();

  private log: any = Log.create(`send to nix `);
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  public fee = 0.001;
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
    if(this.validateInput()) {
      var result = this.walletServices.SendToNix(this.sendToNix).subscribe(res => {
        this.openSuccess('wallet');
      }, error => {
        this.flashNotification.open(message.SendAmount, 'err');
        this.log.er(message.SendAmount, error)
      });
    }

  }

  // Send from Ghost Vault
  sendGhostVaultData() {
    //validating the inputs
    if (this.validateInput()) {
      var result = this.walletServices.SendToNix(this.sendToNix).subscribe(res => {
        this.openSuccess('vault');
      },
        error => {
          this.flashNotification.open(message.SendAmountToVaultMessage, 'err');
          this.log.er(message.SendAmountToVaultMessage, error)
        });
    }

  }
// validating input
  validateInput(): boolean {
    if (this.sendToNix.amount === 0 || this.sendToNix.amount === undefined) {
      this.flashNotification.open(message.EnterData, 'err');
      this.log.er(message.EnterData, 'error')
      return false;
    }
    if (this.sendToNix.address === null || this.sendToNix.address === undefined) {
      this.flashNotification.open(message.EnterData, 'err');
      this.log.er(message.EnterData, 'error')
      return false;
    }
    return true;
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
