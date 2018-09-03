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
  constructor(private router: Router,private walletServices: WalletService,) { }

  ngOnInit() {
    this.getBitcoinpriceinfo()
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
