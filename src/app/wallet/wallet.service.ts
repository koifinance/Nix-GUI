
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Log } from 'ng2-logger'
import { RpcService, RpcStateService } from '../core/core.module';
import { 
  TransactionBuilder,
  IWalletSendToNix,
  IRecieveNixToWallet,
  IAddNode,
  IAddBook,
  TransactionInfo,
  IPassword,
  IBitcoinprice,
  ISetAccount,
  IChangePassword,
  ISavecurrency,
  RecentTransactionInfo,
  IDepostAmount,
  IUnGhostAmount
} from './business-model/entities';
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

  // get fee for amount
  public getFeeForAmout (amount: number, address: string): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetFeeForAmount, [amount, address]);
  }

  // get bit coin
  public getBitcoin (price : IBitcoinprice): Observable<any> {
    return this.http.get(ApiEndpoints.GetBtc).map(response => response.json());  
  }

  // get in EUR
  public getInEUR (price : IBitcoinprice): Observable<any> {
    return this.http.get(ApiEndpoints.GetEur).map(response => response.json());  
  }

  // Send for wallet
  public SendToNix(wallet : IWalletSendToNix): Observable<any> {
    return this._rpc.call(ApiEndpoints.SendToAddress, [wallet.address, wallet.amount, '', '', wallet.subtractFeeFromAmount]);
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
  
  // get blockchain info
  public getBlockchainInfo (): Observable<any> {
    return this._rpc.call(ApiEndpoints.Getblockchaininfo).map(
      info => info);
  }
  
  // get staking info
  public getStakingInfo (): Observable<any> {
    return this._rpc.call(ApiEndpoints.Getstakinginfo).map(
      info => info);
  }
  
  // get Tor status NIX
  public getTorstatus(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Torstatus).map(
      status => status);
  }

  // Enable/disable Tor status NIX
  public enableTor(enable: string): Observable<any> {
    return this._rpc.call(ApiEndpoints.EnableTor, [enable]);
  }

  // get ghostnode List Conf for NIX
  public ghostnodeListConf(): Observable<any> {
    return this._rpc.call(ApiEndpoints.GhostnodeListConf).map(
      node => node);
  }

  // get ghostnode count
  public ghostnodeCount(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Ghostnode, ['count']).map(
      count => count);
  }

  // get enabled ghostnode count
  public ghostnodeEnabledCount(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Ghostnode, ['count', 'enabled']).map(
      count => count);
  }

  // get ghostnode count
  public getMyGhostnode(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Ghostnode, ['list-conf']).map(
      count => count);
  }

  // start a ghostnode
  public startGhostnode(alias: string): Observable<any> {
    return this._rpc.call(ApiEndpoints.Ghostnode, ['start-alias', alias]).map(
      count => count);
  }

  // get the new address
  public getNewAddress(): Observable<any> {
    return this._rpc.call(ApiEndpoints.Getnewaddress).map(
      address => address);
  }

  // get all recent transaction of NIX
  // public listTransaction(transactions :recentTransactionInfo): Observable<any> {
  //   return this._rpc.call(ApiEndpoints.ListTransactions,[ transactions.account,transactions.count,
  //     transactions.from
  //   ]);
  // }
  public listTransaction(transactions :RecentTransactionInfo): Observable<any> {
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
  public saveCurrency(currency : ISavecurrency) {
    localStorage.setItem('currency', currency.convert);
    return true;    
  }

  public getCurrency() {
    if (!localStorage.getItem('currency')) return 'USD';
    return localStorage.getItem('currency');
  }

  // To save currency
  public changepassword(pass : IChangePassword): Observable<any> {
    return this._rpc.call(ApiEndpoints.Walletpassphrasechange, [pass.oldpassphrase, pass.newpassphrase]);
  }

  // To get list address by account
  public listReceivedByAccount(): Observable<any> {
    return this._rpc.call(ApiEndpoints.ListReceivedbyAddress);
  }
  
  // To lock wallet
  public walletlock(): Observable<any> {
    return this._rpc.call(ApiEndpoints.WalletLock);
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

  // get account address
  public getAccountAddress(account: string): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetAccountAddress, [account]);
  }

  // list accounts
  public listAccounts(): Observable<any> {
    return this._rpc.call(ApiEndpoints.ListAccounts);
  }

  // get addresses from account
  public getAddressesByAccount(account: string): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetAddressesbyAccount, [account]);
  }

  // get all transaction
  public getallTransaction(transactions :TransactionInfo): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetTransaction,[transactions.txid]);
  }

  // get all addresses in address book
  public getAllAddresses(): Observable<any> {
    return this._rpc.call(ApiEndpoints.GetAllAddresses);
  }

  // add/edit/del/info address in address book
  public manageAddressbook(action: string, address: string, label: string = '', purpose: string = ''): Observable<any> {
    return this._rpc.call(ApiEndpoints.ManageAddressbook, [
      action,
      address,
      label,
      purpose
    ]);
  }

  //to encrpty Password
  public encrptyPassword(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Encryptwallet, [encrypt.password])
  }
  
  // Enable staking
  public enableStaking(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Walletpassphrase, [
      encrypt.password,
      0,
      encrypt.stakeOnly
    ])
  } 

  // wallet pass phrase
  public walletpassphrase(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Walletpassphrase, [
      encrypt.password,
      this.unlockTimeout,
      encrypt.stakeOnly
    ])
  } 

  // wallet pass phrase
  public walletpassphrasechange(encrypt : IPassword): Observable<any>{
    return this._rpc.call(ApiEndpoints.Walletpassphrasechange, [
      encrypt.password])
  }
  
  // unghost amount address
  public unghostAmount(info : IUnGhostAmount): Observable<any> {
    if (info.address) {
      return this._rpc.call(ApiEndpoints.UnGhostAmount, [info.amount, info.address]);
    }
    return this._rpc.call(ApiEndpoints.UnGhostAmount, [info.amount])
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

  //stop the nixd
  stop(): void {
    this._rpc.call(ApiEndpoints.StopNixd);
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

// to deposit amount
  public amountDeposit(deposit : IDepostAmount): Observable<any> {
    return this._rpc.call(ApiEndpoints.GhostAmount, [deposit.amount]);
  }

  //get historical data
  public getHistoricalData(vs_currency: string, days): Observable<any> {
    return this.http.request(ApiEndpoints.NIXHitoryUrl + 'vs_currency=' + vs_currency + '&days=' + days);
  }

  //get market data
  public getMarketData(vs_currency, ids): Observable<any> {
    return this.http.request(ApiEndpoints.GetMarketInfo + 'vs_currency=' + vs_currency + '&ids=' + ids);
  }
}
