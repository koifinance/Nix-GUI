import { Component, OnInit } from '@angular/core';
import { FAQ } from '../shared/faq.model';
@Component({
  selector: 'app-multinodes',
  templateUrl: './multinodes.component.html',
  styleUrls: ['./multinodes.component.scss']
})
export class MultinodesComponent implements OnInit {

  transactionColumns: string[] = ['Name', 'Status', 'Active for'];
  constructor() { }

  ngOnInit() {
  }

}
