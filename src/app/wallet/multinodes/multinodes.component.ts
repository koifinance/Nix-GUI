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
  ghostNodeBalance: number;
  USDghostnodebalance: number;
  BTCghostnodebalance: number;
  EURghostnodebalance: number;
  balanceInUSD: any;
  balanceInBTC: any;
  balanceInEUR: any;
  currentCurrency: string;
  ghostNodeCount: number;
  roi: number;

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
    this.getMyGhostNodes();
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
    this.BTCghostnodebalance = this.calculationService.getCovertedamount(this.ghostNodeBalance,this.balanceInBTC);
  }

  getUSDBalance() {
    this.USDghostnodebalance = this.calculationService.getCovertedamount(this.ghostNodeBalance, this.balanceInUSD);
  }

  getEURBalance() {
    this.EURghostnodebalance = this.calculationService.getCovertedamount(this.ghostNodeBalance, this.balanceInEUR);
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
        this.roi = (262800 * 8.448) / (this.ghostNodeCount * 40000) * 100;
        this.roi = Math.round(this.roi*100) / 100;
      },
        error => this.log.error(message.recentTransactionMessage, error));
  }

  private getMyGhostNodes() {
    const timeout = 60000;
    const _call = () => {
      if (this.destroyed) {
        // RpcState service has been destroyed, stop.
        return;
      }

      this.walletServices.getMyGhostnode()
        .subscribe(res => {
          let nodes: Array<any> = [];
          for (let node in res) {
            nodes.push(res[node]);
          }

          this.ghostNodes = nodes;
          this.ghostNodeBalance = 40000 * nodes.length;
          setTimeout(_call, timeout);
        }, error => {
          this.log.error(message.bitcoinpriceMessage, error);
        });
    };

    _call();
  }

  openWithDraw() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openxSmall('withdrawRewards', data);
  }

  setupNewNode(node: any) {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService,
      parentRef: this,
      title: "Start Ghostnode",
      forStaking: false
    };
    this.modalsService.openSmall('ghostnodeInfoInput', data);
  }

  showAllGhostnodes() {
    this.router.navigate(['./multinodes/all-ghost-node']);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

}
