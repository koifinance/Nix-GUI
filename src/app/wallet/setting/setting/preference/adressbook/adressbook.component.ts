import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalsService } from '../../../../modals/modals.service';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { message } from '../../../../business-model/enums';
import { Log } from 'ng2-logger';
import { MatTableDataSource } from '@angular/material';
import { WalletService } from '../../../../wallet.service';
import { SnackbarService } from '../../../../../core/core.module';

export interface GhostElement {
  name: string;
  type: string;
  address: string;
  action: string;
}

@Component({
  selector: 'app-adressbook',
  templateUrl: './adressbook.component.html',
  styleUrls: ['./adressbook.component.scss']
})
export class AdressbookComponent implements OnInit {
  private log: any = Log.create(`get all addresses `);

  faEdit: any = faEdit;
  faTrashAlt: any = faTrashAlt;
  displayedColumns = ["Name", "Type", "Address", "Action"];
  dataSource: MatTableDataSource<GhostElement>;

  constructor(private modalsService: ModalsService, 
              private flashNotification: SnackbarService, 
              private walletServices: WalletService, 
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getAllAddresses();
    this.dataSource = new MatTableDataSource<GhostElement>();
    this.dataSource.data = null;
  }

  getAllAddresses() {
    this.walletServices.getAllAddresses().subscribe(receivedInfo => {
      let receiveAddresses = receivedInfo['receive'];
      let sendAddresses = receivedInfo['send'];
      let allAddresses = [];
      for (let key in receiveAddresses) {
        allAddresses.push({name: receiveAddresses[key], type: '', address: key, action: "Edit"});
      }
      for (let key in sendAddresses) {
        allAddresses.push({name: sendAddresses[key], type: '', address: key, action: "Edit"});
      }
      this.dataSource.data = allAddresses;
    }, error => {
      this.flashNotification.open(message.GetAllAddresses, 'err');
      this.log.er(message.GetAllAddresses, error)
    });
  }

  openAddress() {
    const data: any = {
      forceOpen: true,      
      modalsService: this.modalsService,
      parentRef: this
    };
    this.modalsService.openSmall('newAddress', data);
  }

  edit(element) {
    const data: any = {
      forceOpen: true,      
      modalsService: this.modalsService,
      modalData: element,
      parentRef: this
    };
    this.log.data(element);
    this.modalsService.openSmall('newAddress', data);
  }

  delete(element) {
    this.walletServices.manageAddressbook('del', element.address).subscribe(res => {
        this.getAllAddresses();
      }, error => {
        this.flashNotification.open(error.message, 'err')
        this.log.er(message.AddressDeletedMessage, error)
    });
  }
}
