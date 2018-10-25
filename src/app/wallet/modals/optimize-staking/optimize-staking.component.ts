import { Component, OnInit, ViewContainerRef, ComponentRef } from '@angular/core';
import { SnackbarService } from '../../../core/core.module';
import { WalletService } from '../../wallet.service';
import { IChangePassword, ChangePassword } from '../../business-model/entities';
import { Log } from 'ng2-logger';
import { message } from '../../business-model/enums';
import { MatDialogRef } from '@angular/material';
import {
  IPassword,
  encryptpassword
} from '../../business-model/entities';

@Component({
  selector: 'app-optimize-staking',
  templateUrl: './optimize-staking.component.html',
  styleUrls: ['./optimize-staking.component.scss']
})
export class OptimizeStakingComponent implements OnInit {
  private log: any = Log.create('passwordchange.component');
  private destroyed: boolean = false;
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;
  data: any;
  isInclude: boolean = false;

  constructor(private walletServices: WalletService,
    private flashNotification: SnackbarService,public _dialogRef: MatDialogRef<OptimizeStakingComponent>) { }

  ngOnInit() {

  }

  setData(data: any) {
    this.data = data;
  }



  optimize() {

  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }
}
