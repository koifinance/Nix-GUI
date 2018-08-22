import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-syncing-wallet',
  templateUrl: './syncing-wallet.component.html',
  styleUrls: ['./syncing-wallet.component.scss']
})
export class SyncingWalletComponent implements OnInit {

  data: any;
  constructor() { }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }


}
