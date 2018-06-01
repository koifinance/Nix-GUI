import { Component, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { faBtc } from '@fortawesome/free-brands-svg-icons';

import { PriceService } from '../../../shared/price.service';

@Component({
  selector: 'price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss'],
  providers: [PriceService],
})
export class PriceChartComponent implements OnInit {

  log: any = Log.create('chart.component');
  faBtc: any = faBtc;

  constructor(public priceService: PriceService) {
  }

  ngOnInit(): void {
    this.priceService.postConstructor();
  }

  getBTCDailyChange(): string {
    let changeStr: string = this.priceService.price.btcDailyChange.toString();
    if (this.priceService.price.btcDailyChange > 0) {
      changeStr = '+' + changeStr;
    }
    return changeStr + '%';
  }
}
