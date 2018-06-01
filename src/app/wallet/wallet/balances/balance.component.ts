import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';

import { RpcStateService } from '../../../core/core.module';

import { Amount } from '../../shared/util/utils';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  @Input() type: string; // "total_balance", "anon_balance", "balance", "staked_balance", "node_balance"
  @Input() color: string = '';

  private log: any = Log.create(`balance.component ${this.type}`);
  private destroyed: boolean = false;
  private faCircle: any = faCircle;
  private faCircleSolid: any = faCircleSolid;
  private faArrowUp: any = faArrowUp;
  private faArrowDown: any = faArrowDown;

  private _balance: Amount = new Amount(0);

  get balance() {
    return this._balance;
  }

  constructor(private _rpcState: RpcStateService) { }

  ngOnInit() {
    this._rpcState.observe('getwalletinfo', this.type)
    .takeWhile(() => !this.destroyed)
    .subscribe(
      balance => this._balance = new Amount(balance || 0, 4),
      error => this.log.error('Failed to get balance, ', error));
  }

  /* UI */
  getTypeOfBalance(): string {
    switch (this.type) {
      case 'total_balance':
        return 'Total balance';
      case 'balance':
        return 'Wallet';
      case 'anon_balance':
        return 'Ghost Vault';
      case 'node_balance':
        return 'Ghost Node';
      case 'staked_balance':
        return 'Stake';
    }
    return this.type;
  }

  getButtonName(): string {
    if (this.type === 'balance' || this.type === 'total_balance') {
      return 'Receive';
    } else if (this.type === 'anon_balance') {
      return 'Deposit';
    }
    return '';
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
