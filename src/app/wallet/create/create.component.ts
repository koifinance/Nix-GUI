import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ModalsService } from '../modals/modals.service';

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
  walletWizard: any = [
    {
      valid: (): boolean => true
    },
    {
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
    },
    // {
    //   valid: (): boolean => {
    //     if (this.walletNewPassword && this.walletRepeatPassword &&
    //       this.walletRepeatPassword === this.walletNewPassword) {
    //       return true;
    //     }
    //     this.showContentError = true;
    //     return false;
    //   }
    // },
    {
      valid: (): boolean => true
    }
  ];
  private log: any = Log.create('create.component');
  private destroyed: boolean = false;

  constructor(
    private router: Router, private modalsService: ModalsService
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
    if (!this.walletWizard[1].valid()) {
      return;
    }

    this.showContentError = false;
    this.showSidebarError = false;
  }

  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
