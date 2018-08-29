
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Log } from 'ng2-logger'
import { RpcService, RpcStateService } from '../core/core.module';
import { TransactionBuilder } from './business-model/entities';
import { ApiEndpoints } from './business-model/enums';
import { WalletLogService } from './wallet.log.service';

@Injectable()
export class WalletService {

  log: any = Log.create('send.service');

  constructor(private _rpc: RpcService, 
    private rpcState: RpcStateService,
    ) {
      //this.walletLog.create("send.service");
  }

  /* Sends a transaction */
  public sendTransaction(tx: TransactionBuilder) {
    
    tx.estimateFeeOnly = false;

    this.send(tx)
      .subscribe(
        success => this.rpc_send_success(success, tx.toAddress, tx.amount),
        error => this.rpc_send_failed(error.message, tx.toAddress, tx.amount));
  }

  public getTransactionFee(tx: TransactionBuilder): Observable<any> {
    tx.estimateFeeOnly = true;
    if (!tx.toAddress) {
      return new Observable((observer) => {
        this.getDefaultStealthAddress()
        .take(1)
        .subscribe(
          (stealthAddress: string) => {
            // set balance transfer stealth address
            tx.toAddress = stealthAddress;
            this.send(tx).subscribe(fee => {
              observer.next(fee);
              observer.complete();
            });
          });
      });
    } else {
      return this.send(tx).map(
        fee => fee);
    }
  }

  public transferBalance(tx: TransactionBuilder) {
    tx.estimateFeeOnly = false;

    // get default stealth address
    this.getDefaultStealthAddress().take(1).subscribe(
      (stealthAddress: string) => {
        this.log.d('got transferBalance, sx' + stealthAddress);
        tx.toAddress = stealthAddress;
        // execute transaction
        this.send(tx).subscribe(
          success => this.rpc_send_success(success, stealthAddress, tx.amount),
          error => this.rpc_send_failed(error.message, stealthAddress, tx.amount));
      },
      error => this.rpc_send_failed('transferBalance, Failed to get stealth address')
    );

  }

  /**
   * Retrieve the first stealth address.
   */
  private getDefaultStealthAddress(): Observable<string> {
    return this._rpc.call(ApiEndpoints.ListStealthAddresses, null)
      .map(
        list => list[0]['Stealth Addresses'][0]['Address']);
  }

  /**
   * Executes or estimates a transaction.
   * Estimates if estimateFeeOnly === true.
   */
  private send(tx: TransactionBuilder): Observable<any> {
    return this._rpc.call(ApiEndpoints.SendTypeTo, [tx.input, tx.output, [{
      address: tx.toAddress,
      amount: tx.amount,
      subfee: tx.subtractFeeFromAmount,
      narr: tx.narration
    }], tx.comment, tx.commentTo, tx.ringsize, 64, tx.estimateFeeOnly]);
  }

  private rpc_send_success(json: any, address: string, amount: number) {
    this.log.d(`rpc_send_success, succesfully executed transaction with txid ${json}`);

    // Truncate the address to 16 characters only
    const trimAddress = address.substring(0, 16) + '...';
    const txsId = json.substring(0, 45) + '...';
    // this.flashNotification.open(`Succesfully sent ${amount} PART to ${trimAddress}!\nTransaction id: ${txsId}`, 'warn');
  }

  private rpc_send_failed(message: string, address?: string, amount?: number) {
    // this.flashNotification.open(`Transaction Failed ${message}`, 'err');
    this.log.er('rpc_send_failed, failed to execute transaction!');
    this.log.er(message);

    /* Detect bug in older wallets with Blind inputs */
    // AddBlindedInputs: GetBlind failed for
    if (message.search('AddBlindedInput') !== -1) {
      // this.fixWallet();
    }
  }



}
