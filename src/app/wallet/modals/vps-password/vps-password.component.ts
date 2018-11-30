import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RpcService } from '../../../core/core.module';
import { Log } from 'ng2-logger';

@Component({
  selector: 'app-vps-password',
  templateUrl: './vps-password.component.html',
  styleUrls: ['./vps-password.component.scss']
})
export class VpsPasswordComponent implements OnInit {

  data: any;
  password: string;
  private log: any = Log.create('vps-password.component');

  constructor(
    public _dialogRef: MatDialogRef<VpsPasswordComponent>,
    private _rpc: RpcService
  ) { }

  ngOnInit() {
    this.password = '';
  }

  setData(data: any) {
    this.data = data;
  }

  close(): void {
    this._dialogRef.close();
  }

  isValid() {
    if (this.password == '' || this.password == null)           return false;
    return true;  
  }

  start(): void {
    this.log.d(this.data.rpcCommand, this.data.address, this.password);
    if (this.isValid()) {
      this._rpc.call(this.data.rpcCommand, [this.data.address.split(':')[0], this.password, this.data.aliasName]).subscribe(res => {
      }, err => {});
      this.close();
    }
  }

}
