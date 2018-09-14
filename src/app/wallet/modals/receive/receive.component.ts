import { Component, OnInit, OnDestroy, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { payType, ApiEndpoints, message } from '../../business-model/enums';
import { IRecieveNixToWallet, RecieveNixToWallet, DepostAmount, IDepostAmount } from '../../business-model/entities';
import { Log } from 'ng2-logger';
import { CalculationsService } from '../../calculations.service';
import { WalletService } from '../../wallet.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})

export class ReceiveComponent implements OnInit, OnDestroy {
  data: any;
  receivedNixInfo: IRecieveNixToWallet = new RecieveNixToWallet();
  depositToVault: IDepostAmount = new DepostAmount();

  public amount: number = 0;
  public fees: number = 0;;
  public fee: number = 1;
  public total: number = 0;
  private log: any = Log.create(`receive to nix `);
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  balance: number = 0;
  convertUSD: number = 0;
  constructor(public _dialogRef: MatDialogRef<ReceiveComponent>, private calculationsService: CalculationsService,
    private _rpcState: RpcStateService, private flashNotification: SnackbarService, private walletServices: WalletService) {

  }

  ngOnInit() {
    this.receivedNixInfo = new RecieveNixToWallet();
    this.receivedNixInfo.account = 'jhon';
    this.receivedNixInfo.addresses = [];
    //for testing purpose
    this.receivedNixInfo.addresses[0] = 'NW7N8YjBruoTzrLy1GVVvH2p4FnL46mhYZ-test';
    this.receivedNixInfo.addresses[1] = 'NNqe34X87ckw6UNHrhRJdUakPYxRNZQSaw';
    this.receivedNixInfo.addresses[2] = 'NdqXnS2TLHFLUA3LmQQmMqYQ2biA5jg71z';
    //initiate the call
    this._rpcState.registerStateCall(ApiEndpoints.ReceivedNix, 1000, [this.receivedNixInfo.account]);
    //receive the data
    this.getReceivedNixToWallet();

  }

  setData(data: any) {
    debugger
    this.data = data;
    this.balance = data.balance;
    this.convertUSD = data.amountInUSD;
  }

  copyToClipBoard(): void {
    this.flashNotification.open(message.CopiedAddress);
  }
  // receive nix to wallet
  private getReceivedNixToWallet() {
    this._rpcState.observe(ApiEndpoints.ReceivedNix)
      .takeWhile(() => !this.destroyed)
      .subscribe(receivedInfo => {
        this.receivedNixInfo.addresses = receivedInfo;
      }, error => {
        this.flashNotification.open(message.SendAmount, 'err');
        this.log.er(message.SendAmount, error)
      });
  }
  // Deposit NIX to Ghost Vault
  depositSuccess() {
    if (this.validateDepositeInput()) {
      var result = this.walletServices.amountDeposit(this.depositToVault).subscribe(res => {
        this.openSuccess('vault');
      }, error => {
        this.flashNotification.open(message.DepositMessage, 'err');
        this.log.er(message.DepositMessage, error)
      });
    }
  }
  
  // validating input for deposit amount
  validateDepositeInput(): boolean {
    if (this.depositToVault.amount === 0 || this.depositToVault.amount === undefined) {
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
      actionType: 'receive'
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
    debugger
    this.amount = event;
    this.convertUSD = this.convertUSD * this.amount
    this.getFees();
    this.getTotalAmount();
  }

  //to get fee
  getFees() {
    this.fees = this.calculationsService.getFee(this.amount, this.fee);
  }

  //to get total amount
  getTotalAmount() {
    this.total = this.calculationsService.getTotal(this.amount, this.fees);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
