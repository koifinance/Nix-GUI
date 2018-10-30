import { Component, OnInit, OnDestroy, ComponentRef, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RpcStateService, SnackbarService } from '../../../core/core.module';
import { message } from '../../business-model/enums';

@Component({
  selector: 'app-ghost-node1',
  templateUrl: './ghost-node1.component.html',
  styleUrls: ['./ghost-node1.component.scss']
})
export class GhostNode1Component implements OnInit, OnDestroy {
  data: any;
  ghostnode: any;
  private modalContainer: ViewContainerRef;
  private destroyed: boolean = false;
  modal: ComponentRef<Component>;

  constructor(public _dialogRef: MatDialogRef<GhostNode1Component>,
    private flashNotification: SnackbarService ) {
  }

  ngOnInit() {
  }

  setData(data: any) {
    this.data = data;
    this.ghostnode = data.ghostnode;
    if (this.ghostnode.lastSeen != 'N/A') {
      let lsDate = new Date(this.ghostnode.lastSeen * 1000);
      this.ghostnode.lastSeenDate = lsDate.toISOString(); //this.ghostnode.lastSeen * 1000,   .toISOString().split('T')[0]
    } else {
      this.ghostnode.lastSeenDate = 'N/A';
    }
    // debugger
  }

  copy() {
    this.flashNotification.open(message.CopiedAddress, 'info');
  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
