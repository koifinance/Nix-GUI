import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss']
})
export class RestoreWalletComponent implements OnInit {

  constructor(private router: Router, public _dialogRef: MatDialogRef<RestoreWalletComponent>) { }

  ngOnInit() {
  }
  openSuccess() {
      this._dialogRef.close();
      this.router.navigate(['./main']);
  }
}
