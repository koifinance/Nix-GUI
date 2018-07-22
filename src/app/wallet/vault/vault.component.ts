import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

import { ModalsService } from '../modals/modals.service';
import { RpcStateService } from '../../core/core.module';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';

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

  constructor(
    private modalsService: ModalsService,
    private rpcState: RpcStateService
  ) {
  }

  ngOnInit() {
    this.rpcState.observe('ui:vaultInitialized')
      .takeWhile(() => !this.destroyed)
      .subscribe(status => this.vaultInitialized = status);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
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
  }
}
