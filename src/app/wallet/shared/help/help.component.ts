import { Component, Input, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { FAQ } from '../faq.model';

@Component({
  selector: 'help-bar',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  @Input() navbar: any;
  @Input() faq: Array<FAQ>;

  faTimes: any = faTimes;

  toggledAnswerIndex: number = -1;

  constructor() {
  }

  ngOnInit() {
  }

  toggleAnswer(index: number) {
    if (index === this.toggledAnswerIndex) {
      this.toggledAnswerIndex = -1;
      return;
    }
    this.toggledAnswerIndex = index;
  }
}
