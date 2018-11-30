import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RpcService } from '../../../core/core.module';
import { Log } from 'ng2-logger';

@Component({
  selector: 'app-ghostnode-info-input',
  templateUrl: './ghostnode-info-input.component.html',
  styleUrls: ['./ghostnode-info-input.component.scss']
})
export class GhostnodeInfoInputComponent implements OnInit {

  ghostnodeInfo: any;
  private log: any = Log.create('ghostnode-info-input.component');

  constructor(
    public _dialogRef: MatDialogRef<GhostnodeInfoInputComponent>,
    private _rpc: RpcService
  ) { }

  ngOnInit() {
    this.ghostnodeInfo = {
      ip_address: '',
      password: '',
      ghostnode_key: '',
      aliasName: '',
      transactionHash: '',
      transactionOutput: ''
    }
  }

  close(): void {
    this._dialogRef.close();
  }

  isValid() {
    if (this.ghostnodeInfo.ip_address == '' || this.ghostnodeInfo.ip_address == null)       return false;
    if (this.ghostnodeInfo.password == '' || this.ghostnodeInfo.password == null)           return false;
    if (this.ghostnodeInfo.ghostnode_key == '' || this.ghostnodeInfo.ghostnode_key == null) return false;
    return true;  
  }

  start(): void {
    if (this.isValid()) {
      this.log.d(this.ghostnodeInfo);
      this._rpc.call('setup-new-ghostnode', [
        this.ghostnodeInfo.ip_address,
        this.ghostnodeInfo.password,
        this.ghostnodeInfo.ghostnode_key,
        this.ghostnodeInfo.aliasName,
        this.ghostnodeInfo.transactionHash,
        this.ghostnodeInfo.transactionOutput]).subscribe(res => {
      }, err => {});
      this.close();
    }
  }

}
