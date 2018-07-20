import { Component, OnInit } from '@angular/core';

// import { ModalsService } from '../modals.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {

  data: any;

  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

  openSuccess(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      actionType: 'receive'
    };
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('success', data);
  }
}
