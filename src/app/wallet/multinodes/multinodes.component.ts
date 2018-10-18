import { Component, OnInit } from '@angular/core';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { Router } from '@angular/router';
import { ModalsService } from '../modals/modals.service';
import { WalletService } from '../wallet.service';
import { Log } from 'ng2-logger';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints, message } from '../business-model/enums';
import { CalculationsService } from '../calculations.service';
import {
  WalletInfo,
  IWalletInfo,
  IBitcoinprice,
  bitcoinprice
} from '../business-model/entities';
@Component({
  selector: 'app-multinodes',
  templateUrl: './multinodes.component.html',
  styleUrls: ['./multinodes.component.scss']
})
export class MultinodesComponent implements OnInit {
  faq: Array<FAQ> = faq;
  private destroyed: boolean = false;
  transactionColumns: string[] = ['Name', 'Status', 'Active for'];
  private log: any = Log.create('Multinodes.component');
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  walletInfo: IWalletInfo = new WalletInfo();
  ghostNodes: Array<any>;
  USDwalletbalance: number;
  BTCwalletbalance: number;
  EURwalletbalance: number;
  balanceInUSD: any;
  balanceInBTC: any;
  balanceInEUR: any;
  currentCurrency: string;
  ghostNodeCount: number;

  constructor(
    private calculationService: CalculationsService,
    private modalsService: ModalsService,
    private router: Router,
    private walletServices: WalletService,
    private _rpcState: RpcStateService) { }

  ngOnInit() {
    this.currentCurrency = this.walletServices.getCurrency();
    this.getBalance();
    this.getwalletinformation();
    this.getGhostNodeCount();
  }

 //get wallet informations
  private getwalletinformation() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
        this.walletServices.getBitcoin(this.bitcoinpriceInfo)
          .subscribe(bitcoinpriceInfos => {
            let bitcoinprice = bitcoinpriceInfos.data.quotes;
            this.balanceInBTC = bitcoinprice.BTC.price;
            this.balanceInUSD = bitcoinprice.USD.price;
          
            this.getBTCBalance();
            this.getUSDBalance();
          }, error => this.log.error(message.bitcoinpriceMessage, error));

        this.walletServices.getInEUR(this.bitcoinpriceInfo)
          .subscribe(res => {

            let tmp = res.data.quotes;
            this.balanceInEUR = tmp.EUR.price;
          
            this.getEURBalance();
          }, error => this.log.error(message.bitcoinpriceMessage, error));
      },
        error => this.log.error('Failed to get wallet information, ', error));
  }

  getBTCBalance() {
    this.BTCwalletbalance = this.calculationService.getCovertedamount(this.walletInfo.balance,this.balanceInBTC);
  }

  getUSDBalance() {
    this.USDwalletbalance = this.calculationService.getCovertedamount(this.walletInfo.balance, this.balanceInUSD);
  }

  getEURBalance() {
    this.EURwalletbalance = this.calculationService.getCovertedamount(this.walletInfo.balance, this.balanceInEUR);
  }

  // get balance
  private getBalance() {
    this.walletServices.getBalanceAmount()
      .subscribe(res => {
        console.log(res)
      },
      error => this.log.error('Failed to get balance, ', error));
  }

  // get ghost node count
  private getGhostNodeCount() {
    this._rpcState.observe(ApiEndpoints.Ghostnode)
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.ghostNodeCount = res;
      },
        error => this.log.error(message.recentTransactionMessage, error));
  }

  openWithDraw() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openxSmall('withdrawRewards', data);
  }

  showAllGhostnodes() {
    this.router.navigate(['./multinodes/all-ghost-node']);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
 

}
