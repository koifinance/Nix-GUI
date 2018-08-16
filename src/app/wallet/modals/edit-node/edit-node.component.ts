import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.scss']
})
export class EditNodeComponent implements OnInit {
  data: any;

  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

  // openSuccess(walletType: string) {
  //   const data: any = {
  //     forceOpen: true,
  //     walletType: walletType,
  //     actionType: 'editNode'
  //   };
  //   this.data.modalsService.forceClose();
  // }

}
