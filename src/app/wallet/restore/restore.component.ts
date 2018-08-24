import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalsService } from '../modals/modals.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit {

  walletNewPassword: string;
  incorrectChecked: boolean = false;
  showContentError: boolean = false;
  step: number = 1;
  recoveryPhrase: Array<string> = [
    'lorem',
    'dolor',
    'sit',
    'amet',
    'lorem',
    'dolor',
    'lorem',
    'dolor',
    'sit',
    'amet',
    'lorem',
    'dolor',
    'lorem',
    'dolor',
    'sit',
    'amet',
    'lorem',
    'dolor',
    'lorem',
    'dolor',
    'sit',
    'amet',
    'lorem',
    'dolor',
  ];
  walletWizard: any = [
    {
      valid: (): boolean => true
    },
    {
      valid: (): boolean => true
    },
    {
      valid: (): boolean => {
        if (this.walletNewPassword == null || this.walletNewPassword === undefined) {
          this.showContentError = true;
        return false;
        }
        return true;
      }
    }
   
  ];
  // private log: any = Log.create('create.component');
  private destroyed: boolean = false;

  constructor(
    private router: Router, private modalsService: ModalsService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  nextStep() {
    if (this.walletWizard[this.step].valid()) {
      if (this.step === 2) {
        const data: any = {
          forceOpen: true,
          modalsService: this.modalsService
        };
        this.modalsService.openSmall('restoreWallet', data);
        // this.step++;
        // this.goTo('main');
        // return;
      }
      
    }
    
    if (!this.walletWizard[this.step].valid()) {
      return;
    }

    if (this.step < 2) {
      this.step++;
    }
    this.showContentError = false;
  }

  prevStep() {
    if (this.step === 1) {
      this.goTo('welcome');
      return;
    }
    else {
      this.step--;
      this.showContentError = false;
    }
    
  }

  stepProgress(): number {
    const step = this.step-1;
    if (step < 3) {
       let step1 = step + 1;
      return step1 * 33;
    }
    return 100;
  }

  stepTitle(): string {
    const step = this.step-1;
    if (step === 0) {
      return 'Restore with wallet passphrase';
    } 
    return 'Wallet password';
  } 
 

  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
