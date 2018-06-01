export class Price {

  id: number;
  name: string;
  symbol: string;
  rank: number;
  currentSupply: number;
  maxSupply: number;
  price: number;
  dailyVolume: number;
  marketCap: number;
  hourlyChange: number;
  dailyChange: number;
  weeklyChange: number;
  btcPrice: number;
  btcDailyVolume: number;
  btcMarketCap: number;
  btcHourlyChange: number;
  btcDailyChange: number;
  btcWeeklyChange: number;

  constructor(json: any) {
    this.id = json.id;
    this.name = json.name;
    this.symbol = json.symbol;
    this.rank = json.rank;
    this.currentSupply = json.circulating_supply;
    this.maxSupply = json.max_supply;
    this.price = json.quotes.USD.price.toFixed(2);
    this.dailyVolume = json.quotes.USD.volume_24h;
    this.marketCap = json.quotes.USD.market_cap;
    this.hourlyChange = json.quotes.USD.percent_change_1h;
    this.dailyChange = json.quotes.USD.percent_change_24h;
    this.weeklyChange = json.quotes.USD.percent_change_7d;
    this.btcPrice = json.quotes.BTC.price.toFixed(8);
    this.btcDailyVolume = json.quotes.BTC.volume_24h;
    this.btcMarketCap = json.quotes.BTC.market_cap;
    this.btcHourlyChange = json.quotes.BTC.percent_change_1h;
    this.btcDailyChange = json.quotes.BTC.percent_change_24h;
    this.btcWeeklyChange = json.quotes.BTC.percent_change_7d;
  }

}
