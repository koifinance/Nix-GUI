import { Component, OnInit, OnDestroy, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { payType, ApiEndpoints, message } from '../../business-model/enums';
import { 
  IRecieveNixToWallet,
  RecieveNixToWallet,
  DepostAmount,
  IDepostAmount,
  IPassword,
  encryptpassword
} from '../../business-model/entities';
import { Log } from 'ng2-logger';
import { CalculationsService } from '../../calculations.service';
import { WalletService } from '../../wallet.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})

export class ReceiveComponent implements OnInit, OnDestroy {
  data: any;
  receivedNixInfo: Array<any> = [];
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
  convertEUR: number = 0;
  walletPassword: string;
  showPassword: boolean = false;
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;

  constructor(
    public _dialogRef: MatDialogRef<ReceiveComponent>,
    private calculationsService: CalculationsService,
    private _rpcState: RpcStateService,
    private flashNotification: SnackbarService,
    private walletServices: WalletService) {
  }

  ngOnInit() {
    // this.receivedNixInfo = new RecieveNixToWallet();
    // this.receivedNixInfo.account = 'jhon';
    // this.receivedNixInfo.addresses = [];
    // //for testing purpose
    // this.receivedNixInfo.addresses[0] = 'NW7N8YjBruoTzrLy1GVVvH2p4FnL46mhYZ-test';
    // this.receivedNixInfo.addresses[1] = 'NNqe34X87ckw6UNHrhRJdUakPYxRNZQSaw';
    // this.receivedNixInfo.addresses[2] = 'NdqXnS2TLHFLUA3LmQQmMqYQ2biA5jg71z';
    // //initiate the call
    // this._rpcState.registerStateCall(ApiEndpoints.ReceivedNix, 1000);
    // //receive the data
    this.getReceivedNixToWallet();
  }

  setData(data: any) {
    this.data = data;
    this.balance = data.balance;
  }

  copyToClipBoard(): void {
    this.flashNotification.open(message.CopiedAddress, 'info');
  }

  // receive nix to wallet
  private getReceivedNixToWallet() {
    this.walletServices.listAccounts().subscribe(receivedInfo => {
      this.receivedNixInfo.length = 0;
      for (let key in receivedInfo) {
        this.walletServices.getAddressesByAccount(key).subscribe(res => {
          this.receivedNixInfo.push({account: key, address: res[res.length - 1]});
        }, err => {
          this.flashNotification.open(message.ReceiveNIXtoWallet, 'err');
          this.log.er(message.ReceiveNIXtoWallet, err)
        })
      }
    }, error => {
      this.flashNotification.open(message.ReceiveNIXtoWallet, 'err');
      this.log.er(message.ReceiveNIXtoWallet, error)
    });
  }

  // Deposit NIX to Ghost Vault
  depositSuccess() {
    if (this.validateDepositeInput()) {
      let walletPasspharse: IPassword = new encryptpassword();
      walletPasspharse.password = this.walletPassword;
      walletPasspharse.stakeOnly = false;

      this.walletServices.walletpassphrase(walletPasspharse).subscribe(res => {
        this.walletServices.amountDeposit(this.depositToVault).subscribe(res => {
          this.openSuccess('vault');
        }, error => {
          this.flashNotification.open(message.DepositMessage, 'err');
          this.log.er(message.DepositMessage, error)
        });
      }, err => {
        this.flashNotification.open(message.PassphraseNotMatch, 'err');
        this.log.er(message.PassphraseNotMatch, err);
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
    let data = {};
    if (walletType == 'vault') {
      data = {
        forceOpen: true,
        walletType: walletType,
        amount: this.amount,
        fee: this.fees,
        total: this.total,
        actionType: 'receive',
      };
    } else {
      data = {
        forceOpen: true,
        walletType: walletType,
        amount: this.amount,
        fee: this.fees,
        total: this.total,
        actionType: 'receive',
        parentRef: this
      };
    }
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('success', data);
  }

  openShowQR(address) {
    const data: any = {
      forceOpen: true,
      walletType: 'wallet',
      address: address,
      actionType: 'show'
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
    this.amount = parseInt(event, 10);
    this.convertUSD = this.data.amountInUSD * this.amount;
    this.convertEUR = this.data.amountInEUR * this.amount;
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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
