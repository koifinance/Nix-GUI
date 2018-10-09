import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WalletService } from '../../wallet.service';
import { message } from '../../business-model/enums';
import { SnackbarService } from '../../../core/core.module';
import { Log } from 'ng2-logger';
import { ISetAccount, SetAccount, IPassword, encryptpassword } from '../../business-model/entities';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.scss']
})
export class AddaddressComponent implements OnInit {
  addAddress: ISetAccount = new SetAccount();
  walletPass: IPassword = new encryptpassword();
  editMode: boolean;
  private log: any = Log.create('addaddress.component');
  

  constructor(private walletServices: WalletService,
    private flashNotification: SnackbarService, 
    private dialogRef: MatDialogRef<AddaddressComponent>, 
    @Inject(MAT_DIALOG_DATA) private data) { 

  }
 
  ngOnInit() {
    const modalData = this.data.modalData;
    this.editMode = !(!modalData);
    if (this.editMode) {
      this.addAddress.address = modalData.address;
      this.addAddress.account = modalData.name;
    }
  }

  save() {
    const action = this.editMode ? 'edit' : 'add';
    const parent = this.data.parentRef;
    this.walletServices.manageAddressbook(action, this.addAddress.address, this.addAddress.account).subscribe(res => {
        parent.getAllAddresses();
        this.dialogRef.close();
      }, error => {
        const msg = this.editMode ? message.AddressEditedMessage : message.AddressAddedMessage;
        this.flashNotification.open(error.message, 'err')
        this.log.er(msg, error)
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
