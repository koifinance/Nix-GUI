import { Component, OnInit, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faq } from './faq';
import { FAQ } from '../shared/faq.model';
import { ModalsService } from '../modals/modals.service';
import { RpcStateService, SnackbarService } from '../../core/core.module';
import { AddNode, IAddNode } from '../business-model/entities';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'wallet-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodesComponent implements OnInit, OnDestroy {

  faq: Array<FAQ> = faq;

  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  walletNewPassword: string;
  walletRepeatPassword: string;
  showPassword: boolean = false;
  termsChecked: boolean = false;
  showSidebarError: boolean = false;
  showContentError: boolean = false;
  phraseCopied: boolean = false;
  step: number = 1;
  walletWizard: any = [
    {
      valid: (): boolean => true
    },
    {
      valid: (): boolean => true
    },
    {
      valid: (): boolean => true
    }
  ];
  private log: any = Log.create('create.component');
  private destroyed: boolean = false;
  addnode: IAddNode = new AddNode();

  constructor(
    private router: Router,
    private modalsService: ModalsService,
    private walletServices: WalletService,
    private _rpcState: RpcStateService, private flashNotification: SnackbarService,
  ) {
  }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }

  nextStep() {
    if(this.step===1) {
        this.addNODE();
       
    }
    this.nextNode();
  }

  // add node
  addNODE() {
    var result = this.walletServices.addNode(this.addnode).subscribe(res => {  
      
    }, error => {
     this.flashNotification.open('Failed to add node!', 'err');
     this.log.er('Failed to add node', error)
   });
  }

  nextNode() {
    if (this.step === 4) {
      this.step++;
      this.goTo('main');
      return;
    }

    if (!this.walletWizard[this.step].valid()) {
      return;
    }

    this.step++;
    this.showContentError = false;
    this.showSidebarError = false;
  }
  prevStep() {
    this.showSidebarError = false;
    this.showContentError = false;
    this.step--;
  }

  stepProgress(): number {
    const step = this.step;
    if (step < 3) {
      return step * 33;
    }
    return 100;
  }

  stepTitle(): string {
    const step = this.step;
    if (step === 1) {
      return 'Set-up Ghost node';
    } else if (step === 2) {
      return 'Transfer NIX to Ghost node';
    }
    else if (step === 3) {
      return 'Set up Virtual Private Service (VPS)';
    }
    return 'Confirm your recovery phrase';
  }

  openTrans() {
    const data: any = {
      forceOpen: true,      
      modalsService: this.modalsService
    };
    this.modalsService.openSmall('transaction', data);
  }
  
  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  goTopage(route: string) {
    this.router.navigate(['./main/nodes']);
  }

  goToNextpage(route: string) {
    this.router.navigate(['./main/multi/nodes']);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

}
