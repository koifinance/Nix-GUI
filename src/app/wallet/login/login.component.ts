import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Log } from 'ng2-logger';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { RpcStateService } from '../../core/core.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  walletInitialized: boolean;
  walletPassword: string;
  showPassword: boolean = false;
  showSidebarError: boolean = false;
  private log: any = Log.create('welcome.component');
  private destroyed: boolean = false;

  constructor(
    private router: Router,
    private rpcState: RpcStateService
  ) {
  }

  ngOnInit() {
    this.rpcState.observe('ui:walletInitialized')
      .takeWhile(() => !this.destroyed)
      .subscribe(status => this.walletInitialized = status);
  }

  passwordValidation(): boolean {
    if (this.walletPassword === null || this.walletPassword === undefined) {
      this.showSidebarError = true;
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }


  goTo(route: string) {
    if (this.passwordValidation()) {
      this.router.navigate([`/${route}`]);
    }

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

}
