import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign } from '@fortawesome/free-solid-svg-icons';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.model';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FilterService } from '../../transactions/filter.service';

@Component({
  selector: 'transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit, OnDestroy {

  @Input() display: any;
  @Input() columns: string[];
  @Input() filterFunc: any;
  dataSource: MatTableDataSource<Transaction>;
  faCircleSolid: any = faCircleSolid;
  faCircle: any = faCircle;
  private log: any = Log.create('transaction-table.component');
  private destroyed: boolean;
  private defaults: any = {
    header: true,
    numTransactions: 10,
    columns: ['category', 'amount', 'address', 'confirmations', 'date'],
    longDate: false,
    styleClass: '',
  };
  private transactionSubscription: Subscription;
  private filterSubscription: Subscription;

  constructor(
    public transactionService: TransactionService,
    private filterService: FilterService,
  ) {
  }

  ngOnInit() {
    this.display = Object.assign({}, this.defaults, this.display);
    this.log.d(`number of transactions per page ${this.display.numTransactions}`);
    this.transactionService.postConstructor(this.display.numTransactions);
    this.dataSource = new MatTableDataSource<Transaction>();

    if (this.filterFunc) {
      this.dataSource.filterPredicate = (transaction, filter) => {
        return this.filterFunc(transaction, filter);
      };
    }

    this.transactionSubscription = this.transactionService.transactionEvent
      .subscribe(value => {
        this.dataSource.data = this.transactionService.transactions;
      });

    this.filterSubscription = this.filterService.filterEvent
      .subscribe(value => {
        if (value === 'apply') {
          this.dataSource.filter = 'all';
        }
      });
  }

  ngOnDestroy(): void {
    this.transactionSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
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
    if (category === 'send') {
      return `Sent ${currency}`;
    } else if (category === 'receive') {
      return `Received ${currency}`;
    } else if (category === 'node') {
      return `Node Earnings`;
    }
    return '';
  }

  public getCategoryIconStyle(category: string): any {
    if (category === 'send') {
      return faArrowUp;
    } else if (category === 'receive') {
      return faArrowDown;
    } else if (category === 'node') {
      return faDollarSign;
    }
    return '';
  }

  /*public getCategoryIconStyle(category: string): string {
    const path = './assets/icons/SVG/';
    if (category === 'send') {
      return path + 'arrow-up-nix.svg';
    } else if (category === 'receive') {
      return path +  'arrow-down-black.svg';
    } else if (category === 'node') {
      return path +  '';
    }
    return path;
  }*/
}
