import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowUp, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nix-price-chart',
  templateUrl: './nix-price-chart.component.html',
  styleUrls: ['./nix-price-chart.component.scss']
})
export class NixPriceChartComponent implements OnInit {
  panelColor = new FormControl('usd');
  faCaretUp: any = faCaretUp;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToMain() {
      this.router.navigate(['./main/overview']);
  }
}
