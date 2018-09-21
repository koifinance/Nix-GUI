import { Amount, DateFormatter } from '../utils';

export class Transaction {

  account: string;
  address: string;
  amount: number;
  bip125_replaceable: string;
  category: string;
  is_unghosted: boolean;
  label: string;
  time: number;
  timereceived: number;
  txid: string;
  vout: number;

  /* conflicting txs */
  walletconflicts: any[];

  /* block info */
  blockhash: string;
  blockindex: number;
  blocktime: number;
  confirmations: number;

  constructor(json: any) {
    /* transactions */
    this.account = json.account;
    this.address = json.address;
    this.amount = json.amount;
    this.bip125_replaceable = json['bip125-replaceable'];
    this.category = json.category;
    this.is_unghosted = json.is_unghosted;
    this.label = json.label;
    this.time = json.time;
    this.timereceived = json.timereceived;
    this.txid = json.txid;
    this.vout = json.vout;

    /* conflicting txs */
    this.walletconflicts = json.walletconflicts;

    /* block info */
    this.blockhash = json.blockhash;
    this.blockindex = json.blockindex;
    this.blocktime = json.blocktime;
    this.confirmations = json.confirmations;
  }

  public getAddress(): string {
    if (this.address === undefined) {
      return this.address;
    }
    return this.address;
  }

  public getExpandedTransactionID(): string {
    return this.txid + this.getAmountObject().getAmount() + this.category;
  }

  public getConfirmationCount(): string {
    if (this.confirmations > 12) {
      return '12+';
    }
    return this.confirmations.toString();
  }

  /* Amount stuff */
  public getAmount(): number {
    if (this.category === 'internal_transfer') {
      // add all elements in output array ( but exclude vout === 65535)
      // todo: check assumption that we own all outputs?
      // only use fake output to determine internal transfer
    } else {
      return +this.amount;
    }
  }

  /** Turns amount into an Amount Object */
  public getAmountObject(): Amount {
    return new Amount(this.getAmount());
  }

  /**
   * Calculates the actual amount that was transfered, including the fee
   * todo: fee is not defined in normal receive tx, wut?
   */
  public getNetAmount() {
    const amount: number = +this.getAmountObject().getAmount();

    /* If fee undefined then just return amount */
    // if (this.fee === undefined) {
    //   return amount;
    // } else if (amount < 0) {
    //   return new Amount(+amount + (+this.fee)).getAmount();
    // } else {
    //   return new Amount(+amount - (+this.fee)).getAmount();
    // }
  }

  public getAmountString(): string {
    return '';
  }

  /* Date stuff */
  public getDateString(): string {
    return new DateFormatter(new Date(this.time * 1000)).dateFormatter();
  }

  public getDate(): Date {
    return new Date(this.time * 1000);
  }

  public getShortMonth(): string {
    return new Date(this.time * 1000).toLocaleDateString('en-use', { month: 'short' });
  }

  public getDayOfMonth(): string {
    const day = new Date(this.time * 1000).getDate();
    return day < 10 ? '0' + day : day.toString();
  }

  public getFullYear(): string {
    return new Date(this.time * 1000).getFullYear().toString();
  }

  /* Narration */
  public getNarration() {
    // for (const key in this.outputs) {
    //   if (this.outputs[key] && this.outputs[key].narration) {
    //     return this.outputs[key].narration;
    //   }
    // }
    // return false;
  }
}
