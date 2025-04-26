// There is a Node SDK available, maybe use it later: https://github.com/tiagosiebler/bybit-api

import axios from 'axios';
import { signMessage } from './cryptoUtils';
import { serializeParams, buildRequestUrl } from './requestUtils';
import config from '../../config/config';
import {
  ByBitApiResponse,
  ByBitSignatureParams,
  BybitApiConfig,
  ByBitWalletBalanceResult,
  ByBitAllCoinsBalanceResult,
} from './bybitTypes';

type ApiResponse<T> = {
  retCode: number;
  retMsg: string;
  data?: T;
};
type WalletBalance = {
  unified: {
    totalEquity: number;
    totalAvailableBalance: number;
    coins: Array<CoinBalance>;
  };
  funding: {
    coins: Array<CoinBalance>;
  };
};
type CoinBalance = {
  coin: string;
  balance: number;
  usdValue?: number;
};
export class ByBitApi {
  private baseURL: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(apiConfig: BybitApiConfig) {
    this.apiKey = apiConfig.apiKey;
    this.baseURL = apiConfig.testnet
      ? 'https://api-testnet.bybit.com'
      : 'https://api.bybit.com';
    this.apiSecret = apiConfig.apiSecret;
  }

  async getWalletBalance(): Promise<ApiResponse<WalletBalance>> {
    const unifiedPath = '/v5/account/wallet-balance';
    const unifiedParams = {
      accountType: 'UNIFIED',
    };

    const fundPath = '/v5/asset/transfer/query-account-coins-balance';
    const fundParams = {
      accountType: 'FUND',
    };

    const [unifiedResponse, fundResponse] = await Promise.all([
      this.handleRequest(unifiedPath, unifiedParams),
      this.handleRequest(fundPath, fundParams),
    ]);

    const retCode = Math.max(unifiedResponse.retCode, fundResponse.retCode);
    const retMsg = retCode === 0 ? 'Success' : 'Failed';

    // Return early if there's an error
    if (retCode !== 0) {
      return {
        retCode,
        retMsg,
      };
    }

    const unifiedWallet = (<ByBitApiResponse<ByBitWalletBalanceResult>>(
      unifiedResponse
    )).result?.list?.[0] ?? {
      totalEquity: 0,
      totalAvailableBalance: 0,
      coin: [],
    };

    const fundingWallet =
      (<ByBitApiResponse<ByBitAllCoinsBalanceResult>>fundResponse).result
        ?.balance ?? [];

    // USD value is not available for funding wallet.
    // TODO: fetch market rates to estimate usdValues.
    const data: WalletBalance = {
      unified: {
        totalEquity: unifiedWallet.totalEquity,
        totalAvailableBalance: unifiedWallet.totalAvailableBalance,
        coins: (unifiedWallet.coin ?? [])
          .map((unifiedCoin) => ({
            coin: unifiedCoin.coin,
            balance: unifiedCoin.walletBalance,
            usdValue: unifiedCoin.usdValue,
          }))
          .filter((coin) => coin.balance > 0),
      },
      funding: {
        coins: fundingWallet
          .map((coin) => ({
            coin: coin.coin,
            balance: coin.walletBalance,
          }))
          .filter((coin) => coin.balance > 0),
      },
    };

    return {
      retCode,
      retMsg,
      data,
    };
  }

  private async handleRequest(
    path: string,
    params: object,
  ): Promise<ByBitApiResponse<object>> {
    const { url, requestOptions } = await this.prepareRequest(path, params);
    const response = await axios.get(url, requestOptions);
    return response.data;
  }

  private async prepareRequest(path: string, params: object = {}) {
    const query = serializeParams(params);
    const recvWindow = 5000;
    const timestamp = Date.now();
    const signature = await this.getSignature(
      { query, apiKey: this.apiKey, timestamp, recvWindow },
      config.bybitApiSecret,
    );
    const url = buildRequestUrl(this.baseURL, path, query);

    const headers = {
      'X-BAPI-SIGN-TYPE': '2',
      'X-BAPI-API-KEY': this.apiKey,
      'X-BAPI-RECV-WINDOW': recvWindow.toString(),
      'X-BAPI-TIMESTAMP': timestamp.toString(),
      'X-BAPI-SIGN': signature,
    };
    return { url, requestOptions: { headers } };
  }

  // Make it async from the very beginning, so we can use streams for efficiency later.
  private async getSignature(params: ByBitSignatureParams, apiSecret: string) {
    // Basic steps from the docs:
    // Calculate the string you want to sign as follows: For GET requests: timestamp + API key + recv_window + queryString For POST requests: timestamp + API key + recv_window + jsonBodyString
    // Use the HMAC_SHA256 or RSA_SHA256 algorithm to sign the string in step 1, and convert it to a lowercase HEX string for HMAC_SHA256, or base64 for RSA_SHA256 to obtain the string value of your signature.
    // Add your signature to X-BAPI-API-KEY header send the HTTP request. You can refer to examples below for more info
    const { query, apiKey, timestamp, recvWindow, jsonBody } = params;
    let baseString = `${timestamp}${apiKey}${recvWindow}${query}`;
    if (jsonBody) {
      baseString += jsonBody;
    }
    return signMessage(baseString, apiSecret);
  }
}

export default new ByBitApi({
  apiKey: config.bybitApiKey,
  apiSecret: config.bybitApiSecret,
});
