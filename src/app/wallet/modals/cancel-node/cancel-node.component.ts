import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel-node',
  templateUrl: './cancel-node.component.html',
  styleUrls: ['./cancel-node.component.scss']
})
export class CancelNodeComponent implements OnInit {
  data: any;

  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

}
