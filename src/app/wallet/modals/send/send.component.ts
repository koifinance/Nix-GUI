import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../wallet.service';
import { RpcStateService } from '../../../core/core.module';
import { WalletSendToNix, IWalletSendToNix } from '../../business-model/entities';
import { Log } from 'ng2-logger';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  // providers: [ModalsService]
})
export class SendComponent implements OnInit {

  data: any;
  private log: any = Log.create(`send to nix `);
  sendToNix: IWalletSendToNix = new WalletSendToNix();
  constructor(
    private walletServices: WalletService,
    private _rpcState: RpcStateService
  ) {

  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

  sendData() {
     var result = this.walletServices.SendToNix(this.sendToNix).subscribe(res => {  
      this.openSuccess('wallet');
    }, error => this.log.error('Failed to get balance, ', error));
    
  }

  openSuccess(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      actionType: 'send'
    };
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('success', data);
  }
}
