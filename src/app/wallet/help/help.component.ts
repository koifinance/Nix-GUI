import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../modals/modals.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(
        private modalsService: ModalsService) {
  }

  ngOnInit() {
  }
}
