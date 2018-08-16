import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from '../../transactions/filter.service';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss']
})
export class CustomHeaderComponent implements OnInit {
  @Input() navbar: any;
  @Input() heading: string;
  @Input() showFilters: boolean;

  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }
  toggleFilter() {
    this.filterService.toggle();
  }
}
