import { Component, OnInit, Input } from '@angular/core';
import { faCircle as faCircleSolid,faCopy,faTimes,faFileAlt, faCaretSquareRight} from '@fortawesome/free-solid-svg-icons';
import { faCircle,faEdit } from '@fortawesome/free-regular-svg-icons';
import { ModalsService } from '../../../modals/modals.service';
import { WalletService } from '../../../wallet.service';
import { RpcStateService } from '../../../../core/core.module';
import { SnackbarService } from '../../../../core/core.module';
import { ApiEndpoints, message } from '../../../business-model/enums';
import { Log } from 'ng2-logger';
import {
  IPassword,
  encryptpassword
} from '../../../business-model/entities';

export interface GhostElement {
  name: string;
  status: string;
  activefor: string;
  action1: string;
  action2: string;
  action3: string;
}

@Component({
  selector: 'app-ghost-node',
  templateUrl: './ghost-node.component.html',
  styleUrls: ['./ghost-node.component.scss']
})
export class GhostNodeComponent implements OnInit {
  @Input() ghostNodes: Array<any>;

  private destroyed: boolean = false;
  private log: any = Log.create('Ghostnode.component');
  faCircle: any = faCircle;
  faFileAlt: any = faFileAlt;
  faTimes: any = faTimes;
  faCopy: any = faCopy;
  faEdit: any = faEdit;
  faCircleSolid: any = faCircleSolid;
  faCaretSquareRight: any = faCaretSquareRight;
  displayedColumns = ["Name", "Status", "Detail", "Start"];
  dataSource = [];
  currentNode: any;

  constructor(
    private modalsService: ModalsService,
    private walletServices: WalletService,
    private flashNotification: SnackbarService,
    private _rpcState: RpcStateService) { }

  ngOnInit() {
  }

  openDetail(node: any) {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService,
      ghostnode: node
    };
    this.modalsService.openSmall('ghostNode1', data);
  }

  startNode(node: any) {
    this.currentNode = node;
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService,
      parentRef: this,
      title: "Start Ghostnode",
      forStaking: false
    };
    this.modalsService.openSmall('ghostnodeInfoInput', data);
  }

  // being called from modal
  passwordEntered(passphrase: IPassword) {
    this.walletServices.startGhostnode(this.currentNode.alias)
      .takeWhile(() => !this.destroyed)
      .subscribe(res => {
        if (res.result == "successful") {

        } else {
          this.flashNotification.open(res.errorMessage, 'err')
        }
        this.walletServices.walletlock()
          .takeWhile(() => !this.destroyed)
          .subscribe(res => {
          });
      });
    // debugger
    // this.walletServices.enableStaking(passphrase).subscribe(res => {
    //   this.stakingEnabled();
    // }, error => {
    //   this.flashNotification.open(error.message, 'err')
    //   this.log.er(message.ChangePasswordMessage, error)
    // });
  }

  // openCancel() {
  //   const data: any = {
  //     forceOpen: true,
  //     modalsService: this.modalsService
  //   };
  //   this.modalsService.openSmall('cancelNode', data);
  // }

  // openEdit() {
  //   const data: any = {
  //     forceOpen: true,
  //     modalsService: this.modalsService
  //   };
  //   this.modalsService.openSmall('editNode', data);
  // }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
