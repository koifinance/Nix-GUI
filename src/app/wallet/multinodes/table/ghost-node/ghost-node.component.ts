import { Component, OnInit } from '@angular/core';
import { faCircle as faCircleSolid,faCopy,faTimes,faFileAlt} from '@fortawesome/free-solid-svg-icons';
import { faCircle,faEdit } from '@fortawesome/free-regular-svg-icons';
import { ModalsService } from '../../../modals/modals.service';

export interface GhostElement {
  name: string;
  status: string;
  activefor: string;
  action1: string;
  action2: string;
  action3: string;

}

const ELEMENT_DATA: GhostElement[] = [
  {name: 'Hydrogen', status: 'Starting-up', activefor: '00m',action1: "Detail", action2:"Edit", action3: "Cancel"},
  {name: 'Hydrogen', status: 'Starting-up', activefor: '00m',action1: "Detail", action2:"Edit", action3: "Cancel"}

];
@Component({
  selector: 'app-ghost-node',
  templateUrl: './ghost-node.component.html',
  styleUrls: ['./ghost-node.component.scss']
})
export class GhostNodeComponent implements OnInit {
  faCircle: any = faCircle;
  faFileAlt: any = faFileAlt;
  faTimes: any = faTimes;
  faCopy: any = faCopy;
  faEdit: any = faEdit;
  faCircleSolid: any = faCircleSolid;
  displayedColumns = ["Name", "Status", "Active for","Action1","Action2","Action3"];
  dataSource = ELEMENT_DATA;
  constructor(private modalsService: ModalsService) { }

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
}
