import { Component, OnInit } from '@angular/core';
import { FAQ } from '../shared/faq.model';
import { faq } from './faq';
import { ModalsService } from '../modals/modals.service';

@Component({
  selector: 'app-multinodes',
  templateUrl: './multinodes.component.html',
  styleUrls: ['./multinodes.component.scss']
})
export class MultinodesComponent implements OnInit {
  faq: Array<FAQ> = faq;
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

  

 

}
