import { Component, OnInit, OnDestroy, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { RpcStateService, SnackbarService } from '../../../core/core.module';

import { payType, ApiEndpoints, message } from '../../business-model/enums';
import { IRecieveNixToWallet, RecieveNixToWallet } from '../../business-model/entities';
import { Log } from 'ng2-logger';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})

export class ReceiveComponent implements OnInit, OnDestroy {
  data: any;
  receivedNixInfo: IRecieveNixToWallet = new RecieveNixToWallet();
  public amount;
  public fees;
  public fee;
  public total;
  public amounts;
  private log: any = Log.create(`receive to nix `);
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;

  constructor(public _dialogRef: MatDialogRef<ReceiveComponent>,
    private _rpcState: RpcStateService, private flashNotification: SnackbarService, ) {

  }

  ngOnInit() {
    debugger
    this.receivedNixInfo = new RecieveNixToWallet();
    this.receivedNixInfo.account = 'jhon';
    this.receivedNixInfo.addresses = [];
    //initiate the call
    this._rpcState.registerStateCall(ApiEndpoints.ReceivedNix, 1000, [this.receivedNixInfo.account]);
    //receive the data
    this.getReceivedNixToWallet();

  }

  setData(data: any) {
    this.data = data;
  }

  copyToClipBoard(): void {
    this.flashNotification.open('Receive nIX to wallet copied to clipboard.');
  } 
  // receive nix to wallet
  private getReceivedNixToWallet() {

    //for testing purpose
    this.receivedNixInfo.addresses[0] = 'NW7N8YjBruoTzrLy1GVVvH2p4FnL46mhYZ-test';
    this.receivedNixInfo.addresses[1] = 'NNqe34X87ckw6UNHrhRJdUakPYxRNZQSaw';
    this.receivedNixInfo.addresses[2] = 'NdqXnS2TLHFLUA3LmQQmMqYQ2biA5jg71z';

    this._rpcState.observe(ApiEndpoints.ReceivedNix)
      .takeWhile(() => !this.destroyed)
      .subscribe(receivedInfo => {
        //this.receivedNixInfo.addresses = receivedInfo;
      },error => {
        this.flashNotification.open(message.SendAmount, 'err');
        this.log.er(message.SendAmount, error)
      });
  }

  openSuccess(walletType: string) {
    const data: any = {
      forceOpen: true,
      walletType: walletType,
      actionType: 'receive'
    };
    this.data.modalsService.forceClose();
    this.data.modalsService.openSmall('success', data);
  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }

  public getAmount(event){
    this.amount = event;
    this.getFee();
   }
 
   public getFee(){
     this.fee=1;
     this.fees = (this.fee/100)* this.amount;
     this.getTotalamount();
   }
 
   public getTotalamount(){
    this.total = this.amount*1+ this.fees*1;
   }

   
  ngOnDestroy() {
    this.destroyed = true;
  }
}
