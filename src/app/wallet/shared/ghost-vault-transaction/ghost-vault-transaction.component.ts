import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Log } from 'ng2-logger';

import { IRecentTransactionInfo, RecentTransactionInfo } from '../../business-model/entities';
import { RpcStateService, RpcService } from '../../../core/core.module';
import { ApiEndpoints, categories, message } from '../../business-model/enums';
import { ModalsService } from '../../modals/modals.service';
import { faArrowDown, faArrowUp, faCircle as faCircleSolid, faDollarSign, faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ghost-vault-transaction',
  templateUrl: './ghost-vault-transaction.component.html',
  styleUrls: ['./ghost-vault-transaction.component.scss']
})
export class GhostVaultTransactionComponent implements OnInit, OnDestroy {
  @Input() display: any;

  dataSource: MatTableDataSource<IRecentTransactionInfo>;
  private walletInfo: any = {};
  private destroyed: boolean;
  private defaults: any = {
    header: true,
    numTransactions: 100,
    columns: ['Type', 'Amount', 'Address', 'Status', 'Date'],
    longDate: false,
    styleClass: '',
  };
  faCircleSolid: any = faCircleSolid;
  faCircle: any = faCircle;
  private log: any = Log.create('ghost-vault-transaction.component');

  constructor(
    private modalService: ModalsService,
    private _rpcState: RpcStateService,
    private _rpc: RpcService
  ) {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(response => {

        if (JSON.stringify(response) !== JSON.stringify(this.walletInfo)) {
          this.walletInfo = response;
          this._rpc.call(ApiEndpoints.ListTransactions, ['*', 100])
            .subscribe(recentTransInfo => {
              let res = recentTransInfo.filter(item => {
                if (item.is_ghosted) return true;
              });
              
              res = res.sort((a, b) => {return b.time - a.time});
              this.dataSource.data = res;
            },
              error => this.log.error(message.recentTransactionMessage, error));
        }
      }, err => this.log.error(message.walletMessage, err));
  }

  ngOnInit() {
    this.destroyed = false;
    this.dataSource = new MatTableDataSource<IRecentTransactionInfo>();
    this.dataSource.data = null;
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
  
  ngOnDestroy(): void {
    this.destroyed = true;
  }
}
