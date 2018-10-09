import { Component, OnInit } from '@angular/core';
import { faBook, faAddressBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-withdraw-rewards',
  templateUrl: './withdraw-rewards.component.html',
  styleUrls: ['./withdraw-rewards.component.scss']
})
export class WithdrawRewardsComponent implements OnInit {
  data: any;
  faBook: any = faBook;
  faAddressBook: any = faAddressBook;
  constructor() {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
  }

}
