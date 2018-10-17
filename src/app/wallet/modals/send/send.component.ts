import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { WalletService } from '../../wallet.service';
import { RpcStateService, SnackbarService } from '../../../core/core.module';

import {
  WalletSendToNix,
  IWalletSendToNix,
  IPassword,
  encryptpassword,
  IUnGhostAmount,
  UnGhostAmount
} from '../../business-model/entities';
import { wallet } from '../../datamodel/model';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';
import { faBook, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  // providers: [ModalsService]
})
export class SendComponent implements OnInit, OnDestroy {
  data: any;
  @Output() saveProduct = new EventEmitter();

  private log: any = Log.create(`send to nix `);
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;

  public amount : number = 0;
  public fees : number = 0;
  public total: number = 0;
  sendToNix: IWalletSendToNix = new WalletSendToNix();
  modal: ComponentRef<Component>;
  public fee:number = 1;
  faBook: any = faBook;
  faAddressBook: any = faAddressBook;
  balance: number;
  amountInUSD: number;
  amountInEUR: number;
  convertUSD: number = 0;
  convertEUR: number = 0;
  todaydate;
  addressLabel: string;
  isAddressSelected: boolean = false;
  walletPassword: string;
  showPassword: boolean = false;
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  accountData: Array<any> = [];

  constructor(
    private walletServices: WalletService,
    private _rpcState: RpcStateService,
    private flashNotification: SnackbarService,
    public _dialogRef: MatDialogRef<SendComponent>) {
  }

  ngOnInit() {
    this.walletServices.getAllAddresses().subscribe(res => {
      for (let key in res.send) {
        this.accountData.push({address: key, name: res.send[key]});
      }
      this.accountData.length -= 1;
    }, error => {
      this.flashNotification.open(message.GetAllAddresses, 'err');
      this.log.err(message.GetAllAddresses, error);
    })
  }

  setData(data: any) {
    this.data = data;
    this.balance = data.balance;
    this.amountInUSD = data.amountInUSD;
    this.amountInEUR = data.amountInEUR;
  }

  // send for wallet
  sendData() {
    if(this.validateInput()) {
      let walletPasspharse: IPassword = new encryptpassword();
      walletPasspharse.password = this.walletPassword;
      walletPasspharse.stakeOnly = false;
      this.walletServices.walletpassphrase(walletPasspharse).subscribe(response => {
        this.walletServices.SendToNix(this.sendToNix).subscribe(res => {
          this.saveAddress();
          this.openSuccess('wallet');
        }, error => {
          console.log('send error', error)
          this.flashNotification.open(message.SendAmount, 'err');
          this.log.er(message.SendAmount, error)
        });
      }, err => {
        console.log('send error', err)
        this.flashNotification.open(message.PassphraseNotMatch, 'err');
        this.log.er(message.PassphraseNotMatch, err)
      });
    }
  }

  // Send from Ghost Vault
  sendGhostVaultData() {
    //validating the inputs
    if (this.validateInput()) {
      let walletPasspharse: IPassword = new encryptpassword();
      walletPasspharse.password = this.walletPassword;
      walletPasspharse.stakeOnly = false;
      this.walletServices.walletpassphrase(walletPasspharse).subscribe(response => {
        let unghostInfo: IUnGhostAmount = new UnGhostAmount();
        unghostInfo.address = this.sendToNix.address;
        unghostInfo.amount = this.sendToNix.amount || this.data.balances;
        if (this.data.walletType === 'withdraw') unghostInfo.address = null;

        this.walletServices.unghostAmount(unghostInfo).subscribe(res => {
          this.openSuccess('vault', 'send');
        },
          error => {
            this.flashNotification.open(message.SendAmountToVaultMessage, 'err');
            this.log.er(message.SendAmountToVaultMessage, error)
        });
      }, err => {
        this.flashNotification.open(message.PassphraseNotMatch, 'err');
        this.log.er(message.PassphraseNotMatch, err);
      });
    }
  }

  addressSelected() {
    this.isAddressSelected = true;
    this.addressLabel = '';
    this.getSendingAmount(null);
  }

  addressEdited() {
    this.isAddressSelected = false;
  }

  labelSelected(label) {
    this.addressLabel = label;
  }

  labelChanged() {
    if (this.addressLabel == '') {
      this.isAddressSelected = false;
      this.sendToNix.address = '';
    }
  }

// validating input
  validateInput(): boolean {
    if (this.data.walletType === 'vault' && this.walletPassword && this.sendToNix.address) {
      return true;
    }
    if (this.data.walletType === 'withdraw' && this.walletPassword) {
      return true;
    }
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
    if (this.walletPassword === undefined) {
      return false;
    }
    return true;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  saveAddress() {
    if (!this.isAddressSelected) {
      this.walletServices.manageAddressbook('add', this.sendToNix.address, this.addressLabel).subscribe(res => {
      }, error => {
        this.flashNotification.open(error.message, 'err')
        this.log.er(message.AddressAddedMessage, error)
      });
    } else if (this.isAddressSelected) {
      this.walletServices.manageAddressbook('edit', this.sendToNix.address, this.addressLabel).subscribe(res => {
      }, error => {
        this.flashNotification.open(error.message, 'err')
        this.log.er(message.AddressAddedMessage, error)
      });
    }
  }

  openSuccess(walletType: string, actionType = 'send') {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      amount: this.amount,
      fee: this.fees,
      total: this.total,
      actionType: actionType,
      address: this.sendToNix.address
    };

    // if (walletType == 'vault' && actionType == 'send') {
    //   data.amount = this.data.balance;
    //   data.total = this.data.balance;
    // }
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
    if (event)  this.amount = parseInt(event, 10);
    this.convertUSD = this.amountInUSD * this.amount;
    this.convertEUR = this.amountInEUR * this.amount;
    if (this.amount && this.sendToNix.address)  this.getFees();
    this.getTotalAmount();
  }
  
  //to get fee
  getFees() {
    this.walletServices.getFeeForAmout(this.amount, this.sendToNix.address).subscribe(res => {
      this.fees = parseInt(res, 10) * 0.00000001;
    }, err => {
      this.flashNotification.open(err.message, 'err');
      this.log.er(message.GetFeeForAmount, err)
    })
  }

  //to get total amount
  getTotalAmount(){
    if (this.sendToNix.subtractFeeFromAmount) {
      this.total = this.amount - this.fees;
    } else {
      this.total = this.amount + this.fees;
    }
  }
  
  ngOnDestroy() {
    this.destroyed = true;
  }

}
