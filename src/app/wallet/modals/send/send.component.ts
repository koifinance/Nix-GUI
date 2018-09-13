import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { WalletService } from '../../wallet.service';
import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { WalletSendToNix, IWalletSendToNix } from '../../business-model/entities';
import { wallet } from '../../datamodel/model';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';
import { faBook, faAddressBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  // providers: [ModalsService]
})
export class SendComponent implements OnInit, OnDestroy {
  data: any;
  @Output() saveProduct = new EventEmitter();
  public amount : number = 0;
  public fees : number = 0;
  public total: number = 0;
  public nixamount : number = 10;
  sendToNix: IWalletSendToNix = new WalletSendToNix();
  private log: any = Log.create(`send to nix `);
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  public fee:number;
  faBook: any = faBook;
  faAddressBook: any = faAddressBook;
  balance: number;
  amountInUSD: number;
  USDamount:number=0;
  constructor(
    private walletServices: WalletService,
    private _rpcState: RpcStateService, private flashNotification: SnackbarService,
    public _dialogRef: MatDialogRef<SendComponent>) {

  }

  ngOnInit() {
    this.fee = 1;

  }

  setData(data: any) {
    this.data = data;
    this.balance = data.balance;
    this.amountInUSD = data.amountInUSD;
  }

  // send for wallet
  sendData() {
    debugger
    if(this.validateInput()) {
      var result = this.walletServices.SendToNix(this.sendToNix).subscribe(res => {
        this.openSuccess('wallet');
      }, error => {
        debugger
        console.log('send error', error)
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
        this.nixamount = this.sendToNix.amount;
      },
        error => {
          debugger
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
      amount: this.amount,
      fee: this.fees,
      total: this.total,
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

  public getAmount(event){
   this.amount = event;
   this.USDamount=this.amountInUSD*this.amount;
   this.getFee();
  }

  public getFee(){
    this.fees = (this.fee/100)* this.amount;
    this.getTotal();
  }

  public getTotal(){
   this.total = this.amount + this.fees;
  }
  ngOnDestroy() {
    this.destroyed = true;
  }


}
