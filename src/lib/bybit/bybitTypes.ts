export type ByBitApiResponse<T> = {
  retCode: number;
  retMsg: string;
  extExtInfo: object;
  result: T;
  time: number;
};

export type ByBitWalletBalanceResult = {
  list: Array<ByBitWalletBalance>;
};

export type ByBitWalletBalance = {
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
};

export type ByBitWalletCoin = {
  availableToBorrow: number;
  bonus: string;
  accruedInterest: string;
  availableToWithdraw: number;
  totalOrderIM: string;
  equity: string;
  totalPositionMM: string;
  usdValue: number;
  unrealisedPnl: number;
  collateralSwitch: boolean;
  spotHedgingQty: number;
  borrowAmount: number;
  totalPositionIM: number;
  walletBalance: number;
  cumRealisedPnl: number;
  locked: number;
  marginCollateral: boolean;
  coin: string;
};

export type ByBitAllCoinsBalanceResult = {
  memberId: string;
  accountType: string;
  balance: Array<ByBitCoinBalance>;
};

export type ByBitCoinBalance = {
  coin: string;
  transferableBalance: number;
  walletBalance: number;
  bonus: string;
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
