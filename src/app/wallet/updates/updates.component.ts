import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RpcStateService } from '../../core/core.module';
import { ApiEndpoints } from '../business-model/enums';
import { environment } from '../../../environments/environment';
import { WalletService } from '../wallet.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit {

  guiVersion: string = environment.version;
  destroyed: boolean = false;
  daemonVersion: string;
  updated: boolean = true;
  faTimesCircle: any = faTimesCircle;

  constructor(
    private _rpcState: RpcStateService,
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit() {
  	this._rpcState.observe(ApiEndpoints.GetNetworkInfo).takeWhile(() => !this.destroyed)
      .subscribe(networkInfo => {
        let w_version = networkInfo.version.toString();
        this.daemonVersion = w_version.slice(0, 1) + '.' + parseInt(w_version.slice(1, 3), 10) + '.' + parseInt(w_version.slice(3, 5), 10);
      }, error => {
        // this.log.d(error, 'err');
      }
    )

    this.walletService.getGUIVersion().subscribe(res => {
      let splitted = res.url.split('/');
      let version = splitted[splitted.length - 1];
      if (version.charAt(0) == 'v') version = version.substr(1);
      console.log(version, this.guiVersion);
      if (version.localeCompare(this.guiVersion) == 1) {
        this.updated = false;
      }
    })
  }
  GoToDownlod() {
    this.router.navigate(['./main/downloading-updates']);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
