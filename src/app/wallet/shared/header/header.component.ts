import { Component, Input, OnInit } from '@angular/core';
import { Ng2CsvService } from 'ng2csv';
import { Log } from 'ng2-logger';

import { FilterService } from '../../transactions/filter.service';
import { RpcService } from '../../../core/rpc/rpc.service';
import { ApiEndpoints, message } from '../../business-model/enums';

@Component({
  selector: 'page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() navbar: any;
  @Input() overview: any;
  @Input() heading: string;
  @Input() showFilters: boolean;

  private log: any = Log.create(`header.component`);

  constructor(
    private filterService: FilterService,
    private ng2Csv: Ng2CsvService,
    private _rpc: RpcService
  ) {
  }

  ngOnInit() {
  }

  toggleFilter() {
    this.filterService.toggle();
  }

  downloadHistory() {
    this._rpc.call(ApiEndpoints.ListTransactions).subscribe(res => {
      let data = [];
      data = res.map(a => {
        let date = new Date(a.time * 1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        let yyyy = date.getFullYear();
        let mm = "0" + date.getMonth();
        let dd = "0" + date.getDay();

        return {
                Date: dd.substr(-2) + '/' + mm.substr(-2) + '/' + yyyy + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2),
                Category: a.category,
                Confirmations: a.confirmations,
                Amount: a.amount
              }
      });
      this.ng2Csv.download(data, 'filename.csv');
    }, error => {
      this.log.d(message.ListTransactions, error);
    })
  }

}
