import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign } from '@fortawesome/free-solid-svg-icons';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.model';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FilterService } from '../../transactions/filter.service';
import { RpcStateService } from '../../../core/core.module';
import { ApiEndpoints, categories, message } from '../../business-model/enums';
import { TransactionInfo, ITransactionInfo, IRecentTransactionInfo, RecentTransactionInfo } from '../../business-model/entities';

@Component({
  selector: 'transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() display: any;
  @Input() columns: string[];
  @Input() filter: any;
  @Input() numTransactions: number;

  dataSource: MatTableDataSource<IRecentTransactionInfo>;
  // public testDataSource: any;
  transactionAllNix: TransactionInfo = new ITransactionInfo();
  transactionInfo: RecentTransactionInfo = new IRecentTransactionInfo();
  faCircleSolid: any = faCircleSolid;
  faCircle: any = faCircle;
  private log: any = Log.create('transaction-table.component');
  private destroyed: boolean;
  private defaults: any = {
    header: true,
    numTransactions: 10,
    columns: ['date', 'category', 'confirmations', 'amount'],
    longDate: false,
    styleClass: '',
  };
  // private transactionSubscription: Subscription;
  // private filterSubscription: Subscription;

  constructor(
    public transactionService: TransactionService,
    private filterService: FilterService,
    private _rpcState: RpcStateService,
  ) {
  }

  ngOnInit() {
    this._rpcState.registerStateCall(ApiEndpoints.ListTransactions, 1000);
    this._rpcState.registerStateCall(ApiEndpoints.GetTrasaction, 1000, [this.transactionAllNix.txid]);
    this.display = Object.assign({}, this.defaults, this.display);
    this.log.d(`number of transactions per page ${this.display.numTransactions}`);
    this.transactionService.postConstructor(this.display.numTransactions);
    this.dataSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.dataSource.data = null;
    this.Transactions();
    this.listTransaction();
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  public getConfirmationsStyle(confirmations: number): string {
    if (confirmations < 0) {
      return 'confirm-error';
    } else if (confirmations <= 1) {
      return 'confirm-none';
    } else {
      return 'confirm-ok';
    }
  }

  public getConfirmationsText(confirmations: number): string {
    if (confirmations < 0) {
      return 'Error';
    } else if (confirmations <= 1) {
      return 'Processing';
    } else {
      return 'Complete';
    }
  }

  public getCategoryText(category: string, currency: string): string {
    if (categories.Send) {
      return `Sent ${currency}`;
    } else if (categories.Receive) {
      return `Received ${currency}`;
    } else if (categories.Node) {
      return `Node Earnings`;
    }
    return '';
  }

  public getCategoryIconStyle(category: string): any {
    if (categories.Send) {
      return faArrowUp;
    } else if (categories.Receive) {
      return faArrowDown;
    } else if (categories.Node) {
      return faDollarSign;
    }
    return '';
  }

  // get all transaction
  private Transactions() {
    this._rpcState.observe(ApiEndpoints.GetTrasaction)
      .subscribe(res => {
        // this.testDataSource =   res.transactions;
        //   this.dataSource.data = res;
      },
        error => this.log.error(message.transactionMessage, error));
  }

  // get recent transactions
  private listTransaction() {
    this._rpcState.observe(ApiEndpoints.ListTransactions)
      .subscribe(recentTransInfo => {        
        if (this.filter && this.filter.category !== 'all') {
          recentTransInfo = recentTransInfo.filter(item => item.category === this.filter.category );
        }
        this.log.d('============');
        this.log.d(recentTransInfo);
        this.log.d(this.filter);
        this.transactionInfo = recentTransInfo.slice(0, this.display.numTransactions);
        this.dataSource.data = recentTransInfo.slice(0, this.display.numTransactions);
      },
        error => this.log.error(message.recentTransactionMessage, error));
  }
}
