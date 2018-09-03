export enum TxType {
  PUBLIC = 'part',
  BLIND = 'blind',
  ANON = 'anon'
}

export enum payType {
  sendPayment = 'sendpayment'
}

export enum typeOfAddresses {
  Send = 'send',
  Receive = 'receive'
}

export enum categories {
  Send = 'send',
  Receive = 'receive',
  Node = 'node'
}

export enum message {
  walletMessage = 'Failed to get wallet information',
  recentTransactionMessage = 'Failed to get recent transaction',
  transactionMessage = 'Failed to get transaction, ',
  bitcoinpriceMessage  = 'Failed to get bit coin price,'
}

export enum ApiEndpoints {
  SendToAddress = 'sendtoaddress',
  ListStealthAddresses = 'liststealthaddresses',
  FilterTransactions = 'filtertransactions',
  ListTransactions = 'listtransactions',
  GetWalletInfo = 'getwalletinfo',
  ReceivedNix = 'getaddressesbyaccount',
  AddNode = 'addnode',
  ListTransaction = "listTransaction",
  GetTrasaction = "gettransaction",
  GetBalance = "getbalance",
  AddressBook = "manageaddressbook",
  ValidadeAddress = "validateaddress",
  Filteraddresses = "filteraddresses",
  Filtertransactions  = "filtertransactions",
  Encryptwallet = "encryptwallet",
  Walletpassphrase = "walletpassphrase",
  Walletpassphrasechange = 'walletpassphrasechange' ,
  Mnemonic = "mnemonic",
  Extkeygenesisimport = "extkeygenesisimport",
  GetBtc = 'https://api.coinmarketcap.com/v2/ticker/2991/?convert=BTC',
  Getblockchaininfo = 'getblockchaininfo'
}
