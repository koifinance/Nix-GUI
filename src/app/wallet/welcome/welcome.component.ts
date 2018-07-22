import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Log } from 'ng2-logger';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { RpcStateService } from '../../core/core.module';

@Component({
  selector: 'wallet-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }
}
