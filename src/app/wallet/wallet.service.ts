
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Log } from 'ng2-logger'
import { RpcService, RpcStateService } from '../core/core.module';
import { TransactionBuilder,IWalletSendToNix, IRecieveNixToWallet, IAddNode, recentTransactionInfo, IAddBook, TransactionInfo, IPassword, IBitcoinprice, ISetAccount, IChangePassword, ISavecurrency } from './business-model/entities';
import { ApiEndpoints, typeOfAddresses } from './business-model/enums';
import { Http } from '@angular/http';
@Injectable()
export class WalletService {
  filters: any = {
    watchonly: undefined,
    category: undefined,
    search: undefined,
    type: undefined,
    sort: undefined
  };
  log: any = Log.create('send.service');
  txCount: number = 0;
  private addressCount: number = 0;
  unlockTimeout: number = 60;
  private validWords: string[];
  private _listners = new Subject<any>();

  constructor(private _rpc: RpcService, private rpcState: RpcStateService,private http:Http) {

  }

  // get bit coin
  public getBitcoin (price : IBitcoinprice): Observable<any> {
    return this.http.get(ApiEndpoints.GetBtc).map(response =>response.json());
     
  }
  
  // Send for wallet
    public SendToNix(wallet : IWalletSendToNix): Observable<any> {
    return this._rpc.call(ApiEndpoints.SendToAddress, [wallet.amount,wallet.address]);
  }
  
  public receivedNix(receiveNix : IRecieveNixToWallet): Observable<any> {
    // return this._rpc.call(ApiEndpoints.ReceivedNix,[receiveNix.account]);
    return this.http.get(ApiEndpoints.ReceivedNix).map(response => response.json());

  }

  // add a node
  public addNode(adnode : IAddNode): Observable<any> {
    return this._rpc.call(ApiEndpoints.AddNode,[adnode.node,adnode.action]);
  }

  // get balance for NIX
  public getBalanceAmount(): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetBalance).map(
      balance => balance);
  }

  // get Tor status NIX
  public getTorstatus(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Torstatus).map(
      status => status);
  }

  // get ghost node List Conf for NIX
  public ghostnodeListConf(): Observable<any> {
    return this._rpc.call(ApiEndpoints.GhostnodeListConf).map(
      node => node);
  }

  // get all recent transaction of NIX
  // public listTransaction(transactions :recentTransactionInfo): Observable<any> {
  //   return this._rpc.call(ApiEndpoints.ListTransactions,[ transactions.account,transactions.count,
  //     transactions.from
  //   ]);
  // }
  public listTransaction(transactions :recentTransactionInfo): Observable<any> {
    return this._rpc.call(ApiEndpoints.ListTransactions);
  }

  // to manage address book
  public addressCallBack(addressbook :IAddBook): Observable<any> {
    return this._rpc.call(ApiEndpoints.AddressBook, [addressbook.action,
     addressbook.address, addressbook.label]);
    }

  // to validate address 
  public validateaddressCallBack(addressbook :IAddBook): Observable<any> {
    return this._rpc.call(ApiEndpoints.ValidadeAddress, [addressbook.address]);
  }  

  // to filter address
  public filterAddressList(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Filteraddresses, this.rpc_getParams());
  }

  // To add address
public receiveNIXToWallet(setaccount : ISetAccount): Observable<any> {
  return this._rpc.call(ApiEndpoints.Setaccount, [setaccount.address,setaccount.account]);
}

