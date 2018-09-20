import { Component, OnInit, ViewContainerRef, OnDestroy, ComponentRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.scss']
})
export class EditNodeComponent implements OnInit, OnDestroy {
  data: any;
  private modalContainer: ViewContainerRef;
  private destroyed: boolean = false;
  modal: ComponentRef<Component>;
  
  constructor(public _dialogRef: MatDialogRef<EditNodeComponent>) {
  }

  ngOnInit() {
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

  // openSuccess(walletType: string) {
  //   const data: any = {
  //     forceOpen: true,
  //     walletType: walletType,
  //     actionType: 'editNode'
  //   };
  //   this.data.modalsService.forceClose();
  // }
  ngOnDestroy() {
    this.destroyed = true;
  }
}
