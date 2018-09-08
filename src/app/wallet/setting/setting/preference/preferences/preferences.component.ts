import { Component, OnInit } from '@angular/core';
import { ISavecurrency, Savecurrency } from '../../../../business-model/entities';
import { Log } from 'ng2-logger';
import { RpcStateService, SnackbarService } from '../../../../../core/core.module';
import { ApiEndpoints, message } from '../../../../business-model/enums';
import { FormControl } from '@angular/forms';
import { WalletService } from '../../../../wallet.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  savecurrency: ISavecurrency = new Savecurrency();
  private log: any = Log.create(`receive to nix `);
  private destroyed: boolean = false;
  Currency = new FormControl('EUR');
  public currencies = [
    'United States Dollar (USD)',
    'EURO (EUR)'
  ];
  constructor(private _rpcState: RpcStateService, private flashNotification: SnackbarService,
    private walletServices: WalletService) { }

  ngOnInit() {
    this._rpcState.registerStateCall(ApiEndpoints.GetPriceinfo, 1000);
  }

  // to get currency
  public getPriceInfo() {
    this._rpcState.observe(ApiEndpoints.GetPriceinfo).takeWhile(() => !this.destroyed)
    .subscribe(getCurrency => {
      this.currencies = getCurrency;
    })
  }
   // to save currency
   public save() {
    var result = this.walletServices.saveCurrency(this.savecurrency).subscribe(res => {
    },
    error => {
     this.flashNotification.open(message.SaveCurrencyMessage, 'err')
     this.log.er(message.SaveCurrencyMessage, error)
   });
  
 }
}
