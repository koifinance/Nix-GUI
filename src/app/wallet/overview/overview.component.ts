import {Component} from '@angular/core';
import {Log} from 'ng2-logger';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  log: any = Log.create('over-view.component');
  users: Array<any> = [
    {id: 1, name: 'Luke'},
    {id: 2, name: 'Darth'},
  ];
  selectedUser: any;
  userId: number;

  constructor() {
    this.default();
  }

  default(): void {
    this.userId = this.users[0].id;
    this.switchUser();
  }

  switchUser(): void {
    this.selectedUser = this.users.find(user => user.id === this.userId);
    // this.log.info(this.selectedUser);
  }
}
