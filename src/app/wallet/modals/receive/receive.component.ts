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
import { ClipboardService } from '../../../../../node_modules/ngx-clipboard';

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
  ghostKey: string;
  showPassword: boolean = false;
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;

  constructor(
    public _dialogRef: MatDialogRef<ReceiveComponent>,
    private calculationsService: CalculationsService,
    private _rpcState: RpcStateService,
    private _clipboardService: ClipboardService,
    private flashNotification: SnackbarService,
    private walletServices: WalletService) {
  }

  ngOnInit() {
    this.getReceivedNixToWallet();
    this.generateGhostKey();
  }

  setData(data: any) {
    this.data = data;
    this.balance = data.balance;
  }

  copyToClipBoard(ghostkey = null): void {
    if (ghostkey) {
      this.flashNotification.open(ghostkey + ' has been copied to clipboard.', 'info');
    } else {
      this.flashNotification.open(message.CopiedAddress, 'info');
    }
  }

  // receive nix to wallet
  private getReceivedNixToWallet() {
    this.walletServices.getAllAddresses().subscribe(receivedInfo => {
      this.receivedNixInfo.length = 0;
      this.log.d(receivedInfo.recieve);
      for (let key in receivedInfo.receive) {
        this.receivedNixInfo.push({account: receivedInfo.receive[key], address: key});
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

  onShareGhostKey() {

  }

  generateGhostKey() {
    let walletPasspharse: IPassword = new encryptpassword();
    walletPasspharse.password = this.walletPassword;
    walletPasspharse.stakeOnly = false;
    this.walletServices.getPubCoinPack().subscribe(res => {
      this.ghostKey = res[0];
    }, err => {
      this.log.er(message.ReceiveNIXtoWallet, err);
      this.flashNotification.open(err, 'err');
    });
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
