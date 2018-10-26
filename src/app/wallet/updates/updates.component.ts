import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints } from '../business-model/enums';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit {

  guiVersion: string = environment.version;
  destroyed: boolean = false;
  daemonVersion: string;

  constructor(private _rpcState: RpcStateService,private router: Router) { }

  ngOnInit() {
  	this._rpcState.observe(ApiEndpoints.GetNetworkInfo).takeWhile(() => !this.destroyed)
      .subscribe(networkInfo => {
        let w_version = networkInfo.version.toString();
        this.daemonVersion = w_version.slice(0, 1) + '.' + parseInt(w_version.slice(1, 3), 10) + '.' + parseInt(w_version.slice(3, 5), 10);
      }, error => {
        // this.log.d(error, 'err');
      }
    )
  }
  GoToDownlod() {
    this.router.navigate(['./main/downloading-updates']);
  }

  ngOnDestroy() {
    this.destroyed = true;   
  }
}
