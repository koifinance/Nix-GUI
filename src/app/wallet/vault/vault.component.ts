import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

import { ModalsService } from '../modals/modals.service';
import { RpcStateService } from '../../core/core.module';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { IWalletInfo, WalletInfo, IBitcoinprice, bitcoinprice } from '../business-model/entities';
import { ApiEndpoints, message } from '../business-model/enums';
import { WalletService } from '../wallet.service';
import { CalculationsService } from '../calculations.service';

@Component({
  selector: 'wallet-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent implements OnInit, OnDestroy {

  transactionColumns: string[] = ['date', 'category', 'confirmations', 'amount'];
  vaultInitialized: boolean = false;
  faq: Array<FAQ> = faq;
  private log: any = Log.create('vault.component');
  private destroyed: boolean = false;
  walletInfo: IWalletInfo = new WalletInfo();
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  public bitcoinprice;
  balanceInBTC: number;
  pendingInBTC: number;
  balanceInUSD: number;
  pendingInUSD: number;
  BTCbalance: number;
  USDbalance: number;
  BTCpending: number;
  USDpending: number;

  constructor(
    private modalsService: ModalsService,
    private _rpcState: RpcStateService, private walletServices: WalletService, private calculationsService: CalculationsService,
  ) {
  }

  ngOnInit() {
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
      },
        error => this.log.error('Failed to get balance, ', error));
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
      amountInUSD: this.bitcoinprice.USD.price,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('receive', data);
  }

  // to open the send vault modal
  openSend(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      amountInUSD: this.bitcoinprice.USD.price,
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
  // to get the Pending balance converted into BTC amount
  getBTCPending() {
    this.BTCpending = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault_unconfirmed, this.balanceInBTC);
  }
  // to get the Pending balance converted into USD amount
  getUSDPending() {
    this.USDpending = this.calculationsService.getCovertedamount(this.walletInfo.ghost_vault_unconfirmed, this.balanceInUSD);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }


}
