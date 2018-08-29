import { TxType } from "./enums";


// main wallet infor ui
export interface IWalletInfo {
    id: string;
    walletBalance: number;
    totalBalance: number;
    pendingBalance: number;
}

export class WalletInfo implements IWalletInfo {

    id: string;
    walletBalance: number;
    totalBalance: number;
    pendingBalance: number;

    constructor(data?: IWalletInfo) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.walletBalance = data["walletBalance"];
            this.totalBalance = data["totalBalance"];
            this.pendingBalance = data["pendingBalance"];
        }
    }

    static fromJS(data: any): WalletInfo {
        let result = new WalletInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["walletBalance"] = this.walletBalance;
        data["totalBalance"] = this.totalBalance;
        data["pendingBalance"] = this.pendingBalance;
        return data;
    }
}

//send wallet to nix
export interface IWalletSendToNix {
    id: string;
    amount: number;
    address: string;
    saveForFuture: boolean;
}

export class WalletSendToNix implements IWalletSendToNix {

    id: string;
    amount: number;
    address: string;
    saveForFuture: boolean;

    constructor(data?: IWalletSendToNix) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.amount = data["amount"];
            this.address = data["address"];
            this.saveForFuture = data["saveForFuture"];
        }
    }

    static fromJS(data: any): WalletSendToNix {
        let result = new WalletSendToNix();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["amount"] = this.amount;
        data["address"] = this.address;
        data["saveForFuture"] = this.saveForFuture;
        return data;
    }
}


//recieve nix to wallet
export interface IRecieveNixToWallet {
    id: string;
    mom: string;
    binance: string;
    jackieboy: string;
}

export class RecieveNixToWallet implements IRecieveNixToWallet {

    id: string;
    mom: string;
    binance: string;
    jackieboy: string;

    constructor(data?: IRecieveNixToWallet) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.mom = data["mom"];
            this.binance = data["binance"];
            this.jackieboy = data["jackieboy"];
        }
    }

    static fromJS(data: any): RecieveNixToWallet {
        let result = new RecieveNixToWallet();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["mom"] = this.mom;
        data["binance"] = this.binance;
        data["jackieboy"] = this.jackieboy;
        return data;
    }
}


//transaction class - have to check these props
export interface ITransactionBuilder {
    id: string;
    input: TxType;
    output: TxType;
    toAddress: string;
    toLabel: string;
    address: string;
    amount: number;
    comment: string;
    commentTo: string;
    narration: string;
    numsignatures: number;
    validAddress: boolean;
    validAmount: boolean;
    isMine: boolean;
    currency: string;
    ringsize: number;
    subtractFeeFromAmount: boolean;
    estimateFeeOnly: boolean;
}

export class TransactionBuilder implements ITransactionBuilder {

    id: string;
    input: TxType = TxType.PUBLIC;
    output: TxType = TxType.PUBLIC;
    toAddress: string;
    toLabel: string;
    address: string;
    amount: number;
    comment: string;
    commentTo: string;
    narration: string;
    numsignatures: number = 1;
    validAddress: boolean;
    validAmount: boolean;
    isMine: boolean;
    currency: string = 'part';
    ringsize: number = 8;
    subtractFeeFromAmount: boolean = false;
    estimateFeeOnly: boolean = true;

    constructor(data?: ITransactionBuilder) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = null;
            this.input = data["input"];
            this.output = data["output"];
            this.toAddress = data["toAddress"];
            this.toLabel = data["toLabel"];
            this.amount = data["amount"];
            this.comment = data["comment"];
            this.commentTo = data["commentTo"];
            this.narration = data["narration"];
            this.numsignatures = data["numsignatures"];
            this.validAddress = data["validAddress"];
            this.validAmount = data["validAmount"];
            this.isMine = data["isMine"];
            this.currency = data["currency"];
            this.ringsize = data["ringsize"];
            this.subtractFeeFromAmount = data["subtractFeeFromAmount"];
            this.estimateFeeOnly = data["estimateFeeOnly"];
        }
    }

    static fromJS(data: any): TransactionBuilder {
        let result = new TransactionBuilder();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};

        data["id"] = this.id;
        data["input"] = this.input;
        data["output"] = this.output;
        data["toAddress"] = this.toAddress;
        data["toLabel"] = this.toLabel;
        data["address"] = this.address;
        data["amount"] = this.amount;
        data["comment"] = this.comment;
        data["commentTo"] = this.commentTo;
        data["narration"] = this.narration;
        data["numsignatures"] = this.numsignatures;
        data["validAddress"] = this.validAddress;
        data["validAmount"] = this.validAmount;
        data["isMine"] = this.isMine;
        data["currency"] = this.currency;
        data["ringsize"] = this.ringsize;
        data["subtractFeeFromAmount"] = this.subtractFeeFromAmount;
        data["estimateFeeOnly"] = this.estimateFeeOnly;

        return data;
    }
}

