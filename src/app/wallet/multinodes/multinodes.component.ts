import { Component, OnInit } from '@angular/core';
import { FAQ } from '../shared/faq.model';
import { ModalsService } from '../modals/modals.service';

@Component({
  selector: 'app-multinodes',
  templateUrl: './multinodes.component.html',
  styleUrls: ['./multinodes.component.scss']
})
export class MultinodesComponent implements OnInit {

  transactionColumns: string[] = ['Name', 'Status', 'Active for'];
  constructor(private modalsService: ModalsService) { }

  ngOnInit() {
  }

  openWithDraw() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openxSmall('withdrawRewards', data);
  }

  openViewNode() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('ghostNode1', data);
  }

  openCancel() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('cancelNode', data);
  }

}
