import { Component, OnInit } from '@angular/core';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-reward-history-chart',
  templateUrl: './reward-history-chart.component.html',
  styleUrls: ['./reward-history-chart.component.scss']
})
export class RewardHistoryChartComponent implements OnInit {
  faListUl: any = faListUl;
  panelColor = new FormControl('red');

  constructor() {
   }

  ngOnInit() {

  }

}
