import { Component, OnInit } from '@angular/core';
import { faListUl, faBook } from '@fortawesome/free-solid-svg-icons';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-reward-history-chart',
  templateUrl: './reward-history-chart.component.html',
  styleUrls: ['./reward-history-chart.component.scss']
})
export class RewardHistoryChartComponent implements OnInit {
  faListUl: any = faListUl;
  faBook: any = faBook;
  panelColor = new FormControl('red');

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Jan 17', 'Feb 17', 'Mar 17', 'Apr 17', 'May 17', 'Jun 17', 'Jul 17'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [0, 0, 40, 19, 84, 27, 90], label: 'Bitcoin'}
  ];

  constructor() {
   }

  ngOnInit() {

  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
