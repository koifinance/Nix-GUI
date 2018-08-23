import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ghost-node1',
  templateUrl: './ghost-node1.component.html',
  styleUrls: ['./ghost-node1.component.scss']
})
export class GhostNode1Component implements OnInit {
  data: any;

  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }


}
