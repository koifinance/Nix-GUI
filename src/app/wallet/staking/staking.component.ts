import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { faTimes, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ModalsService } from '../modals/modals.service';
import { WalletService } from '../wallet.service';
import { SnackbarService } from '../../core/core.module';
import { Log } from 'ng2-logger';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints, message } from '../business-model/enums';
import { CalculationsService } from '../calculations.service';
import {
  WalletInfo,
  IWalletInfo,
  IRecentTransactionInfo,
  IBitcoinprice,
  bitcoinprice,
  IPassword,
  encryptpassword
} from '../business-model/entities';
import { Observable } from '../../../../node_modules/rxjs';


@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})

export class StakingComponent implements OnInit {
  faq: Array<FAQ> = faq;
  faTimes: any = faTimes;
  faDetail: any = faAlignLeft;
  private destroyed: boolean = false;
  leaseStakingColumns: string[] = ['Amount', 'Address', 'Fee', 'Detail2', 'Cancel'];
  transactionColumns: string[] = ['Amount', 'Status', 'Created', 'Detail'];
  private log: any = Log.create('Staking.component');
  toggleInfo: number;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  walletInfo: IWalletInfo = new WalletInfo();
  stakingAmount: number;
  unconfirmedBalance: number;
  immatureBalance: number;
  balanceInBTC: number;
  balanceInUSD: number;
  BTCwalletbalance: number;
  USDwalletbalance: number;
  isStaking: boolean = false;
  stakingInfo: any;
  nextTimeStr: string;
  lastSearchTime: Date;
  dataSource: MatTableDataSource<IRecentTransactionInfo>;
  leasestakingSource: MatTableDataSource<IRecentTransactionInfo>;
  totalLeaseStaked: number = 0;
  chartLabels: string[] = ['Staking', 'Immature', 'Unavailable'];
  chartData: number[] = [0,0,0];
  chartType: string = 'doughnut';
  chartOptions: any = { legend: { display: false }};
  chartColors: Array<any> = [
    {
      backgroundColor: ['#0ecbc1', '#ffdd47', '#eaeaea']
    }
  ]

