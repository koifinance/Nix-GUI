import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  data: any;

  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

}
