import { Component, OnInit } from '@angular/core';

import { faq } from './faq';
import { FAQ } from '../shared/faq.model';

@Component({
  selector: 'wallet-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodesComponent implements OnInit {

  faq: Array<FAQ> = faq;

  constructor() {
  }

  ngOnInit() {
  }

}
