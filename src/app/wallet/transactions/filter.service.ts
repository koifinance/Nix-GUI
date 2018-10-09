import { Injectable, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilterService implements OnDestroy {

  filterEvent: Subject<any> = new Subject<any>();
  private log: any = Log.create('filter.service');
  private destroyed: boolean;

  constructor() {
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  toggle() {
    this.filterEvent.next('toggle');
  }

  apply() {
    this.filterEvent.next('apply');
  }
}
