import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { RpcStateService, SnackbarService } from '../../../core/core.module';
import { ApiEndpoints, message } from '../../business-model/enums';
import { Log } from 'ng2-logger';
import { IPassword, encryptpassword, ISetAccount, SetAccount, IWalletSendToNix, WalletSendToNix } from '../../business-model/entities';
import { WalletService } from '../../wallet.service';
import { MatDialogRef } from '@angular/material';
import { ModalsService } from '../modals.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {
  @Input() dataTest: any;
  @Output() valueChange = new EventEmitter();

  private log: any = Log.create('success.component');
  private modalContainer: ViewContainerRef;
  private destroyed: boolean = false;

  counter = 0;
  sendToNix: IWalletSendToNix = new WalletSendToNix();
  newAddress: string;
  walletPass: IPassword = new encryptpassword();
  setAccount: ISetAccount = new SetAccount();
  modal: ComponentRef<Component>;
  data: any;
  showPass: boolean = false;
  public sendingAmount: number;
  public totalAmount: number;
  public fee: number;

  public txid = 'NXeztH1P1ZndvzJMgdw1uIDtc6p4uNXXkl-test';
  public txidVault = 'NXeztH1P1ZndvzJMgdw1uIDtc6p4uNXXkl-sample';

  constructor(
    private _rpcState: RpcStateService, private flashNotification: SnackbarService, private modalsService: ModalsService,
    private walletServices: WalletService, public _dialogRef: MatDialogRef<SuccessComponent>) {
  }

  ngOnInit() {
    this.getNewAddress();
  }

  setData(data: any) {
    this.data = data;
    this.sendingAmount = data.amount;
    this.fee = data.fee;
    this.totalAmount = data.total;
  }

  // Get new address for Receive NIX to Wallet
  private getNewAddress() {
    this.walletServices.getNewAddress().takeWhile(() => !this.destroyed)
      .subscribe(Newaddress => {
        this.showPass = false;
        this.setAccount.address = Newaddress;
        localStorage.setItem('getAddress', JSON.stringify(this.setAccount.address));
      },
      error => {
        this.showPass = true;
        this.flashNotification.open(message.GetNewAddress, 'err');
        this.log.er(message.GetNewAddress, error)
      });
  }
  
  // Receive NIX to Wallet
  receiveDone() {
    this.walletPass.stakeOnly = false;

    if (this.showPass) {
      this.walletServices.walletpassphrase(this.walletPass).subscribe(() => {
        
        this.getNewAddress();
        if (this.validateInput()) {
          var result = this.walletServices.receiveNIXToWallet(this.setAccount).subscribe(res => {
            this.data.parentRef.getReceivedNixToWallet(); // reload addresses in parent modal
            this.close();
          }, error => {
            this.flashNotification.open(message.ReceiveNIXtoWallet, 'err');
            this.log.er(message.ReceiveNIXtoWallet, error)
          });
        }
      }, error => {
        this.flashNotification.open(message.PassphraseNotMatch, 'err');
        this.log.er(message.PassphraseNotMatch, error)
      });
    } else {
      if (this.validateInput()) {
        var result = this.walletServices.receiveNIXToWallet(this.setAccount).subscribe(res => {
          this.data.parentRef.getReceivedNixToWallet(); // reload addresses in parent modal
          this.close();
        }, error => {
          this.flashNotification.open(message.ReceiveNIXtoWallet, 'err');
          this.log.er(message.ReceiveNIXtoWallet, error)
        });
      }
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
    this.modalsService.forceClose();
  }

  // done Deposit NIX to Ghost Vault
  depositDone() {
    this.close();
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
