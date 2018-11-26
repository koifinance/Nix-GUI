import { Component, OnInit, ViewContainerRef, ComponentRef } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SnackbarService } from '../../../core/core.module';
import { WalletService } from '../../wallet.service';
import { IChangePassword, ChangePassword } from '../../business-model/entities';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-passwordchange',
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.scss']
})
export class PasswordchangeComponent implements OnInit {
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  showPassword: boolean = false;
  changePassword: IChangePassword = new ChangePassword();
  reEntryPassword: string;
  private log: any = Log.create('passwordchange.component');
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  
  constructor(
    private walletServices: WalletService,
    private flashNotification: SnackbarService,
    public _dialogRef: MatDialogRef<PasswordchangeComponent>) { }

  ngOnInit() {
  }

  validatePassword(): boolean {
    if (this.changePassword.newpassphrase === null || this.changePassword.newpassphrase === undefined) {
      this.flashNotification.open(message.EnterData, 'err')
      return false;
    }
    if (this.reEntryPassword === null || this.reEntryPassword === undefined) {
      this.flashNotification.open(message.EnterData, 'err')
      return false;
    }
    if (this.changePassword.oldpassphrase === null || this.changePassword.oldpassphrase === undefined) {
      this.flashNotification.open(message.EnterData, 'err')
      return false;
    }
    if (this.changePassword.newpassphrase !== this.reEntryPassword) {
      this.flashNotification.open(message.PasswordValidationMessage, 'err')
      return false;
    }

    return true;
  }

  save() {
    this.log.d(this.changePassword, this.reEntryPassword, this.validatePassword());
    if (this.validatePassword()) {
      var result = this.walletServices.changepassword(this.changePassword).subscribe(res => {
        this.flashNotification.open(message.PassphraseChanged, 'info');
        this.close();
        setTimeout(() => {
          this.walletServices.stop();
        }, 3000);
      }, error => {
        this.flashNotification.open(message.ChangePasswordMessage, 'err');
        this.log.er(message.ChangePasswordMessage, error)
      });
    }
  }

  close(): void {
    this._dialogRef.close();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

}
