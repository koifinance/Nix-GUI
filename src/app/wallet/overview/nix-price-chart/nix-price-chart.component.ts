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
  public bitcoinEURprice:any;
  isPlusPercent: boolean;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  private log: any = Log.create(`NixPriceChart.component `);

  data: any;
  Message: any[];

  // lineChart
  public lineChartData: Array<any> = [
    // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    // {data: [40, 19, 86, 27, 90], label: 'Series B'},
    { data: [0,0.2,0.25,0.6, 0.3, 0.34, 0.29, 0.26], label: 'NIX'}
  ];
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
  public currentCurrency: string;
  public currencySign: string;

  constructor(
    private router: Router,
    private walletServices: WalletService,) { }

  ngOnInit() {
    this.currentCurrency = this.walletServices.getCurrency();
    this.currencySign = this.currentCurrency == 'USD' ? '$' : '€';
    this.getBitcoinpriceinfo();
    this.getNIXChartData();
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  // get chart history of nix
  public getNIXChartData() {
    this.walletServices.getHistoricalData('vs_currency=usd&days=365').subscribe(res => {
      let label = [''];
      let price = [0];
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct', 'Nov', 'Dec'];
      res = JSON.parse(res.text());
      res.prices.map(t => {
        let date = new Date(t[0]);
        if (date.getDate() == 1) {
          label.push(monthName[date.getMonth()]);
          price.push(t[1]);
        } else {
          label.push('');
          price.push(t[1]);
        }
      });
      this.log.d(label, price)
      this.lineChartData[0].data = price;
      this.lineChartLabels.length = 0;
      this.lineChartLabels = label;
    })
  }


  goToMain() {
      this.router.navigate(['./main/overview']);
  }

  // fetch bitcoin price
  private getBitcoinpriceinfo() {
    this.walletServices.getInEUR(this.bitcoinpriceInfo)
      .subscribe(bitcoinpriceInfos => {
        this.bitcoinprice = bitcoinpriceInfos.data.quotes;
        this.isPlusPercent = (this.bitcoinprice.USD.percent_change_24h >= 0);
      },error => this.log.error(message.bitcoinpriceMessage, error));
  }

  // fetch NIX historical data
  private getHistoricalData() {
    this.walletServices.getHistoricalData(this.getTodayDate()).subscribe(res => {
    }, err => this.log.error(message.bitcoinpriceMessage, err))    
  }

  private getTodayDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    return yyyy.toString() + (mm < 10 ? '0' + mm.toString() : mm.toString()) + (dd < 10 ? '0' + dd.toString() : dd.toString());
  }
}
