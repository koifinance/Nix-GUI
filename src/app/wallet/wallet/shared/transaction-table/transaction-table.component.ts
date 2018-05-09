import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Log } from 'ng2-logger';

import { slideDown } from 'app/core-ui/core.animations';
import { Transaction } from '../transaction.model';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  providers: [TransactionService],
  animations: [slideDown()]
})

export class TransactionsTableComponent implements OnInit {

  @Input() display: any;
  @ViewChild('paginator') paginator: any;

  /* Determines what fields are displayed in the Transaction Table. */
  /* header and utils */
  private _defaults: any = {
    header: true,
    internalHeader: false,
    pagination: false,
    txDisplayAmount: 10,
    category: true,
    date: true,
    amount: true,
    confirmations: true,
    txid: false,
    senderAddress: true,
    receiverAddress: true,
    comment: true,
    blockHash: false,
    blockIndex: false,
    expand: false,
    expansionPanel: false
  };

  /*
    This shows the expanded table for a specific unique identifier = (tx.txid + tx.getAmountObject().getAmount() + tx.category).
    If the unique identifier is present, then the details will be expanded.
  */
  private expandedTransactionID: string = undefined;
  pageEvent: PageEvent;
  /* MatPaginator output */
  log: any = Log.create('transaction-table.component');

  constructor(public txService: TransactionService) {

  }

  ngOnInit(): void {
    this.display = Object.assign({}, this._defaults, this.display); // Set defaults
    this.log.d(`transaction-table: amount of transactions per page ${this.display.txDisplayAmount}`);
    this.txService.postConstructor(this.display.txDisplayAmount);
  }

  public filter(filters: any) {
    if (this.inSearchMode(filters.search)) {
      this.resetPagination();
    }
    this.txService.filter(filters);
  }

  public pageChanged(event: any): void {
    this.log.d('pageChanged:', event);
    this.txService.MAX_TXS_PER_PAGE = event.pageSize;
    // increase page index because its start from 0
    this.txService.changePage(event.pageIndex++);
  }

  private inSearchMode(query: any): boolean {
    return (query !== undefined && query !== '');
  }

  public showExpandedTransactionDetail(tx: Transaction): void {
    const txid: string = tx.getExpandedTransactionID();
    if (this.expandedTransactionID === txid) {
      this.expandedTransactionID = undefined;
    } else {
      this.expandedTransactionID = txid;
    }
  }

  public checkExpandDetails(tx: Transaction): boolean {
    return (this.expandedTransactionID === tx.getExpandedTransactionID());
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
    } else if (category === 'stake') {
      return `Node earnings`;
    }
    return '';
  }

  public getCategoryIconStyle(category: string): string {
    if (category === 'send') {
      return 'fa-arrow-up';
    } else if (category === 'receive') {
      return 'fa-arrow-down';
    } else if (category === 'receive') {
      return 'fa-dollar-sign';
    }
    return '';
  }

  public resetPagination(): void {
    if (this.paginator) {
      this.paginator.resetPagination(0);
      this.txService.changePage(0);
    }
  }

}
