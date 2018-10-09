import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cancel-node',
  templateUrl: './cancel-node.component.html',
  styleUrls: ['./cancel-node.component.scss']
})
export class CancelNodeComponent implements OnInit {
  data: any;
  stopNode = new FormControl('1');
  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

}
