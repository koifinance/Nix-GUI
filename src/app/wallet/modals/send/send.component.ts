import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { WalletService } from '../../wallet.service';
import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { WalletSendToNix, IWalletSendToNix } from '../../business-model/entities';
import { wallet } from '../../datamodel/model';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';
import { faBook, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { CalculationsService } from '../../calculations.service';

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
  public fee:number = 1;
  faBook: any = faBook;
  faAddressBook: any = faAddressBook;
  balance: number;
  amountInUSD: number;
  convertUSD:number=0;
  todaydate;
  constructor(
    private walletServices: WalletService,
    private calculationsService: CalculationsService,
    private _rpcState: RpcStateService,
    private flashNotification: SnackbarService,
    public _dialogRef: MatDialogRef<SendComponent>) {
  }

  ngOnInit() {

  }

  setData(data: any) {
    this.data = data;
    this.balance = data.balance;
    this.amountInUSD = data.amountInUSD;
  }

  // send for wallet
  sendData() {
    if(this.validateInput()) {
      this.walletServices.SendToNix(this.sendToNix).subscribe(res => {
        this.openSuccess('wallet');
      }, error => {
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
  // to get sending amount
  public getSendingAmount(event) {
    this.amount = event;
    this.convertUSD=this.amountInUSD*this.amount
      this.getFees();
      this.getTotalAmount();
  }
  
  //to get fee
  getFees() {
    this.fees = this.calculationsService.getFee(this.amount,this.fee);
  }

  //to get total amount
  getTotalAmount(){
    this.total = this.calculationsService.getTotal(this.amount,this.fees);
  }
  
  ngOnDestroy() {
    this.destroyed = true;
  }


}
