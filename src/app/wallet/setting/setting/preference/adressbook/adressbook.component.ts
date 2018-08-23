import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../../../../modals/modals.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons';


export interface GhostElement {
  name: string;
  type: string;
  address: string;
  action: string;
}

const ELEMENT_DATA: GhostElement[] = [
  {name: 'Address name', type: 'Public-01', address: 'GZeztH1P1ZndvzJP1ZndvzJMgdw1uIDtc6pp4uNXXklMgdw1uI', action: "Edit"},
  {name: 'Address name', type: 'Public-01', address: 'GZeztH1P1ZndvzJP1ZndvzJMgdw1uIDtc6pp4uNXXklMgdw1uI', action: "Edit"}

];

@Component({
  selector: 'app-adressbook',
  templateUrl: './adressbook.component.html',
  styleUrls: ['./adressbook.component.scss']
})
export class AdressbookComponent implements OnInit {
  faEdit: any = faEdit;
  displayedColumns = ["Name", "Type", "Address","Action"];
  dataSource = ELEMENT_DATA;
  constructor(private modalsService: ModalsService) { }

  ngOnInit() {
  }

  openAddress() {
    const data: any = {
      forceOpen: true,      
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('newAddress', data);
  }
}
