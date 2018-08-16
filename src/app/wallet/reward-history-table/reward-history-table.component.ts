import { Component, OnInit } from '@angular/core';
// import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subscription } from 'rxjs/Subscription';
import { MatTabChangeEvent } from '@angular/material';
import { faListUl, faFilter, faDownload } from '@fortawesome/free-solid-svg-icons';


import { ModalsService } from '../modals/modals.service';
import { Transaction } from '../shared/transaction/transaction.model';
import {FormControl} from '@angular/forms';
import { FAQ } from '../shared/faq.model';



@Component({
  selector: 'app-reward-history-table',
  templateUrl: './reward-history-table.component.html',
  styleUrls: ['./reward-history-table.component.scss']
})
export class RewardHistoryTableComponent implements OnInit {
  faListUl: any = faListUl;
  faFilter: any = faFilter;
  faDownload: any = faDownload;

  panelColor = new FormControl('red');

  constructor(private modalsService: ModalsService) { }

  ngOnInit() {

 
  }

}
