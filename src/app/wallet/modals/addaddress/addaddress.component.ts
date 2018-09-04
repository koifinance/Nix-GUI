import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../wallet.service';
import { message } from '../../business-model/enums';
import { SnackbarService } from '../../../core/core.module';
import { Log } from 'ng2-logger';
import { ISetAccount, SetAccount } from '../../business-model/entities';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.scss']
})
export class AddaddressComponent implements OnInit {
  addAddress: ISetAccount = new SetAccount();
  private log: any = Log.create('addaddress.component');

  constructor(private walletServices: WalletService,
    private flashNotification: SnackbarService) { }

  ngOnInit() {
  }

  save() {
    debugger
    var result = this.walletServices.receiveNIXToWallet(this.addAddress).subscribe(res => {  
      debugger
   }, error => {
    this.flashNotification.open(message.AddressAddedMessage, 'err')
    this.log.er(message.AddressAddedMessage, error)
  });
  }
}
