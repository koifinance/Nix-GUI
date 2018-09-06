import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef, Input } from '@angular/core';
import { RpcStateService, SnackbarService } from '../../../core/core.module';
import { ApiEndpoints, message } from '../../business-model/enums';
import { Log } from 'ng2-logger';
import { GetNewAddress, IGetNewAddress, ISetAccount, SetAccount, IWalletSendToNix, WalletSendToNix } from '../../business-model/entities';
import { WalletService } from '../../wallet.service';
import { MatDialogRef } from '@angular/material';
import { ModalsService } from '../modals.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {
  @Input('sendAmount') amountno : number;
  sendToNix: IWalletSendToNix = new WalletSendToNix();
  getNewaddress: IGetNewAddress = new GetNewAddress();
  setAccount: ISetAccount = new SetAccount();
  private log: any = Log.create('success.component');
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  data: any;
  private destroyed: boolean = false;
  public txid = 'NXeztH1P1ZndvzJMgdw1uIDtc6p4uNXXkl-test';
  public txidVault = 'NXeztH1P1ZndvzJMgdw1uIDtc6p4uNXXkl-sample';

  constructor(
    private _rpcState: RpcStateService, private flashNotification: SnackbarService, private modalsService: ModalsService,
    private walletServices: WalletService, public _dialogRef: MatDialogRef<SuccessComponent>) {

  }

  ngOnInit() {
    debugger
    this.amountno;
    this._rpcState.registerStateCall(ApiEndpoints.Getnewaddress, 1000);
    this.getNewAddress();
  }
  openSuccess(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      actionType: 'send'
    };
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('success', data);
    this.sendGhostVaultData();
  }

    // Send from Ghost Vault
    sendGhostVaultData() {
      debugger
      //validating the inputs
      if (this.validateInput()) {
        var result = this.walletServices.SendToNix(this.sendToNix).subscribe(res => {
          debugger
          this.openSuccess('vault');
          this.sendToNix.amount
          console.log(this.sendToNix.amount)
        },
          error => {
            debugger
            this.flashNotification.open(message.SendAmountToVaultMessage, 'err');
            this.log.er(message.SendAmountToVaultMessage, error)
            this.openSuccess('vault');
            this.sendToNix.amount
            console.log(this.sendToNix.amount)
          });
      }
  
    }
  setData(data: any) {
    this.data = data;
  }
  // Get new address for Receive NIX to Wallet
  private getNewAddress() {
    this._rpcState.observe(ApiEndpoints.Getnewaddress)
      .takeWhile(() => !this.destroyed)
      .subscribe(Newaddress => {
        this.getNewaddress.address = Newaddress;
        this.getNewaddress.address = this.setAccount.address;
      },
        error => {
          this.flashNotification.open(message.GetNewAddress, 'err');
          this.log.er(message.GetNewAddress, error)
        });
  }

  // Receive NIX to Wallet
  receiveDone() {
    
    if(this.validateInput()) {
      var result = this.walletServices.receiveNIXToWallet(this.setAccount).subscribe(res => {
        this.close();
      }, error => {
        this.flashNotification.open(message.ReceiveNIXtoWallet, 'err');
        this.log.er(message.ReceiveNIXtoWallet, error)
      });
    }
  }

  validateInput(): boolean {
    if (this.setAccount.account === null || this.setAccount.account === undefined) {
      this.flashNotification.open(message.EnterData, 'err');
      this.log.er(message.EnterData, 'error')
      return false;
    }
    return true;
  }
  // done Send NIX from wallet
  sendDone() {
    this.close();
  }

  // back to address
  BackToAddress(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      modalsService: this.modalsService
    };
    this.modalsService.forceClose();
    this.modalsService.openSmall('receive', data);
  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }
  ngOnDestroy(): void {
    this.destroyed = true;
  }
}
