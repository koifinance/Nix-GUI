import { Component } from '@angular/core';
import { Log } from 'ng2-logger';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircle as faCircleSolid, faQuestion, faSync } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  log: any = Log.create('overview.component');

  faCircle: any = faCircle;
  faQuestion: any = faQuestion;
  faSync: any = faSync;
  faCircleSolid: any = faCircleSolid;

  constructor() {
  }
}
