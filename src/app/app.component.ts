import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material'; // TODO: move to material module?
import { Router } from '@angular/router';
import { Log } from 'ng2-logger';

import { RpcStateService } from './core/core.module';
import { ApiEndpoints, message } from './wallet/business-model/enums';
import { IWalletInfo, WalletInfo} from './wallet/business-model/entities';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  private log: any = Log.create('app.component');
  private destroyed: boolean = false;
  private walletInfo: IWalletInfo = new WalletInfo();

  // multiwallet: any = [];

  constructor(
    private router: Router,
    private _iconRegistry: MatIconRegistry,
    private _rpcState: RpcStateService
  ) {
    _iconRegistry
      .registerFontClassAlias('partIcon', 'part-icon')
      .registerFontClassAlias('faIcon', 'fa');
  }

  ngOnInit() {
    this._rpcState.observe(ApiEndpoints.GetWalletInfo)
      .subscribe(walletInfo => {
        this.walletInfo = new WalletInfo(walletInfo).toJSON();
        if (this.walletInfo.encryptionstatus === 'Unencrypted') {
          this.router.navigate([`/create`]);
        }
      }, error => this.log.er(message.walletMessage, error));    
  }
}
