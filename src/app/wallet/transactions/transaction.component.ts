
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subscription } from 'rxjs/Subscription';
import { MatTabChangeEvent } from '@angular/material';

import { ModalsService } from '../modals/modals.service';
import { Transaction } from '../shared/transaction/transaction.model';
import { FilterService } from './filter.service';
import { faq } from './faq';
import { FAQ } from '../shared/faq.model';

@Component({
  selector: 'wallet-transactions',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy {

  showFilter: boolean;
  amountFilter: string;
  amountFilterValue: number;
  dateFilter: string = 'all';
  categoryFilterValue: string = 'all';
  faq: Array<FAQ> = faq;
  
  filterData = (transaction: Transaction, filter: any): boolean => {
    let result = true;

    if (!transaction) {
      return result;
    }

    if (this.amountFilterValue && this.amountFilter) {
      switch (this.amountFilter) {
        case 'gt': {
          result = Math.abs(transaction.getAmount()) > this.amountFilterValue;
          break;
        }
        case 'lt': {
          result = Math.abs(transaction.getAmount()) < this.amountFilterValue;
          break;
        }
        case 'eq': {
          result = Math.abs(transaction.getAmount()) === this.amountFilterValue;
          break;
        }
        default: {
          result = true;
          break;
        }
      }
    }

    if (this.categoryFilterValue && result) {
      if (this.categoryFilterValue === 'all') {
        result = true;
      } else {
        result = transaction.category === this.categoryFilterValue;
      }
    }

    if (this.dateFilter && result) {
      const today = new Date();
      switch (this.dateFilter) {
        case 'week': {
          today.setDate(today.getDate() - 7);
          result = transaction.getDate() >= today;
          break;
        }
        case 'month': {
          today.setMonth(today.getMonth() - 1);
          result = transaction.getDate() >= today;
          break;
        }
        case 'threemo': {
          today.setMonth(today.getMonth() - 3);
          result = transaction.getDate() >= today;
          break;
        }
        case 'sixmo': {
          today.setMonth(today.getMonth() - 6);
          result = transaction.getDate() >= today;
          break;
        }
        default: {
          result = true;
          break;
        }
      }
    }

    return result;
  };
  private log: any = Log.create('main.component');
  private filterSubscription: Subscription;
  private destroyed: boolean;

  constructor(private modalsService: ModalsService,
              private filterService: FilterService
  ) {
  }

  ngOnInit() {
    this.filterSubscription = this.filterService.filterEvent
      .subscribe(value => {
        if (value === 'toggle') {
          this.toggleFilter();
        }
      });
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.destroyed = true;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  applyFilter() {
    this.filterService.apply();
  }

  setCategory(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0: {
        this.categoryFilterValue = 'all';
        break;
      }
      case 1: {
        this.categoryFilterValue = 'send';
        break;
      }
      case 2: {
        this.categoryFilterValue = 'receive';
        break;
      }
      case 3: {
        this.categoryFilterValue = 'transfer';
        break;
      }
      case 4: {
        this.categoryFilterValue = 'node';
        break;
      }
    }
    this.applyFilter();
  }
}
