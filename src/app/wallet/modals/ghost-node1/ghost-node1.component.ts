import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ghost-node1',
  templateUrl: './ghost-node1.component.html',
  styleUrls: ['./ghost-node1.component.scss']
})
export class GhostNode1Component implements OnInit {
  data: any;

  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

  openEdit() {
    const data: any = {
      forceOpen: true,
      // actionType: 'send'
    };
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('editNode', data);
  }
  // openCancel() {
  //   // const data: any = {
  //   //   forceOpen: true,
  //   //   // walletType: walletType,
  //   //   // actionType: 'receive'
  //   // };
  //   this.data.modalsService.forceClose();
  //   this.data.modalsService.openSmall('cancelNode');
  // }
}
