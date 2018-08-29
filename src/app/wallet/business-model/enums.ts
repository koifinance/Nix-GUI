export enum TxType {
  PUBLIC = 'part',
  BLIND = 'blind',
  ANON = 'anon'
}

export enum payType {
  sendPayment = 'sendpayment'
}

export enum ApiEndpoints {
  SendTypeTo = 'sendtoaddress',
  ListStealthAddresses = 'liststealthaddresses',
  FilterTransactions = 'filtertransactions',
  ListTransactions = 'listtransactions',
  GetWalletInfo = 'getwalletinfo'
}
