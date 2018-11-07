import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign } from '@fortawesome/free-solid-svg-icons';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.model';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FilterService } from '../../transactions/filter.service';
import { RpcStateService, RpcService } from '../../../core/core.module';
import { ModalsService } from '../../modals/modals.service';
import { ApiEndpoints, categories, message } from '../../business-model/enums';
import {
  TransactionInfo,
  ITransactionInfo,
  IRecentTransactionInfo,
  RecentTransactionInfo
} from '../../business-model/entities';

@Component({
  selector: 'transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() display: any;
  @Input() filter: any;

  dataSource: MatTableDataSource<IRecentTransactionInfo>;
  // public testDataSource: any;
  transactionAllNix: TransactionInfo = new ITransactionInfo();
  transactionInfo: RecentTransactionInfo = new IRecentTransactionInfo();
  faCircleSolid: any = faCircleSolid;
  faCircle: any = faCircle;

  private walletInfo: any = null;
  private filterCategory: any = {};
  private log: any = Log.create('transaction-table.component');
  private destroyed: boolean;
  private defaults: any = {
    header: true,
    numTransactions: 100,
    columns: ['Type', 'Amount', 'Address', 'Status', 'Date'],
    longDate: false,
    styleClass: '',
    recent: false
  };
  // private transactionSubscription: Subscription;
  // private filterSubscription: Subscription;

  constructor(
    public transactionService: TransactionService,
    private modalService: ModalsService,
    private _rpcState: RpcStateService,
    private _rpc: RpcService
  ) {
    this.destroyed = false;
    this.display = Object.assign({}, this.defaults, this.display);
    this.log.d(`number of transactions per page ${this.display.numTransactions}`);
    this.log.d(this.display);
    this.transactionService.postConstructor(this.display.numTransactions);
    this.dataSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.dataSource.data = null;
    
    // this._rpcState.observe(ApiEndpoints.GetWalletInfo)
    //   .takeWhile(() => !this.destroyed)
    //   .subscribe(response => {

    //     this.walletInfo = JSON.parse(localStorage.getItem('walletInfo'));
    //     this.log.d(JSON.stringify(response) === JSON.stringify(this.walletInfo));
    //     this.log.d(JSON.parse(localStorage.getItem('transactionlist')));
    //     this.log.d(JSON.stringify(this.filter) === JSON.stringify(this.filterCategory));
      
    //     if (JSON.stringify(response) !== JSON.stringify(this.walletInfo) || (JSON.stringify(this.filter) !== JSON.stringify(this.filterCategory)) ) {
    //       localStorage.setItem('walletInfo', JSON.stringify(response));
    //       this.filterCategory = this.filter;

    //       if (JSON.stringify(response) !== JSON.stringify(this.walletInfo) || !JSON.parse(localStorage.getItem('transactionlist'))) {
    //         this._rpc.call(ApiEndpoints.ListTransactions, ['*', 100])
    //         .subscribe(recentTransInfo => {

    //           localStorage.setItem('transactionlist', JSON.stringify(recentTransInfo));
    //           this.filterTransaction(recentTransInfo, this.filter);
    //         },
    //           error => this.log.error(message.recentTransactionMessage, error));
    //       } else {
    //         this.filterTransaction(JSON.parse(localStorage.getItem('transactionlist')), this.filter);
    //       }
    //     }
    // }, err => this.log.error(message.walletMessage, err));
  }

  filterTransaction(recentTransInfo, filter) {

    if (filter) {
      recentTransInfo = recentTransInfo.filter(item => {
        if (item.category !== filter.category && filter.category !== 'all') return false;
        if (filter.amountFilter === 'gt' && Math.abs(item.amount) <= Number(filter.amountFilterValue)) return false;
        if (filter.amountFilter === 'lt' && Math.abs(item.amount) >= Number(filter.amountFilterValue)) return false;
        if (filter.amountFilter === 'eq' && Math.abs(item.amount) !== Number(filter.amountFilterValue)) return false;

        const today = new Date();
        const txDate = new Date(item.time * 1000);
        let result = true;
        switch (filter.dateFilter) {
          case 'week': {
            today.setDate(today.getDate() - 7);
            result = txDate >= today;
            break;
          }
          case 'month': {
            today.setMonth(today.getMonth() - 1);
            result = txDate >= today;
            break;
          }
          case 'threemo': {
            today.setMonth(today.getMonth() - 3);
            result = txDate >= today;
            break;
          }
          case 'sixmo': {
            today.setMonth(today.getMonth() - 6);
            result = txDate >= today;
            break;
          }
          default: {
            result = true;
            break;
          }
        }
        return result;
      });
    }

    recentTransInfo = recentTransInfo.reverse();
    this.transactionInfo = recentTransInfo.slice(0, this.display.numTransactions);
    this.dataSource.data = recentTransInfo.slice(0, this.display.numTransactions);
  }

  ngOnInit() {
    this.destroyed = false;
    this.display = Object.assign({}, this.defaults, this.display);
    this.transactionService.postConstructor(this.display.numTransactions);
    this.dataSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.dataSource.data = null;

    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(response => {
        
        this.walletInfo = JSON.parse(localStorage.getItem('walletInfo'));
      
        if (JSON.stringify(response) !== JSON.stringify(this.walletInfo) || (JSON.stringify(this.filter) !== JSON.stringify(this.filterCategory)) ) {
          localStorage.setItem('walletInfo', JSON.stringify(response));
          this.filterCategory = this.filter;

          if (JSON.stringify(response) !== JSON.stringify(this.walletInfo) || !JSON.parse(localStorage.getItem('transactionlist'))) {
            this._rpc.call(ApiEndpoints.ListTransactions, ['*', 100])
            .subscribe(recentTransInfo => {
              localStorage.setItem('transactionlist', JSON.stringify(recentTransInfo));
              this.filterTransaction(recentTransInfo, this.filter);
            },
              error => this.log.error(message.recentTransactionMessage, error));
          } else {
            this.filterTransaction(JSON.parse(localStorage.getItem('transactionlist')), this.filter);
          }
        }
    }, err => this.log.error(message.walletMessage, err));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.filter.currentValue) !== JSON.stringify(changes.filter.previousValue)) {
      this.filterTransaction(JSON.parse(localStorage.getItem('transactionlist')), changes.filter.currentValue);
    }
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

  public showTransactionInModal(row: any) {
    row.forceOpen = true;
    this.modalService.openSmall('transactionDetail', row);
  }

}