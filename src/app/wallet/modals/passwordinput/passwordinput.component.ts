import { Component, OnInit, ViewContainerRef, ComponentRef } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SnackbarService } from '../../../core/core.module';
import { WalletService } from '../../wallet.service';
import { IChangePassword, ChangePassword } from '../../business-model/entities';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';
import { MatDialogRef } from '@angular/material';
import {
  IPassword,
  encryptpassword
} from '../../business-model/entities';

@Component({
  selector: 'app-passwordinput',
  templateUrl: './passwordinput.component.html',
  styleUrls: ['./passwordinput.component.scss']
})
export class PasswordInputComponent implements OnInit {
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  showPassword: boolean = false;
  changePassword: IChangePassword = new ChangePassword();
  reEntryPassword: string;
  private log: any = Log.create('passwordchange.component');
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  passphrase:string;
  data: any;

  constructor(private walletServices: WalletService,
    private flashNotification: SnackbarService,public _dialogRef: MatDialogRef<PasswordInputComponent>) { }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

  validatePassword(): boolean {
    if (this.passphrase === null || this.passphrase === undefined) {
      this.flashNotification.open(message.EnterData, 'err')
      return false;
    }
    return true;
  }

  save() {
    if (this.validatePassword()) {
      let walletPasspharse: IPassword = new encryptpassword();
      walletPasspharse.password = this.passphrase;
      walletPasspharse.stakeOnly = true;
      this.walletServices.enableStaking(walletPasspharse).subscribe(res => {
        this.data.parentRef.stakingEnabled();
        this.close();
      }, error => {
        this.flashNotification.open(error.message, 'err')
        this.log.er(message.ChangePasswordMessage, error)
      });
    }
  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

}
