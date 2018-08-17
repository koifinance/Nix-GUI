import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../../../../modals/modals.service';

@Component({
  selector: 'app-adressbook',
  templateUrl: './adressbook.component.html',
  styleUrls: ['./adressbook.component.scss']
})
export class AdressbookComponent implements OnInit {
  displayedColumns = ["Name", "Type", "Address"];
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
