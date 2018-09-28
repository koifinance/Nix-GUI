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
    {currency: 'USD', label: 'United States Dollar (USD)'},
    {currency: 'EUR', label: 'EURO (EUR)'}
  ];
  constructor(private _rpcState: RpcStateService, private flashNotification: SnackbarService,
    private walletServices: WalletService) { }

  ngOnInit() {
    let currency = this.walletServices.getCurrency();

    if (currency) {
      this.savecurrency.convert = currency;
    } else {
      this.savecurrency.convert = this.currencies[0].currency;
    }
  }

  // to save currency
  public save() {
    this.walletServices.saveCurrency(this.savecurrency);
  }
}
