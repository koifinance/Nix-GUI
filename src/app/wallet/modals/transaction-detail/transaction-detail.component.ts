import { Component, ComponentRef, ViewContainerRef, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {

  data: any;
  private log: any = Log.create('transaction-detail.component');
  private modalContainer: ViewContainerRef;
  modal: ComponentRef<Component>;

  constructor(
    public _dialogRef: MatDialogRef<TransactionDetailComponent>
  ) { }

  ngOnInit() {
    this.log.d(this.data);
  }

  setData(data: any) {
    this.data = data;
  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }
}
