import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RpcService } from '../../../core/core.module';
import { Log } from 'ng2-logger';
import { WalletService } from '../../wallet.service';

@Component({
  selector: 'app-ghostnode-info-input',
  templateUrl: './ghostnode-info-input.component.html',
  styleUrls: ['./ghostnode-info-input.component.scss']
})
export class GhostnodeInfoInputComponent implements OnInit {

  ghostnodeInfo: any;
  ghostnodeOutput: any;
  private log: any = Log.create('ghostnode-info-input.component');

  constructor(
    public _dialogRef: MatDialogRef<GhostnodeInfoInputComponent>,
    private _rpc: RpcService,
    private _walletService: WalletService
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

    this._walletService.ghostnodeOutputs().subscribe(res => {
      this.ghostnodeOutput = res;
    }, error => {
    })
  }

  close(): void {
    this._dialogRef.close();
  }

  isValid() {
    if (this.ghostnodeInfo.ip_address == '' || this.ghostnodeInfo.ip_address == null)       return false;
    if (this.ghostnodeInfo.password == '' || this.ghostnodeInfo.password == null)           return false;
    if (this.ghostnodeInfo.transactionHash == '' || this.ghostnodeInfo.transactionHash == null) return false;
    return true;  
  }

  objectKeys(obj) {
    if (obj == undefined || obj == null) return {}
    return Object.keys(obj)
  }

  start(): void {
    if (this.isValid()) {
      this._walletService.ghostnodeKey().subscribe(res => {
        this.ghostnodeInfo.ghostnode_key = res;
        this.ghostnodeInfo.transactionOutput = this.ghostnodeOutput[this.ghostnodeInfo.transactionHash];
        console.log(this.ghostnodeInfo, '========');
        this._rpc.call('setup-new-ghostnode', [
          this.ghostnodeInfo.ip_address,
          this.ghostnodeInfo.password,
          this.ghostnodeInfo.ghostnode_key,
          this.ghostnodeInfo.aliasName,
          this.ghostnodeInfo.transactionHash,
          this.ghostnodeInfo.transactionOutput]).subscribe(res => {
        }, err => {});
        this.close();
      }, error => {

      })
    }
  }

}
