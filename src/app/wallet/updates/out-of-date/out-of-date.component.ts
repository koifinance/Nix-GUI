import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-out-of-date',
  templateUrl: './out-of-date.component.html',
  styleUrls: ['./out-of-date.component.scss']
})
export class OutOfDateComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  GoToDownlod() {
    this.router.navigate(['./main/downloading-updates']);
  }
}
