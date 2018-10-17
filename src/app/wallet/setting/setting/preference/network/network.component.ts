import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { WalletService } from '../../../../wallet.service';
import { SnackbarService } from '../../../../../core/core.module';
import { Log } from 'ng2-logger';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  private destroyed: boolean = false;
  private log: any = Log.create(`network.component `);
  public torEnabled: boolean;

  constructor(
  	private walletServices: WalletService,
    private flashNotification: SnackbarService
  ) { }

  ngOnInit() {
  	this.getTorstatus();
  }


  // get tor status
  private getTorstatus() {
    this.walletServices.getTorstatus()
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.torEnabled = (res.indexOf("Enabled") > -1);
      }, error => { 
        this.flashNotification.open(error.message, 'err')
        this.log.error(error.message, error); 
    })
  }

  // Enable/disable tor status
  private torToggled(event: MatSlideToggleChange) {
    this.walletServices.enableTor(event.checked ? 'true' : 'false')
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        this.flashNotification.open(res, 'err')
      }, error => { 
        this.flashNotification.open(error.message, 'err')
        this.log.error(error.message, error); 
    })
    
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
