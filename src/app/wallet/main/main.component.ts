import { Component, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

@Component({
  selector: 'wallet-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  private log: any = Log.create('main.component');

  constructor() {
  }

  ngOnInit() {
  }
}
