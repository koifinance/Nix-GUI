import { Component, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { PriceService } from '../../../shared/price.service';

@Component({
  selector: 'price-chart',
  templateUrl: './price-chart.component.html',
  providers: [PriceService],
})
export class PriceChartComponent implements OnInit {

  log: any = Log.create('chart.component');

  constructor(public priceService: PriceService) {
  }

  ngOnInit(): void {
    this.priceService.postConstructor();
  }
}
