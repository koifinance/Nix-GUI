import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

import { ModalsService } from '../modals/modals.service';
import { RpcStateService } from '../../core/core.module';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { IWalletInfo, WalletInfo } from '../business-model/entities';
import { ApiEndpoints } from '../business-model/enums';

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

  constructor(
    private modalsService: ModalsService,
    private _rpcState: RpcStateService
  ) {
  }

  ngOnInit() {
    this.initialized();
    this.getwalletinformation();
  }

  private initialized() {
    this._rpcState.observe('ui:vaultInitialized')
      .takeWhile(() => !this.destroyed)
      .subscribe(status => this.vaultInitialized = status);
  }

  private getwalletinformation() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(walletInfo => {        
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
      },
        error => this.log.error('Failed to get balance, ', error));
  }



  open(modal: string) {
    const data: any = {
      forceOpen: true,
      walletType: 'vault',
      modalsService: this.modalsService
    };
    this.modalsService.openSmall(modal, data);
  }

  createVault() {
    // set rpc state variable `ui:vaultInitialized` after success
    this.vaultInitialized = true;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

}
