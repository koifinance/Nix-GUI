import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowUp, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { WalletService } from '../../wallet.service';
import { IBitcoinprice, bitcoinprice } from '../../business-model/entities';
import { message } from '../../business-model/enums';
import { Log } from 'ng2-logger';
// import { JSSoup } from 'jssoup';


@Component({
  selector: 'app-nix-price-chart',
  templateUrl: './nix-price-chart.component.html',
  styleUrls: ['./nix-price-chart.component.scss']
})
export class NixPriceChartComponent implements OnInit {
  panelColor = new FormControl('usd');
  faCaretUp: any = faCaretUp;
  faCaretDown: any = faCaretDown;
  public bitcoinprice:any;
  isPlusPercent: boolean;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  private log: any = Log.create(`NixPriceChart.component `);

  data: any;
  Message: any[];

  // lineChart
  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'NIX'}
  ];
  public chart_currency: string = 'usd';
  public chart_days: number = 365;
  public marketData: any = {};
  public lineChartLabels: Array<any> = ['Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  constructor(
    private router: Router,
    private walletServices: WalletService,) { }

  ngOnInit() {
    this.getBitcoinpriceInfo();
    this.getNIXChartData('usd', 365);
    this.getMarketInfo('usd');
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  public setDuration(day: number) {
    this.chart_days = day;
    this.getNIXChartData(this.chart_currency, day);
  }

  // get market data
  public getMarketInfo(curency) {
    this.walletServices.getMarketData(curency, 'nix-platform').subscribe(res => {
      res = JSON.parse(res.text());
      this.marketData = res[0];
      this.log.d(this.marketData, res);
    })
  }

  // get chart history of nix
  public getNIXChartData(curency, days) {
    this.walletServices.getHistoricalData(curency, days).subscribe(res => {
      let label = [];
      let price = [];
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct', 'Nov', 'Dec'];
      res = JSON.parse(res.text());
      this.log.d(res);
      res.prices.map(t => {
        let date = new Date(t[0]);
        if (date.getDate() == 1 && monthName[date.getMonth()] !== label[label.length - 1] && date.getDate().toString() !== label[label.length - 1]) {
          label.push(monthName[date.getMonth()]);
          price.push(t[1]);
        } else if (days > 31 && date.getDay() == 0 && date.getDate().toString() !== label[label.length - 1] && (monthName[date.getMonth()] !== label[label.length - 1] || label[label.length - 1] != '')){
          label.push(date.getDate().toString());
          price.push(t[1]);
        } else if (days <= 31 && date.getDate().toString() !== label[label.length - 1] ){
          label.push(date.getDate().toString());
          price.push(t[1]);
        }
      });
      this.log.d(label, price);
      this.log.d(days, res.prices);
      this.lineChartData[0].data = price;
      this.lineChartLabels.length = 0;
      this.lineChartLabels = label;
    })
  }

  // currency change
  public onCurrencyChange() {
    this.getNIXChartData(this.chart_currency, this.chart_days);
    this.getMarketInfo(this.chart_currency);
  }

  goToMain() {
      this.router.navigate(['./main/overview']);
  }

  // fetch bitcoin price
  private getBitcoinpriceInfo() {
    this.walletServices.getInEUR(this.bitcoinpriceInfo)
    .subscribe(bitcoinpriceInfos => {
      this.bitcoinprice = bitcoinpriceInfos.data.quotes;
      this.isPlusPercent = (this.bitcoinprice.USD.percent_change_24h >= 0);
    },
        error => this.log.error(message.bitcoinpriceMessage, error));
  }

  private getTodayDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    return yyyy.toString() + (mm < 10 ? '0' + mm.toString() : mm.toString()) + (dd < 10 ? '0' + dd.toString() : dd.toString());
  }
}
