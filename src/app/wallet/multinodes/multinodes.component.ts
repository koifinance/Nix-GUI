import { Component, OnInit } from '@angular/core';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { ModalsService } from '../modals/modals.service';
import { WalletService } from '../wallet.service';
import { Log } from 'ng2-logger';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints } from '../business-model/enums';
import { WalletInfo, IWalletInfo } from '../business-model/entities';
@Component({
  selector: 'app-multinodes',
  templateUrl: './multinodes.component.html',
  styleUrls: ['./multinodes.component.scss']
})
export class MultinodesComponent implements OnInit {
  faq: Array<FAQ> = faq;
  private destroyed: boolean = false;
  transactionColumns: string[] = ['Name', 'Status', 'Active for'];
  private log: any = Log.create('Multinodes.component');
  walletInfo: IWalletInfo = new WalletInfo();
  constructor(private modalsService: ModalsService, private walletServices: WalletService,private _rpcState: RpcStateService) { }

  ngOnInit() {
    this.getBalance();
    this.getwalletinformation();
  }

 //get wallet informations
 private getwalletinformation() {
  this._rpcState.observe(ApiEndpoints.GetWalletInfo)
    .takeWhile(() => !this.destroyed)
    .subscribe(walletInfo => {
      this.walletInfo = new WalletInfo(walletInfo).toJSON();
    },
      error => this.log.error('Failed to get wallet information, ', error));
}

  // get balance
  private getBalance() {
    this.walletServices.getBalanceAmount()
      .subscribe(res => {
        console.log(res)
      },
      error => this.log.error('Failed to get balance, ', error));
  }

  openWithDraw() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openxSmall('withdrawRewards', data);
  }

  
  ngOnDestroy() {
    this.destroyed = true;
  }
 

}
