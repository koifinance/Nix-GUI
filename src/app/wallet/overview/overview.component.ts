import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign, faQuestion, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBtc } from '@fortawesome/free-brands-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';

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
import { CalculationsService } from '../calculations.service';
import { SnackbarService } from '../../core/core.module';

@Component({
  selector: 'wallet-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  USDvaultbalance: number;
  EURvaultbalance: number;
  BTCvaultbalance: number;
  USDwalletbalance: number;
  BTCwalletbalance: number;
  EURwalletbalance: number;
  NIXpercentage: any;
  balanceInUSD: any;
  balanceInBTC: any;
  balanceInEUR: any;
  
  faCircle: any = faCircle;
  faQuestion: any = faQuestion;
  faSync: any = faSync;
  faCircleSolid: any = faCircleSolid;
  faArrowUp: any = faArrowUp;
  faArrowDown: any = faArrowDown;
  faBtc: any = faBtc;
  faq: Array<FAQ> = faq;
  transactionColumns: string[] = ['date', 'type', 'status', 'amount'];
  private destroyed: boolean = false;
  walletInfo: IWalletInfo = new WalletInfo();
  private log: any = Log.create(`overview.component `);
  public status;
  public currentBlock: number;
  public torStatus: string;
  public currentCurrency: string;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  getNodeInfo: INodeinfo = new NodeInfo();
  public ghostNodes = {}
  public bitcoinprice;
  public monthEarn: number = 0;
  public node: number = 0;
  isActiveNodeCount = 0;
  enabledNodeCount = 0;

  // lineChart
  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'NIX' }
  ];
  public lineChartLabels: Array<any> = ['Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct'];
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
    private modalsService: ModalsService,
    private router: Router,
    private calculationsService: CalculationsService,
    private walletServices: WalletService,
    private flashNotification: SnackbarService,
    private spinner: NgxSpinnerService,
    private _rpcState: RpcStateService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.currentCurrency = this.walletServices.getCurrency();
    this._rpcState.registerStateCall(ApiEndpoints.Torstatus, 1000, );
    this._rpcState.registerStateCall(ApiEndpoints.GetWalletInfo, 1000);
    this._rpcState.registerStateCall(ApiEndpoints.Ghostnode, 1000, ['count']);

    this.init();
    this.getNIXChartData();
    this.getnodestatus();
  }

  ngAfterViewInit() {
    this.getBlockchainInfo();
    this.getTorstatus();
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  // get chart history of nix
  public getNIXChartData() {
    this.walletServices.getHistoricalData('vs_currency=usd&days=365').subscribe(res => {
      let label = ['Jul'];
      let price = [0];
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct', 'Nov', 'Dec'];
      res = JSON.parse(res.text());
      res.prices.map(t => {
        let date = new Date(t[0]);
        if (date.getDate() == 1) {
          label.push(monthName[date.getMonth()]);
          price.push(t[1]);
        }
      });
      this.lineChartData[0].data = price;
      this.log.d('====', this.lineChartData);
      this.lineChartLabels.length = 0;
      this.lineChartLabels = label;
    })
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  //refresh the overview screen(price)
  public refresh() {
    this.init();
  }

  //get wallet informations
  private init() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.spinner.hide();
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
        this.walletServices.getBitcoin(this.bitcoinpriceInfo)
          .subscribe(bitcoinpriceInfos => {
            this.bitcoinprice = bitcoinpriceInfos.data.quotes;
            this.balanceInBTC = this.bitcoinprice.BTC.price;
            this.balanceInUSD = this.bitcoinprice.USD.price;
            this.NIXpercentage = this.bitcoinprice.USD.percent_change_24h
          
            this.getBTCBalance();
            this.getUSDBalance();
            this.getBTCVaultBalance();
            this.getUSDVaultBalance();
          }, error => this.log.error(message.bitcoinpriceMessage, error));

        this.walletServices.getInEUR(this.bitcoinpriceInfo)
          .subscribe(res => {

            let tmp = res.data.quotes;
            this.balanceInEUR = tmp.EUR.price;
          
            this.getEURBalance();
            this.getEURVaultBalance();
          }, error => this.log.error(message.bitcoinpriceMessage, error));
      },
        error => this.log.error(message.walletMessage, error));
  }

  getBTCBalance() {
    this.BTCwalletbalance = this.calculationsService.getCovertedamount(this.walletInfo.balance,this.balanceInBTC);
  }

  getUSDBalance() {
    this.USDwalletbalance = this.calculationsService.getCovertedamount(this.walletInfo.balance, this.balanceInUSD);
  }

  getEURBalance() {
    this.EURwalletbalance = this.calculationsService.getCovertedamount(this.walletInfo.balance, this.balanceInEUR);
  }

  getBTCVaultBalance() {
    this.BTCvaultbalance = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault, this.balanceInBTC);
  }

  getUSDVaultBalance() {    
    this.USDvaultbalance = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault, this.balanceInUSD);
  }

  getEURVaultBalance() {
    this.EURvaultbalance = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault, this.balanceInEUR);
  }

  // get blockchain status
  private getBlockchainInfo() {
    this.walletServices.getBlockchainInfo()
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.currentBlock = res.blocks;
      }, error => {
        this.log.error(error.message, error); 
    })
  }

  // get tor status
  private getTorstatus() {
    this.walletServices.getTorstatus()
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        const torEnabled = (res.indexOf("Enabled") > -1);
        this.torStatus = torEnabled ? 'enabled' : 'disabled';
      }, error => {
        this.log.error(error.message, error); 
    })
  }

  // get node status
  private getnodestatus() {
    this._rpcState.observe(ApiEndpoints.Ghostnode)
      .takeWhile(() => !this.destroyed)
      .subscribe(NodeInformations => {
        this.log.d('get node status')
        this.isActiveNodeCount = NodeInformations;
      },
        error => this.log.error(message.recentTransactionMessage, error));

    const timeout = 1000;
    const _call = () => {
      if (this.destroyed) {
        // RpcState service has been destroyed, stop.
        return;
      }

      this.walletServices.ghostnodeEnabledCount()
        .subscribe(count => {
          this.enabledNodeCount = count;
          setTimeout(_call, timeout);
        }, error => {
          this.log.error(message.bitcoinpriceMessage, error);
        });
    };

    _call();
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
      amountInEUR: this.balanceInEUR,
      currency: this.currentCurrency,
      modalsService: this.modalsService
    };

    if (walletType == 'vault') data.balance = this.walletInfo.ghost_vault;
    
    this.modalsService.openSmall('send', data);
  }

  openReceive(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      balance: this.walletInfo.balance,
      currency: this.currentCurrency,
      amountInUSD: this.balanceInUSD,
      amountInEUR: this.balanceInEUR,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('receive', data);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
