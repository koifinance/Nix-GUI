import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  data: any;
  constructor() { }

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
