import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WalletService } from '../../wallet.service';
import { message } from '../../business-model/enums';
import { SnackbarService } from '../../../core/core.module';
import { Log } from 'ng2-logger';
import { ISetAccount, SetAccount, IPassword, encryptpassword } from '../../business-model/entities';

@Component({
  selector: 'app-leasing-contract',
  templateUrl: './leasing-contract.component.html',
  styleUrls: ['./leasing-contract.component.scss']
})
export class LeasingContractComponent implements OnInit {
  leaseContract: any;
  walletPass: IPassword = new encryptpassword();
  editMode: boolean;
  private log: any = Log.create('leasing-contract.component');
  

  constructor(private walletServices: WalletService,
    private flashNotification: SnackbarService, 
    private dialogRef: MatDialogRef<LeasingContractComponent>, 
    @Inject(MAT_DIALOG_DATA) private data) { 
    this.leaseContract = {
      leaseAddress: '',
      amount: 0,
      label: '',
      feePercent: 0,
      rewardAddress: ''
    }
  }
 
  ngOnInit() {
    this.log.d(this.data);
    this.leaseContract = {
      leaseAddress: '',
      amount: 0,
      label: '',
      feePercent: 0,
      rewardAddress: ''
    }
  }

  next() {
    if (this.leaseContract.leaseAddress !== '') {
      const data: any = {
        forceOpen: true,
        ...this.leaseContract,
        modalsService: this.data.modalsService,
      };
      this.data.modalsService.forceClose();
      this.data.modalsService.openxSmall('leasingAmount', data);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
