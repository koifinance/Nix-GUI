import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit {

  constructor(private router: Router, public _dialogRef: MatDialogRef<CreateWalletComponent>) { }


  ngOnInit() {
  }
  openSuccess() {
    this._dialogRef.close();
    this.router.navigate(['./main']);
}
}
