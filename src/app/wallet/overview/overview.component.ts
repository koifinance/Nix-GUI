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
  transactionColumns: string[] = ['date', 'category', 'confirmations', 'amount'];
  private destroyed: boolean = false;
  walletInfo: IWalletInfo = new WalletInfo();
  trasactionInfo : recentTransactionInfo = new IrecentTransactionInfo();
  private log: any = Log.create(`overview.component `);
  public status;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  public bitcoinprice;
  public monthEarn: number = 0;
  public node: number = 0;
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
    //call torstatus using params 'null'
    this._rpcState.registerStateCall(ApiEndpoints.Torstatus, 1000, );
     //call ghost node list conf using params 'null'
    this._rpcState.registerStateCall(ApiEndpoints.GhostnodeListConf, 1000, );
    this.getwalletinformation();
    this.listTransaction();
    this.getBitcoinpriceinfo();
    this.getTorstatus();
    this.getnodestatus();
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
    this.walletServices.getBitcoin(this.bitcoinpriceInfo)
    .subscribe(bitcoinpriceInfos => {
      this.bitcoinprice = bitcoinpriceInfos.data.quotes;
    },
        error => this.log.error(message.bitcoinpriceMessage, error));
  }
  
  // get tor status
  private getTorstatus() {
    this._rpcState.observe(ApiEndpoints.Torstatus)
      .subscribe(res => {
        this.status = res;
      },
        error => this.log.error(message.recentTransactionMessage, error));
  }

  // get node status
  private getnodestatus() {
    this._rpcState.observe(ApiEndpoints.GhostnodeListConf)
      .subscribe(res => {
        console.log(res);
      },
      error => this.log.error(message.recentTransactionMessage, error));
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
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('receive', data);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}

