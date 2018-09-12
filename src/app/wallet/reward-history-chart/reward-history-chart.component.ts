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
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
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
