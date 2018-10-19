import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

import { ModalsService } from '../modals/modals.service';
import { RpcStateService } from '../../core/core.module';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { 
  IWalletInfo,
  WalletInfo,
  IBitcoinprice,
  bitcoinprice,
  IUnGhostAmount,
  UnGhostAmount
} from '../business-model/entities';
import { ApiEndpoints, message } from '../business-model/enums';
import { WalletService } from '../wallet.service';
import { CalculationsService } from '../calculations.service';

@Component({
  selector: 'wallet-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent implements OnInit, OnDestroy {

  transactionColumns: string[] = ['date', 'type', 'status', 'amount'];
  vaultInitialized: boolean = false;
  faq: Array<FAQ> = faq;
  private log: any = Log.create('vault.component');
  private destroyed: boolean = false;
  walletInfo: IWalletInfo = new WalletInfo();
  unghostInfo: IUnGhostAmount = new UnGhostAmount();
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  public bitcoinprice;
  balanceInBTC: number;
  pendingInBTC: number;
  balanceInEUR: number;
  balanceInUSD: number;
  pendingInUSD: number;
  BTCbalance: number;
  USDbalance: number;
  EURbalance: number;
  BTCpending: number;
  USDpending: number;
  EURpending: number;
  currentCurrency: string;

  constructor(
    private modalsService: ModalsService,
    private _rpcState: RpcStateService,
    private walletServices: WalletService,
    private calculationsService: CalculationsService,
  ) {
  }

  ngOnInit() {
    this.currentCurrency =  this.walletServices.getCurrency();
    this.initialized();
    this.getwalletinformation();
    this.getBitcoinpriceinfo();

  }

  private initialized() {
    this._rpcState.observe('ui:vaultInitialized')
      .takeWhile(() => !this.destroyed)
      .subscribe(status => this.vaultInitialized = status);
  }

  // to get wallet information for vault
  private getwalletinformation() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
        
        this.getBTCBalance();
        this.getUSDBalance();
        this.getBTCPending();
        this.getUSDPending();
      },
        error => this.log.error('Failed to get balance, ', error));
    
    this.walletServices.getInEUR(this.bitcoinpriceInfo)
      .subscribe(res => {

        let tmp = res.data.quotes;
        this.balanceInEUR = tmp.EUR.price;
      
        this.getEURBalance();
        this.getEURPending();
      }, error => this.log.error(message.bitcoinpriceMessage, error));
  }

  // open(modal: string) {
  //   const data: any = {
  //     forceOpen: true,
  //     walletType: 'vault',
  //     modalsService: this.modalsService
  //   };
  //   this.modalsService.openSmall(modal, data);
  // }

  // to open the receive vault-deposit modal
  openDeposit(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      balance: this.walletInfo.balance,
      amountInUSD: this.balanceInUSD,
      amountInEUR: this.balanceInEUR,
      currency: this.currentCurrency,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('receive', data);
  }

  // to open the send vault modal
  openSend(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      balance: this.walletInfo.ghost_vault,
      amountInUSD: this.bitcoinprice.USD.price,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('send', data);
  }

  // to open the withdraw NIX to wallet
  openWithdraw(walletType: string) {
    const data: any = {
      forceOpen: true,
      balance: this.walletInfo.ghost_vault,
      walletType: walletType,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('send', data);
  }

  createVault() {
    // set rpc state variable `ui:vaultInitialized` after success
    this.vaultInitialized = true;
  }

  // get bitcoin price
  private getBitcoinpriceinfo() {
    this.walletServices.getBitcoin(this.bitcoinpriceInfo)
      .subscribe(bitcoinpriceInfos => {
        this.bitcoinprice = bitcoinpriceInfos.data.quotes;
        // BTC amount for 1 NIX
        this.balanceInBTC = this.bitcoinprice.BTC.price;
        // USD amount for 1 NIX
        this.balanceInUSD = this.bitcoinprice.USD.price;

        this.getBTCBalance();
        this.getUSDBalance();
        this.getBTCPending();
        this.getUSDPending();
      },
        error => this.log.error(message.bitcoinpriceMessage, error));
  }

  // to get the ghost vault balance converted into BTC amount
  getBTCBalance() {
    this.BTCbalance = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault, this.balanceInBTC);
  }
  // to get the ghost vault balance converted into USD amount
  getUSDBalance() {
    this.USDbalance = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault, this.balanceInUSD);
  }
  // to get the ghost vault balance converted into EUR amount
  getEURBalance() {
    this.EURbalance = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault, this.balanceInEUR);
  }
  // to get the Pending balance converted into BTC amount
  getBTCPending() {
    this.BTCpending = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault_unconfirmed, this.balanceInBTC);
  }
  // to get the Pending balance converted into USD amount
  getUSDPending() {
    this.USDpending = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault_unconfirmed, this.balanceInUSD);
  }
  // to get the Pending balance converted into EUR amount
  getEURPending() {
    this.EURpending = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault_unconfirmed, this.balanceInEUR);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }


}
