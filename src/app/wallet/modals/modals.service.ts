import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Log } from 'ng2-logger';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ModalsComponent } from './modals.component';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { SuccessComponent } from './success/success.component';
import { GhostNode1Component } from './ghost-node1/ghost-node1.component';
import { EditNodeComponent } from './edit-node/edit-node.component';
import { CancelNodeComponent } from './cancel-node/cancel-node.component';

@Injectable()
export class ModalsService implements OnDestroy {

  public modal: any = null;
  public enableClose: boolean = true;
  messages: Object = {
    send: SendComponent,
    receive: ReceiveComponent,
    success: SuccessComponent,
    ghostNode1: GhostNode1Component,
    editNode: EditNodeComponent ,
    cancelNode: CancelNodeComponent

  };
  private message: Subject<any> = new Subject<any>();
  private progress: Subject<Number> = new Subject<Number>();
  private isOpen: boolean = false;
  private manuallyClosed: any[] = [];
  private destroyed: boolean = false;
  private data: string;
  private dialogRef: MatDialogRef<ModalsComponent>;
  private forceClosed: boolean = false;
  private log: any = Log.create('modals.service');

  constructor(private _dialog: MatDialog) {
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  openSmall(modal: string, data: any) {
    this.open(modal, 'small-dialog', data);
  }

  /**
   * Open a modal
   * @param {string} modal      The name of the modal to open
   * @param {string} panelClass The panel class which controls dialog container style
   * @param {any} data          Optional - data to pass through to the modal.
   */
  open(modal: string, panelClass: string, data?: any): void {
    const dialogRef = this._dialog.open(ModalsComponent, {
      disableClose: true,
      width: '100%',
      height: '100%',
      panelClass: panelClass
    });
    this.dialogRef = dialogRef;

    if (modal in this.messages) {
      if ((data && data.forceOpen)
        || !this.wasManuallyClosed(this.messages[modal].name)) {
        if (!this.wasAlreadyOpen(modal)) {
          this.log.d(`next modal: ${modal}`);
          this.modal = this.messages[modal];
          dialogRef.componentInstance.open(this.modal, data);
          this.isOpen = true;
          dialogRef.componentInstance.enableClose = true;
          dialogRef.afterClosed().subscribe(() => {
            if (!this.forceClosed) {
              console.log('manual close');
              this.close();
            } else {
              console.log('already force closed');
              this.forceClosed = false;
            }
          });
        } else {
          dialogRef.close();
        }
      }
    } else {
      console.error(`modal ${modal} does not exist`);
    }
  }

  /** Close the modal */
  close(): void {
    const isOpen = this.isOpen;

    if (!!this.modal && !this.wasManuallyClosed(this.modal.name)) {
      this.manuallyClosed.push(this.modal.name);
    }
    this.isOpen = false;
    this.modal = undefined;

    if (isOpen) {
      this.message.next({ close: true });
    }
  }

  forceClose(): void {
    this.forceClosed = true;
    this.dialogRef.componentInstance.close();
    this.close();
  }

  /**
   * Check if a modal was manually closed
   * @param {any} modal  The modal to check
   */
  wasManuallyClosed(modal: any): boolean {
    return this.manuallyClosed.includes(modal);
  }

  /** Check if the modal is already open */
  wasAlreadyOpen(modalName: string): boolean {
    return (this.modal === this.messages[modalName]);
  }
}
