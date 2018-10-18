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
  estimatedTime: String = '';
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
        let s: number = (1 - blockchaininfo.verificationprogress) * 100000;
        let h: number = Math.floor(s / 3600);
        let m = Math.round(s % 3600 / 60);
        if (h == 0 && m == 0) {
          this.estimatedTime = "few seconds";
          return;
        }

        let hDisplay = h >= 0 ? h + (h == 1 ? " Hour and " : " Hours and ") : "";
        let mDisplay = m >= 0 ? m + (m == 1 ? " Minute" : " Minutes") : "";
        this.estimatedTime = hDisplay + mDisplay; 
      },
        error => this.log.error(message.walletMessage, error));
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
