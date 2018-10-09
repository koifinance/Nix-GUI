import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  GoToDownlod() {
    this.router.navigate(['./main/downloading-updates']);
  }

}
