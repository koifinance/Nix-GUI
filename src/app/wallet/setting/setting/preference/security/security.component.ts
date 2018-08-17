import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../../../../modals/modals.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  constructor(private modalsService: ModalsService) { }

  ngOnInit() {
  }


  openChangePassword() {
    const data: any = {
      forceOpen: true,      
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('passwordChange', data);
  }


  openRecovery() {
    const data: any = {
      forceOpen: true,      
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('recoveryPharse', data);
  }
}
