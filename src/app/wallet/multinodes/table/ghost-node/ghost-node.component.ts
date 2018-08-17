import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ghost-node',
  templateUrl: './ghost-node.component.html',
  styleUrls: ['./ghost-node.component.scss']
})
export class GhostNodeComponent implements OnInit {
  displayedColumns = ["Name", "Status", "Active for"];
  
  constructor() { }

  ngOnInit() {
  }

}
