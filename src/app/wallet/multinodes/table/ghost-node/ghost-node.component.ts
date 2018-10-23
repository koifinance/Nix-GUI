import { Component, OnInit, Input } from '@angular/core';
import { faCircle as faCircleSolid,faCopy,faTimes,faFileAlt} from '@fortawesome/free-solid-svg-icons';
import { faCircle,faEdit } from '@fortawesome/free-regular-svg-icons';
import { ModalsService } from '../../../modals/modals.service';
import { WalletService } from '../../../wallet.service';
import { RpcStateService } from '../../../../core/core.module';
import { ApiEndpoints, message } from '../../../business-model/enums';
import { Log } from 'ng2-logger';

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
  displayedColumns = ["Name", "Status", "Active for","Action1","Action2","Action3"];
  dataSource = [];
  constructor(
    private modalsService: ModalsService,
    private walletServices: WalletService,
    private _rpcState: RpcStateService) { }

  ngOnInit() {
  }

  openViewNode() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('ghostNode1', data);
  }
  openCancel() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('cancelNode', data);
  }

  openEdit() {
    const data: any = {
      forceOpen: true,
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('editNode', data);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
