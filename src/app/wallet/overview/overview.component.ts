import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign, faQuestion, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBtc } from '@fortawesome/free-brands-svg-icons';

import { ModalsService } from '../modals/modals.service';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { Router } from '@angular/router';
import { IWalletInfo, WalletInfo } from '../business-model/entities';
import { WalletService } from '../wallet.service';
import { TransactionBuilder } from '../business-model/entities';
import { payType, ApiEndpoints } from '../business-model/enums';
import { RpcStateService } from '../../core/core.module';
import { Amount } from '../shared/util/utils';
import { Log } from 'ng2-logger';
@Component({
  selector: 'wallet-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  faCircle: any = faCircle;
  faQuestion: any = faQuestion;
  faSync: any = faSync;
  faCircleSolid: any = faCircleSolid;
  faArrowUp: any = faArrowUp;
  faArrowDown: any = faArrowDown;
  faBtc: any = faBtc;
  faq: Array<FAQ> = faq;
  TransactionBuilder: TransactionBuilder;
  transactionColumns: string[] = ['date', 'category', 'confirmations', 'amount'];
  private destroyed: boolean = false;
  walletInfo: IWalletInfo = new WalletInfo();
  private _balance: Amount = new Amount(0);
  private log: any = Log.create(`balance.component `);
  get balance() {
    return this._balance;
  }
  constructor(
    private modalsService: ModalsService,
    private router: Router,
    private walletSerices: WalletService,
    private _rpcState: RpcStateService
  ) {

  }

  ngOnInit() {
    this.getwalletinformation();
  }

  private getwalletinformation() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        debugger;
        //this._balance = new Amount(balance)
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
      },
        error => this.log.error('Failed to get balance, ', error));
  }

  goToChart() {
    this.router.navigate(['./overview/nix-price-chart']);
  }

  openSyncingWallet() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('syncingWallet', data);
  }

  openSend(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('send', data);
  }

  openReceive(walletType: string) {
    // this.walletService.getTransactionFee()
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('receive', data);
  }

  public getConfirmationsStyle(confirmations: number): string {
    if (confirmations < 0) {
      return 'confirm-error';
    } else if (confirmations <= 1) {
      return 'confirm-none';
    } else {
      return 'confirm-ok';
    }
  }

  public getConfirmationsText(confirmations: number): string {
    if (confirmations < 0) {
      return 'Error';
    } else if (confirmations <= 1) {
      return 'Processing';
    } else {
      return 'Complete';
    }
  }

  public getCategoryText(category: string, currency: string): string {
    if (category === 'send') {
      return `Sent ${currency}`;
    } else if (category === 'receive') {
      return `Received ${currency}`;
    } else if (category === 'node') {
      return `Node Earnings`;
    }
    return '';
  }

  public getCategoryIconStyle(category: string): any {
    if (category === 'send') {
      return faArrowUp;
    } else if (category === 'receive') {
      return faArrowDown;
    } else if (category === 'node') {
      return faDollarSign;
    }
    return '';
  }

  private sendTransaction(): void {
    debugger
    if (payType.sendPayment) {
      // edit label of address
      this.walletSerices.sendTransaction(this.TransactionBuilder);
    } else {
      this.walletSerices.transferBalance(
        this.TransactionBuilder);
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}

