import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from '../../transactions/filter.service';

@Component({
  selector: 'page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() navbar: any;
  @Input() heading: string;
  @Input() showFilters: boolean;

  constructor(private filterService: FilterService) {
  }

  ngOnInit() {
  }

  toggleFilter() {
    this.filterService.toggle();
  }

}
