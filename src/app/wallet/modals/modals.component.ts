import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  DoCheck,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { SuccessComponent } from './success/success.component';
import { GhostNode1Component } from './ghost-node1/ghost-node1.component';
import { EditNodeComponent } from './edit-node/edit-node.component';
import { CancelNodeComponent } from './cancel-node/cancel-node.component';
import { WithdrawRewardsComponent } from './withdraw-rewards/withdraw-rewards.component';
import { TransactionComponent } from './transaction/transaction.component';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
  entryComponents: [
    SendComponent,
    ReceiveComponent,
    SuccessComponent,
    GhostNode1Component,
    EditNodeComponent,
    CancelNodeComponent,
    TransactionComponent,
    WithdrawRewardsComponent
  ]
})
export class ModalsComponent implements DoCheck, OnInit, OnDestroy {

  modal: ComponentRef<Component>;
  hasScrollY = false;
  closeOnEscape = true;
  enableClose: boolean;
  loadSpinner: boolean;
  faTimes: any = faTimes;
  @ViewChild('modalContainer', { read: ViewContainerRef })
  private modalContainer: ViewContainerRef;
  private destroyed = false;

  constructor(
    private _element: ElementRef,
    private _resolver: ComponentFactoryResolver,
    public _dialogRef: MatDialogRef<ModalsComponent>) {
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    // TODO: undocumented hack?
    if (this._element) {
      const element = this._element.nativeElement;
      const style = element.ownerDocument.defaultView.getComputedStyle(element, undefined);
      this.hasScrollY = style.overflowY === 'scroll'
        || (style.overflowY === 'auto' && element.clientHeight < element.scrollHeight);
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  open(message: any, data?: any): void {
    this.modalContainer.clear();
    const factory = this._resolver.resolveComponentFactory(message);
    this.modal = this.modalContainer.createComponent(factory);
    const dynamicModal = this.modal as any;
    if (data !== undefined && dynamicModal.instance.setData !== undefined) {
      dynamicModal.instance.setData(data);
    }
  }

  close(): void {
    this._dialogRef.close();
    // remove and destroy message
    this.modalContainer.remove();
    this.modal.destroy();
  }

  // close window on escape
  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: any) {
    if (this.closeOnEscape && this.enableClose
      && event.key.toLowerCase() === 'escape' && this.modal) {
      this.close();
    }
  }

}
