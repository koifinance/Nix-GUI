import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ApiEndpoints } from '../business-model/enums';
import { NgxSpinnerService } from 'ngx-spinner';

import { RpcStateService } from '../../core/core.module';
import { RpcService } from '../../core/core.module';
import { SnackbarService } from '../../core/core.module';
import { ModalsService } from '../modals/modals.service';
import { message } from '../business-model/enums';

@Component({
  selector: 'wallet-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  walletNewPassword: string;
  walletRepeatPassword: string;
  showPassword: boolean = false;
  termsChecked: boolean = false;
  showSidebarError: boolean = false;
  showContentError: boolean = false;
  showSpinner: boolean = false;
  walletWizard: any = [
    {
      valid: (): boolean => true
    }, {
      valid: (): boolean => {
        if (!this.termsChecked) {
          this.showSidebarError = true;
          return false;
        }
        if (this.walletNewPassword === null || this.walletNewPassword === undefined
          || this.walletRepeatPassword === null || this.walletRepeatPassword === undefined) {
          this.showContentError = true;
          return false;
        }
        if (this.walletRepeatPassword !== this.walletNewPassword) {
          this.showContentError = true;
          return false;
        }
        this.showContentError = false;
        return true;
      }
    }, {
      valid: (): boolean => true
    }
  ];
  private log: any = Log.create('create.component');
  private destroyed: boolean = false;

  constructor(
    private router: Router,
    private _rpc: RpcService,
    private _rpcState: RpcStateService,
    private spinner: NgxSpinnerService,
    private modalsService: ModalsService,
    private flashNotification: SnackbarService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

  encryptWallet() {
    if (this.walletWizard[1].valid()) {
      this.flashNotification.open(message.WalletEncrypted, 'info');
      setTimeout(() => {
        this._rpc.call(ApiEndpoints.Encryptwallet, [this.walletNewPassword])
          .subscribe(res => {
            this.spinner.show()
            this._rpc.call('restart-daemon').subscribe(() => {
              this.goTo('main');
            });
          })
      }, 3000);      
    }

    this.showContentError = false;
    this.showSidebarError = false;
  }

  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
