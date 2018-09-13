import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign, faQuestion, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBtc } from '@fortawesome/free-brands-svg-icons';

import { ModalsService } from '../modals/modals.service';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { Router } from '@angular/router';
import { IWalletInfo, WalletInfo, IBitcoinprice, bitcoinprice, INodeinfo, NodeInfo, IRecentTransactionInfo, RecentTransactionInfo } from '../business-model/entities';
import { WalletService } from '../wallet.service';
import { TransactionBuilder } from '../business-model/entities';
import { ApiEndpoints, categories, message } from '../business-model/enums';
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
  transactionColumns: string[] = ['date', 'category', 'status', 'amount'];
  private destroyed: boolean = false;
  walletInfo: IWalletInfo = new WalletInfo();
  trasactionInfo: RecentTransactionInfo = new IRecentTransactionInfo();
  private log: any = Log.create(`overview.component `);
  public status;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  getNodeInfo: INodeinfo = new NodeInfo();
  public ghostnodeArray = [] as Array<INodeinfo>
  public bitcoinprice;
  public monthEarn: number = 0;
  public node: number = 0;
  isActiveNodeCount = 0;

  // lineChart
  public lineChartData: Array<any> = [
    // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    // { data: [40, 19, 86, 27, 90], label: 'Series B' },
    { data: [2, 2.5, 4, 3.6, 5.5, 4.8, 7, 5], label: 'Bitcoin' }
  ];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';



  constructor(
    private modalsService: ModalsService, private router: Router,
    private walletServices: WalletService, private _rpcState: RpcStateService
  ) { }

  ngOnInit() {
    //call listtransaction using params 'account,count,from'
    this._rpcState.registerStateCall(ApiEndpoints.ListTransactions, 1000);
    //call torstatus using params 'null'
    this._rpcState.registerStateCall(ApiEndpoints.Torstatus, 1000, );
    //call ghost node list conf using params 'null'
    this._rpcState.registerStateCall(ApiEndpoints.GhostnodeListConf, 1000, );
    this._rpcState.registerStateCall(ApiEndpoints.GetWalletInfo, 1000);

    this.getwalletinformation();
    this.listTransaction();
    this.getBitcoinpriceinfo();
    this.getTorstatus();
    this.getnodestatus();
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
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
    this._rpcState.observe(ApiEndpoints.ListTransactions)
      .subscribe(RecentTransInfo => {
        this.trasactionInfo = new IRecentTransactionInfo(RecentTransInfo);
        console.log('trans', RecentTransInfo);
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
    debugger
    this._rpcState.observe(ApiEndpoints.GhostnodeListConf)
      .subscribe(NodeInformations => {
        debugger
        // this.getNodeInfo = new NodeInfo(NodeInformations);
        this.ghostnodeArray = NodeInformations;
        console.log(NodeInformations);
        
        for (var i = 0; i < this.ghostnodeArray.length; i++) {
          if (this.ghostnodeArray[i].status=="ACTIVE") {
            this.isActiveNodeCount += 1;
          }
        }
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
      balance: this.walletInfo.balance,
      amountInUSD: this.bitcoinprice.USD.price,
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

