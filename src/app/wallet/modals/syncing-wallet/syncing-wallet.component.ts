import { Component, OnInit } from '@angular/core';
import { RpcStateService } from '../../../core/core.module';
import { ApiEndpoints, message } from '../../business-model/enums';
import { Log } from 'ng2-logger';
import { IGetblockchaininfo, getblockchaininfo } from '../../business-model/entities';

@Component({
  selector: 'app-syncing-wallet',
  templateUrl: './syncing-wallet.component.html',
  styleUrls: ['./syncing-wallet.component.scss']
})
export class SyncingWalletComponent implements OnInit {

  data: any;
  private log: any = Log.create(`SyncingWallet.component `);
  private destroyed: boolean = false;
  blockchaininfo: IGetblockchaininfo = new getblockchaininfo();
  constructor(private _rpcState: RpcStateService) { }

  ngOnInit() {
    this.getblockchaininformation();
  }

  setData(data: any) {
    this.data = data;
  }

  //get block chain informations
  private getblockchaininformation() {
    this._rpcState.observe(ApiEndpoints.Getblockchaininfo)
      .takeWhile(() => !this.destroyed)
      .subscribe(blockchaininfo => {
        this.blockchaininfo = new getblockchaininfo(blockchaininfo).toJSON();
      },
        error => this.log.error(message.walletMessage, error));
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
