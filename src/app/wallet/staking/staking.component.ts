import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
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


@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})

export class StakingComponent implements OnInit {
  faq: Array<FAQ> = faq;
  private destroyed: boolean = false;
  transactionColumns: string[] = ['Amount', 'Status', 'Created', 'Detail'];
  private log: any = Log.create('Staking.component');
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  walletInfo: IWalletInfo = new WalletInfo();
  stakingAmount: number;
  unconfirmedBalance: number;
  immatureBalance: number;
  isStaking: boolean = false;
  stakingInfo: any;
  nextTimeStr: string;
  lastSearchTime: Date;
  dataSource: MatTableDataSource<IRecentTransactionInfo>;
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
    private calculationService: CalculationsService,
    private modalsService: ModalsService,
    private router: Router,
    private walletServices: WalletService,
    private _rpcState: RpcStateService,
    private flashNotification: SnackbarService) { }

  ngOnInit() {
    this.destroyed = false;
    this.dataSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.dataSource.data = null;
    this.getStakingInformation();
    this.getwalletinformation();
    this.getTransactions();
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

 //get wallet informations
  private getwalletinformation() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.unconfirmedBalance = walletInfo.unconfirmed_balance;
        this.immatureBalance = walletInfo.immature_balance;
        this.drawOverviewChart();
      },
        error => this.log.error('Failed to get wallet information, ', error));
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
