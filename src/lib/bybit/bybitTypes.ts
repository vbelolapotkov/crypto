export type ByBitApiResponse<T> = {
  retCode: number;
  retMsg: string;
  extExtInfo: object;
  result: T;
  time: number;
};

export type ByBitWalletBalance = {
  list: Array<{
    totalEquity: number;
    accountIMRate: number;
    totalMarginBalance: number;
    totalInitialMargin: number;
    accountType: string;
    totalAvailableBalance: number;
    accountMMRate: number;
    totalPerpUPL: number;
    totalWalletBalance: number;
    accountLTV: number;
    totalMaintenanceMargin: number;
    coin: Array<ByBitWalletCoin>;
  }>;
};

export type ByBitWalletCoin = {
  availableToBorrow: string;
  bonus: string;
  accruedInterest: string;
  availableToWithdraw: string;
  totalOrderIM: string;
  equity: string;
  totalPositionMM: string;
  usdValue: string;
  unrealisedPnl: string;
  collateralSwitch: boolean;
  spotHedgingQty: string;
  borrowAmount: string;
  totalPositionIM: string;
  walletBalance: string;
  cumRealisedPnl: string;
  locked: string;
  marginCollateral: boolean;
  coin: string;
};

export type ByBitSignatureParams = {
  query: string;
  apiKey: string;
  timestamp: number;
  recvWindow: number;
  jsonBody?: string;
};

export type BybitApiConfig = {
  apiKey: string;
  apiSecret: string;
  testnet?: boolean;
};
