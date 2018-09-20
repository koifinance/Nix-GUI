import { ApiEndpoints } from "./business-model/enums";
import { RpcStateService } from "../core/core.module";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class WalletHelperService {
    
    constructor(private _rpcState: RpcStateService) {
    }

//call getwalletinfo using params 'null'
    walletInit() {
        this._rpcState.registerStateCall(ApiEndpoints.GetWalletInfo, 1000);
    }

    //call listtransaction using params 'null'
    recentTransInit() {
         this._rpcState.registerStateCall(ApiEndpoints.ListTransactions, 1000);
    }

    //call torstatus using params 'null'
    torstatusInit() {
        this._rpcState.registerStateCall(ApiEndpoints.Torstatus, 1000, );
    }

    //call ghost node list conf using params 'null'
    ghostnodelistconfInit() {        
        this._rpcState.registerStateCall(ApiEndpoints.GhostnodeListConf, 1000, );
    }    
    //call getnewaddress using params 'null'
    getnewaddressInit() {
        this._rpcState.registerStateCall(ApiEndpoints.Getnewaddress, 1000);
    }


    // to get the wallet data
    getwalletData(): Observable<any> {
        return this._rpcState.observe(ApiEndpoints.GetWalletInfo);
    }

    // to get the recent transactions data
    getrecenttransData(): Observable<any> {
        return this._rpcState.observe(ApiEndpoints.ListTransactions);
    }

    //to get the tor status
    gettorstatus(): Observable<any> {
        return this._rpcState.observe(ApiEndpoints.Torstatus);
    }
    // to get the node status
    getghostnodelistData(): Observable<any> {
        return this._rpcState.observe(ApiEndpoints.GhostnodeListConf);
    }

    // to get newaddress
    getnewaddressData(): Observable<any> {
        return this._rpcState.observe(ApiEndpoints.GetWalletInfo);
    }
}
