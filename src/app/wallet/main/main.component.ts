import { Component, OnInit, OnDestroy } from '@angular/core';
import { Log } from 'ng2-logger';
import { RpcStateService } from '../../core/core.module';

@Component({
  selector: 'wallet-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {


  private log: any = Log.create('main.component');
 
  destroyed: boolean = false;
  constructor(private _rpcState: RpcStateService) {
  }

  ngOnInit() {

   
  }



  ngOnDestroy() {
   
  }
}
