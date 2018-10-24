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
  bitcoinprice
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
  isStaking: boolean = false;
  stakingInfo: any;
  nextTimeStr: string;
  lastSearchTime: Date;
  dataSource: MatTableDataSource<IRecentTransactionInfo>;


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
    // this._rpcState.observe(ApiEndpoints.GetWalletInfo)
    //   .takeWhile(() => !this.destroyed)
    //   .subscribe(walletInfo => {
    //     this.walletInfo = new WalletInfo(walletInfo).toJSON();
    //     this.walletServices.getBitcoin(this.bitcoinpriceInfo)
    //       .subscribe(bitcoinpriceInfos => {
    //         let bitcoinprice = bitcoinpriceInfos.data.quotes;
    //         this.balanceInBTC = bitcoinprice.BTC.price;
    //         this.balanceInUSD = bitcoinprice.USD.price;
          
    //         this.getBTCBalance();
    //         this.getUSDBalance();
    //       }, error => this.log.error(message.bitcoinpriceMessage, error));

    //     this.walletServices.getInEUR(this.bitcoinpriceInfo)
    //       .subscribe(res => {

    //         let tmp = res.data.quotes;
    //         this.balanceInEUR = tmp.EUR.price;
          
    //         this.getEURBalance();
    //       }, error => this.log.error(message.bitcoinpriceMessage, error));
    //   },
    //     error => this.log.error('Failed to get wallet information, ', error));
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

    if (!this.isStaking) this.dataSource.data = null;
  }

  // Enable/disable tor status
  stakingToggled(event: MatSlideToggleChange) {
    if (event.checked) {
      this.walletServices.enableStaking(event.checked ? 'true' : 'false')
        .takeWhile(() => !this.destroyed)
        .subscribe(res => {
          this.flashNotification.open(res, 'err')
        }, error => { 
          this.flashNotification.open(error.message, 'err')
          this.log.error(error.message, error); 
      })
    } else {
      this.walletServices.walletlock()
        .takeWhile(() => !this.destroyed)
        .subscribe(res => {
          this.isStaking = false;
          this.setupStakingInfo();
          // debugger
          // const _call = () => {
          //   this.getStakingInformation();
          // };
          // setTimeout(_call, 2000);
        }, error => { 
          this.flashNotification.open(error.message, 'err')
          this.log.error(error.message, error); 
      })
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
 

}
