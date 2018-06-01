import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Log } from 'ng2-logger';

import { Price } from './price.model';

@Injectable()
export class PriceService implements OnDestroy {

  log: any = Log.create('price.service id:' + Math.floor((Math.random() * 1000) + 1));

  // https://graphs2.coinmarketcap.com/currencies/zoin/ [options: fromIndex/toIndex]
  liveDataPolling: any;
  price: Price;
  loading: boolean = true;
  private livePriceUri: string = 'https://api.coinmarketcap.com/v2/ticker/1448/?convert=BTC'; // Zoi

  constructor(private http: HttpClient) {
  }

  ngOnDestroy(): void {
    this.liveDataPolling.unsubscribe();
  }

  postConstructor(): void {
    this.getLivePrice();
  }

  getLivePrice(): void {
    this.liveDataPolling = Observable.interval(10000).startWith(0)
      .switchMap(() => this.http.get(this.livePriceUri))
      .map((data: any) => data.data)
      .subscribe((data: any) => {
        this.price = new Price(data);
        this.loading = false;
        this.log.info(`market price updated to ${this.price.price}`);
      });
  }
}
