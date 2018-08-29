import { Component, OnInit } from '@angular/core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign, faQuestion, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBtc } from '@fortawesome/free-brands-svg-icons';

import { ModalsService } from '../modals/modals.service';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { Router } from '@angular/router';
import { IWalletInfo, WalletInfo } from '../business-model/entities';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'wallet-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  faCircle: any = faCircle;
  faQuestion: any = faQuestion;
  faSync: any = faSync;
  faCircleSolid: any = faCircleSolid;
  faArrowUp: any = faArrowUp;
  faArrowDown: any = faArrowDown;
  faBtc: any = faBtc;
  faq: Array<FAQ> = faq;
  transactionColumns: string[] = ['date', 'category', 'confirmations', 'amount'];

  private _walletInfo: IWalletInfo = new WalletInfo();

  constructor(
    private modalsService: ModalsService,
    private router: Router ,
    ) {

  }
  ngOnInit() {
    // this._walletInfo.walletBalance=0;
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
}

