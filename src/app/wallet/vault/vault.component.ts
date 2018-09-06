import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

import { ModalsService } from '../modals/modals.service';
import { RpcStateService } from '../../core/core.module';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { IWalletInfo, WalletInfo, IBitcoinprice, bitcoinprice } from '../business-model/entities';
import { ApiEndpoints, message } from '../business-model/enums';
import { WalletService } from '../wallet.service';

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
  constructor(
    private modalsService: ModalsService,
    private _rpcState: RpcStateService, private walletServices: WalletService
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
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('receive', data);
  }

  // to open the send vault modal
  openSend(walletType: string) {
    const data: any = {
      forceOpen: true,
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
    debugger
    this.walletServices.getBitcoin(this.bitcoinpriceInfo)
    .subscribe(bitcoinpriceInfos => {
      debugger
      this.bitcoinprice = bitcoinpriceInfos.data.quotes;
    },
        error => this.log.error(message.bitcoinpriceMessage, error));
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

}
