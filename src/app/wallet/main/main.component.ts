import { Component, OnInit, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints } from '../business-model/enums';
import { RpcService } from '../../core/rpc/rpc.service';
import { ModalsService } from '../modals/modals.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'wallet-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  private log: any = Log.create('main.component');
  public version: string = environment.version;
  routerLink: string;
 
  destroyed: boolean = false;
  syncProgress: number;

  constructor(private modalsService: ModalsService, private _rpcState: RpcStateService, private _rpc: RpcService) {
  }

  ngOnInit() {
    this.routerLink = '';
    this._rpcState.observe(ApiEndpoints.Getblockchaininfo).takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.syncProgress = Math.floor(res.verificationprogress * 100);
    });
  }

  openSyncingWallet() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('syncingWallet', data);
  }

  ngOnDestroy() {
    this.destroyed = true;   
  }
}
