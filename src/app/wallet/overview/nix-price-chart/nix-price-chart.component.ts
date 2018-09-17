import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowUp, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { WalletService } from '../../wallet.service';
import { IBitcoinprice, bitcoinprice } from '../../business-model/entities';
import { message } from '../../business-model/enums';
import { Log } from 'ng2-logger';


@Component({
  selector: 'app-nix-price-chart',
  templateUrl: './nix-price-chart.component.html',
  styleUrls: ['./nix-price-chart.component.scss']
})
export class NixPriceChartComponent implements OnInit {
  panelColor = new FormControl('usd');
  faCaretUp: any = faCaretUp;
  public bitcoinprice:any;
  bitcoinpriceInfo: IBitcoinprice = new bitcoinprice();
  private log: any = Log.create(`NixPriceChart.component `);

  data: any;
  Message: any[];

  // lineChart
  public lineChartData: Array<any> = [
    // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    // {data: [40, 19, 86, 27, 90], label: 'Series B'},
    { data: [2,2.5,4,3.6, 5.5, 4.8, 7, 5],label: 'Bitcoin'}
  ];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug'];
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

  constructor(private router: Router,private walletServices: WalletService,) {
  
   }

  ngOnInit() {
    this.getBitcoinpriceinfo();   
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }


  goToMain() {
      this.router.navigate(['./main/overview']);
  }

   // fetch bitcoin price
   private getBitcoinpriceinfo() {
    this.walletServices.getBitcoin(this.bitcoinpriceInfo)
    .subscribe(bitcoinpriceInfos => {
      this.bitcoinprice = bitcoinpriceInfos.data.quotes;
    },
        error => this.log.error(message.bitcoinpriceMessage, error));
  }
}
