export class CalculationsService {
    
    constructor() {
    }

    //To calculate the fee
    public getFee(fee, amount) {
        let fees = (fee / 100) * amount;
        return fees;
    }

    //To calculate the total amount
    public getTotal(amount, fees) {
        let total = amount + fees;
        return total;
    }

    // to convert amount 
    public getCovertedamount(amount, byconvertAmount) {
        let Convertedamount = amount*byconvertAmount;
        return Convertedamount;
    }
}