import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign, faQuestion, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBtc } from '@fortawesome/free-brands-svg-icons';

import { ModalsService } from '../modals/modals.service';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { Router } from '@angular/router';
import { IWalletInfo, WalletInfo, IBitcoinprice, bitcoinprice, IrecentTransactionInfo, recentTransactionInfo } from '../business-model/entities';
import { WalletService } from '../wallet.service';
import { TransactionBuilder } from '../business-model/entities';
import {  ApiEndpoints, categories, message } from '../business-model/enums';
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
  trasactionInfo : recentTransactionInfo = new IrecentTransactionInfo();
  private _balance: Amount = new Amount(0);
  private log: any = Log.create(`balance.component `);
  
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  public bitcoinprice;
  get balance() {
    return this._balance;
  }
  constructor(
    private modalsService: ModalsService,
    private router: Router,
    private walletServices: WalletService,
    private _rpcState: RpcStateService
  ) {

  }

  ngOnInit() {
    //call listtransaction using params 'account,count,from'
    this._rpcState.registerStateCall(ApiEndpoints.ListTransaction, 1000, [this.trasactionInfo.account,this.trasactionInfo.count,this.trasactionInfo.from]);
    this._rpcState.registerStateCall(ApiEndpoints.ListTransaction, 1000, [this.listTransaction]);
    this.getwalletinformation();
    this.listTransaction();
    this.getBitcoinpriceinfo();
  }

   //get wallet informations
  private getwalletinformation() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
      },
        error => this.log.error(message.walletMessage, error));
  }

   // get recent transactions
   private listTransaction() {
    this._rpcState.observe(ApiEndpoints.ListTransaction)
      .subscribe(res => {
        console.log(res)
      },
        error => this.log.error(message.recentTransactionMessage, error));
  }

  // get bitcoin price
  private getBitcoinpriceinfo() {
    debugger
    this.walletServices.getBitcoin(this.bitcoinpriceInfo)
    .subscribe(bitcoinpriceInfos => {
      debugger
      this.bitcoinprice = bitcoinpriceInfos.data.quotes;
    },
        error => this.log.error(message.bitcoinpriceMessage, error));
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
    if (categories.Send) {
      return `Sent ${currency}`;
    } else if (categories.Receive) {
      return `Received ${currency}`;
    } else if (categories.Node) {
      return `Node Earnings`;
    }
    return '';
  }

  public getCategoryIconStyle(category: string): any {
    if (categories.Send) {
      return faArrowUp;
    } else if (categories.Receive) {
      return faArrowDown;
    } else if (categories.Node) {
      return faDollarSign;
    }
    return '';
  }

  
  ngOnDestroy() {
    this.destroyed = true;
  }
}

