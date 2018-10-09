import { Component, OnInit, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints } from '../business-model/enums';
import { RpcService } from '../../core/rpc/rpc.service';

@Component({
  selector: 'wallet-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {


  private log: any = Log.create('main.component');
  routerLink: string;
 
  destroyed: boolean = false;
  syncProgress: number = 0;
  walletVersion: string;
  constructor(private _rpcState: RpcStateService, private _rpc: RpcService) {
  }

  ngOnInit() {
    this.routerLink = '';
    // this._rpcState.registerStateCall(ApiEndpoints.Getblockchaininfo, 1000);

    this._rpcState.observe(ApiEndpoints.Getblockchaininfo).takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.syncProgress = Math.floor(res.verificationprogress * 100);
    });

    this._rpcState.observe(ApiEndpoints.GetNetworkInfo).takeWhile(() => !this.destroyed)
      .subscribe(networkInfo => {
        let w_version = networkInfo.version.toString();
        this.walletVersion = w_version.slice(0, 1) + '.' + parseInt(w_version.slice(1, 3), 10) + '.' + parseInt(w_version.slice(3, 5), 10);
      }, error => {
        this.log.d(error, 'err');
      }
    )

  }

  ngOnDestroy() {
    this.destroyed = true;   
  }
}
