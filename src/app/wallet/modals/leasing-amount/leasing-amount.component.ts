import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { WalletService } from '../../wallet.service';
import { ApiEndpoints, message } from '../../business-model/enums';
import { SnackbarService, RpcStateService } from '../../../core/core.module';
import { Log } from 'ng2-logger';
import { ISetAccount, SetAccount, IPassword, encryptpassword } from '../../business-model/entities';

@Component({
  selector: 'app-leasing-amount',
  templateUrl: './leasing-amount.component.html',
  styleUrls: ['./leasing-amount.component.scss']
})
export class LeasingAmountComponent implements OnInit {
  addAddress: ISetAccount = new SetAccount();
  walletPass: IPassword = new encryptpassword();
  editMode: boolean;
  leaseContract: any;
  walletInfo: any;
  passphrase: string;
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  showPassword: boolean = false;
  private destroyed = false;
  private log: any = Log.create('leasing-amount.component');
  

  constructor(private walletServices: WalletService,
    private flashNotification: SnackbarService, 
    private dialogRef: MatDialogRef<LeasingAmountComponent>, 
    private _rpcState: RpcStateService,
    @Inject(MAT_DIALOG_DATA) private data) {
      this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.walletInfo = walletInfo;
      });
  }
 
  ngOnInit() {
    this.destroyed = false;
    const modalData = this.data;
    this.log.d(this.data);
    this.leaseContract = {
      leaseAddress: modalData.leaseAddress,
      amount: 0,
      label: modalData.label,
      feePercent: modalData.feePercent,
      rewardAddress: modalData.rewardAddress
    }
  }

  createContract() {
    if (this.validatePassword()) {
      let walletPasspharse: IPassword = new encryptpassword();
      walletPasspharse.password = this.passphrase;
      walletPasspharse.stakeOnly = false;
      this.walletServices.walletpassphrase(walletPasspharse).subscribe(response => {
        this.walletServices.leaseStaking(
          this.leaseContract.leaseAddress,
          this.leaseContract.amount,
          this.leaseContract.label,
          this.leaseContract.feePercent,
          this.leaseContract.rewardAddress
        ).subscribe(res => {
          this.dialogRef.close();
          }, error => {
            this.flashNotification.open(error.message, 'err')
            this.log.er(message.LeaseContract, error)
        });
      }, err => {
        this.flashNotification.open(err.message, 'err')
        this.log.er(message.PassphraseNotMatch, err)
      });
    }
  }

  cancel() {
    this.destroyed = true;
    this.dialogRef.close();
  }

  validatePassword(): boolean {
    if (this.passphrase === null || this.passphrase === undefined) {
      this.flashNotification.open(message.EnterData, 'err')
      return false;
    }
    return true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }
}