  constructor(
    private calculationService : CalculationsService,
    private modalsService: ModalsService,
    private router: Router,
    private walletServices: WalletService,
    private _rpcState: RpcStateService,
    private flashNotification: SnackbarService) {
      this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.unconfirmedBalance = walletInfo.unconfirmed_balance;
        this.immatureBalance = walletInfo.immature_balance;
        this.drawOverviewChart();
      },
        error => this.log.error('Failed to get wallet information, ', error));
    }

  ngOnInit() {
    this.toggleInfo = 0;
    this.destroyed = false;
    this.dataSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.dataSource.data = null;
    this.leasestakingSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.leasestakingSource.data = null;
    this.getStakingInformation();
    this.getTransactions();
    this.getLeaseStakingList();
    Observable.interval(5000).takeWhile(() => !this.destroyed).subscribe(() => this.getLeaseStakingList());
  }

  // get all transaction
  private getTransactions() {
    this._rpcState.observe(ApiEndpoints.ListTransactions)
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        if (!this.isStaking) {
          return;
        }
        let stakedTrans = res.filter( el => el.category=='stake');
        let sortedTrans: Array<any> = stakedTrans.sort((t1, t2) => t2.time - t1.time);
        sortedTrans.forEach( (el) => {
          el.created = new Date(el.time * 1000);
        });
        this.dataSource.data = sortedTrans;
      },
        error => this.log.error(message.transactionMessage, error));
  }

  // get all leasestaking transactions
  private getLeaseStakingList() {
    let amount = 0;
    this.walletServices.getLeaseStakingList()
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        let sortedTrans = [];
        for (let key in res) {
          if (res.hasOwnProperty(key)) {
            sortedTrans.push(res[key]);
            amount = amount + res[key].amount / 100000000;
          }
        }
        if (this.totalLeaseStaked !== amount) this.totalLeaseStaked = amount;
        this.leasestakingSource.data = sortedTrans;

        this.walletServices.getBitcoin(this.bitcoinpriceInfo)
          .subscribe(bitcoinpriceInfos => {
            this.balanceInBTC = bitcoinpriceInfos.data.quotes.BTC.price;
            this.balanceInUSD = bitcoinpriceInfos.data.quotes.USD.price;
            this.BTCwalletbalance = this.calculationService.getCovertedamount(this.totalLeaseStaked,this.balanceInBTC);
            this.USDwalletbalance = this.calculationService.getCovertedamount(this.totalLeaseStaked,this.balanceInUSD);
          }, error => this.log.error(message.bitcoinpriceMessage, error));
      },
        error => this.log.error(message.transactionMessage, error));
  }

  // get staking info
  private getStakingInformation() {
    this.walletServices.getStakingInfo()
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.stakingInfo = res;
        this.isStaking = res.staking==1;
        this.setupStakingInfo();
      },
      error => this.log.error('Failed to get staking info, ', error));
  }

  private setupStakingInfo() {
    this.stakingAmount = this.isStaking ? (this.stakingInfo.weight / 100000000) : 0;
    let expectedTime: number = this.stakingInfo.expectedtime;
    let fromHour: number = Math.floor(expectedTime/3600);
    let toHour: number = fromHour + 3;
    this.nextTimeStr = (fromHour < 1000) ? (fromHour + " - " + toHour) : fromHour+"";
    this.nextTimeStr = this.isStaking ? this.nextTimeStr : "N/A";
    this.lastSearchTime = new Date(this.stakingInfo.lastsearchtime * 1000);

    this.drawOverviewChart();
    if (!this.isStaking) this.dataSource.data = null;
  }

  private drawOverviewChart() {
    let newChartData: number[] = [0,0,0];
    if (this.isStaking) {
      newChartData = [this.stakingAmount, this.immatureBalance, this.unconfirmedBalance];
    } else {
      newChartData = [0, 0, 1];
    }
    if (newChartData.length == this.chartData.length) {
      for (let i = 0; i < newChartData.length; i++) {
        if (newChartData[i] != this.chartData[i]) {
          this.chartData = newChartData;
          return;
        }
      }
    } else {
      this.chartData = newChartData;
    }
  }

  openLpos(element) {
    console.log(element, '====');
    this.modalsService.openxSmall('stakingDetail', {...element, forceOpen: true, modalsService: this.modalsService})
  }

  cancelLpos(element) {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService,
      txhash: element.tx_hash,
      txIndex: element.tx_index,
      txAmount: element.amount / 100000000
    };

    this.modalsService.openxSmall('passwordInput', data);
  }

  // Enable/disable tor status
  stakingToggled(e: any) {
    if (e.srcElement.checked) {
      e.srcElement.checked = false;
      this.openPassword();
    } else {
      this.walletServices.walletlock()
        .takeWhile(() => !this.destroyed)
        .subscribe(res => {
          this.isStaking = false;
          this.setupStakingInfo();
        }, error => {
          this.flashNotification.open(error.message, 'err')
          this.log.error(error.message, error); 
      })
    }
  }

  passwordEntered(passphrase: IPassword) {
    this.isStaking = true;
    this.getStakingInformation();
    // debugger
    // this.walletServices.enableStaking(passphrase).subscribe(res => {
    //   this.stakingEnabled();
    // }, error => {
    //   this.flashNotification.open(error.message, 'err')
    //   this.log.er(message.ChangePasswordMessage, error)
    // });
  }

  stakingEnabled() {
    
  }

  setCategory(event) {
    this.toggleInfo = event.index;
  }

  newLeaseContract() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService,
    };
    this.modalsService.openxSmall('leasingContract', data);
  }

  openPassword() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService,
      parentRef: this,
      forStaking: true
    };
    this.modalsService.openSmall('passwordInput', data);
  }

  openOptimizeStaking() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };    
    this.modalsService.openSmall('optimizeStaking', data);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
