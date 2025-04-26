import {
  ByBitApiResponse,
  ByBitWalletBalanceResult,
  ByBitAllCoinsBalanceResult,
} from '../../../../src/lib/bybit/bybitTypes';

export const mockTimestamp = 1234567890000;

export const mockUnifiedResponse: ByBitApiResponse<ByBitWalletBalanceResult> = {
  retCode: 0,
  retMsg: 'OK',
  result: {
    list: [
      {
        totalEquity: 1000,
        accountIMRate: 0.1,
        totalMarginBalance: 900,
        totalInitialMargin: 100,
        accountType: 'UNIFIED',
        totalAvailableBalance: 800,
        accountMMRate: 0.2,
        totalPerpUPL: 50,
        totalWalletBalance: 950,
        accountLTV: 0.5,
        totalMaintenanceMargin: 80,
        coin: [
          {
            coin: 'BTC',
            walletBalance: 1.5,
            usdValue: 45000,
            availableToBorrow: 0,
            bonus: '0',
            accruedInterest: '0',
            availableToWithdraw: 1.5,
            totalOrderIM: '0',
            equity: '45000',
            totalPositionMM: '0',
            totalPositionIM: 0,
            unrealisedPnl: 0,
            cumRealisedPnl: 0,
            locked: 0,
            borrowAmount: 0,
            spotHedgingQty: 0,
            collateralSwitch: true,
            marginCollateral: true,
          },
          {
            coin: 'ETH',
            walletBalance: 10,
            usdValue: 20000,
            availableToBorrow: 0,
            bonus: '0',
            accruedInterest: '0',
            availableToWithdraw: 10,
            totalOrderIM: '0',
            equity: '20000',
            totalPositionMM: '0',
            totalPositionIM: 0,
            unrealisedPnl: 0,
            cumRealisedPnl: 0,
            locked: 0,
            borrowAmount: 0,
            spotHedgingQty: 0,
            collateralSwitch: true,
            marginCollateral: true,
          },
        ],
      },
    ],
  },
  time: mockTimestamp,
  extExtInfo: {},
};

export const mockFundingResponse: ByBitApiResponse<ByBitAllCoinsBalanceResult> =
  {
    retCode: 0,
    retMsg: 'OK',
    result: {
      memberId: 'test-member',
      accountType: 'FUND',
      balance: [
        {
          coin: 'USDT',
          walletBalance: 1000,
          transferableBalance: 1000,
          bonus: '0',
        },
        {
          coin: 'BTC',
          walletBalance: 0.5,
          transferableBalance: 0.5,
          bonus: '0',
        },
      ],
    },
    time: mockTimestamp,
    extExtInfo: {},
  };

export const mockErrorResponse = {
  retCode: 10001,
  retMsg: 'Invalid API key',
  result: null,
  time: mockTimestamp,
  extExtInfo: {},
};

export const mockExpectedSuccessResponse = {
  retCode: 0,
  retMsg: 'Success',
  data: {
    unified: {
      totalEquity: 1000,
      totalAvailableBalance: 800,
      coins: [
        {
          coin: 'BTC',
          balance: 1.5,
          usdValue: 45000,
        },
        {
          coin: 'ETH',
          balance: 10,
          usdValue: 20000,
        },
      ],
    },
    funding: {
      coins: [
        {
          coin: 'USDT',
          balance: 1000,
        },
        {
          coin: 'BTC',
          balance: 0.5,
        },
      ],
    },
  },
};
