import { Injectable } from "@angular/core";
import { Log } from 'ng2-logger';

@Injectable()
export class WalletLogService {

    log: any = new Log();
    constructor(name: string) {
        this.log = Log.create(name);      
    }

    create(message: string) {
        this.log.d(message);
    }
    error(message: string) {
        this.log.er(message);
    }
}