// To save currency
public saveCurrency(currency : ISavecurrency): Observable<any> {
  // return this._rpc.call(ApiEndpoints.SaveCurrency, [currency.convert]);
  return this.http.get(ApiEndpoints.SaveCurrency).map(response =>response.json());
}

  // To save currency
  public changepassword(pass : IChangePassword): Observable<any> {
    return this._rpc.call(ApiEndpoints.Walletpassphrasechange, [pass.oldpassphrase, pass.newpassphrase]);
  }

  private rpc_getParams() {
    if (typeOfAddresses.Send) {
      return [0, this.addressCount, '0', '',  '2'];
    }  else if (typeOfAddresses.Receive) {
      return [0, this.addressCount, '0', '',  '1'];
    } else {
      return [0, this.addressCount, '0', ''];
    }
  }

  
  /** Count the transactions (for a specific filter) */
  public countTransactions(): void {
    const options = {
      'count': this.txCount,
    };
    Object.keys(this.filters).map(filter => options[filter] = this.filters[filter]);

    this._rpc.call(ApiEndpoints.Filtertransactions, [options])
      .subscribe((txResponse: Array<Object>) => {
        this.log.d(`countTransactions, number of transactions after filter: ${txResponse.length}`);
        this.txCount = txResponse.length;
        return;
      });
  }
  

  // get all transaction
  public getallTransaction(transactions :TransactionInfo): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetTrasaction,[transactions.txid]);
  }


  //to encrpty Password
  public encrptyPassword(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Encryptwallet, [encrypt.password])
  }
  
  // wallet pass phrase
  public walletpassphrase(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Walletpassphrase, [
      encrypt.password,
      +(encrypt.password ? 0 : this.unlockTimeout),
      encrypt.password
    ])
  } 

  // wallet pass phrase
  public walletpassphrasechange(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Walletpassphrasechange, [
      encrypt.password])
  }
  
  /*
   * This is the logic for creating a new recovery phrase
  */
 generateMnemonic(success: Function, password?: string) {
  this.log.d(`password: ${password}`);
  const params = ['new', password];

  if (password === undefined || password === '') {
    params.pop();
  }
  this._rpc.call(ApiEndpoints.Mnemonic, params)
    .subscribe(
      response => success(response),
      error => Array(24).fill('error'));
}


validateWord(word: string): boolean {
  if (!this.validWords) {
    this._rpc.call(ApiEndpoints.Mnemonic, ['dumpwords'])
    .subscribe(
      (response: any) => this.validWords = response.words,
      // TODO: Handle error appropriately
      error => this.log.er('validateWord: mnemonic - dumpwords: Error dumping words', error));

    return false;
  }

  return this.validWords.indexOf(word) !== -1;
}

importMnemonic(words: string[], password: string) {
  const params = [words.join(' '), password];
  if (!password) {
    params.pop();
  }
  return this._rpc.call(ApiEndpoints.Extkeygenesisimport, params);
}

generateDefaultAddresses() {
  /* generate balance transfer address (stealth)*/
  this._rpc.call('getnewstealthaddress', ['balance transfer']).subscribe(
    (response: any) => this.log.i('generateDefaultAddresses(): generated balance transfer address'),
    error => this.log.er('generateDefaultAddresses: getnewstealthaddress failed'));

  /* generate initial public address */
  this._rpc.call('getnewaddress', ['initial address']).subscribe(
    (response: any) => this.log.i('generateDefaultAddresses(): generated initial address'),
    error => this.log.er('generateDefaultAddresses: getnewaddress failed'));
}
/* Sends a transaction */
public sendTransaction(tx: TransactionBuilder) {
  tx.estimateFeeOnly = false;

  this.send(tx)
    .subscribe(
      // success => this.rpc_send_success(success, tx.toAddress, tx.amount),
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
        // success => this.rpc_send_success(success, stealthAddress, tx.amount),
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
  return this._rpc.call(ApiEndpoints.ListTransactions, [tx.input, tx.output, [{
    address: tx.toAddress,
    amount: tx.amount,
    subfee: tx.subtractFeeFromAmount,
    narr: tx.narration
  }], tx.comment, tx.commentTo, tx.ringsize, 64, tx.estimateFeeOnly]);
}

  private rpc_send_success(json: any) {
    this.log.d(`rpc_send_success, succesfully executed transaction with txid ${json}`);

  }

  private rpc_send_failed(message: string, address?: string, amount?: number) {
    this.log.er('rpc_send_failed, failed to execute transaction!');
    this.log.er(message);
    /* Detect bug in older wallets with Blind inputs */
    // AddBlindedInputs: GetBlind failed for
    if (message.search('AddBlindedInput') !== -1) {
      // this.fixWallet();
    }
  }

}
