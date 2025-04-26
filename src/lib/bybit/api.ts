// There is a Node SDK available, maybe use it later: https://github.com/tiagosiebler/bybit-api

import { signMessage } from './cryptoUtils';
import { serializeParams, buildRequestUrl } from './requestUtils';
import config from '../../config/config';
import {
  ByBitApiResponse,
  ByBitWalletBalance,
  ByBitSignatureParams,
  BybitApiConfig,
} from './bybitTypes';

// Basic steps:
// Calculate the string you want to sign as follows: For GET requests: timestamp + API key + recv_window + queryString For POST requests: timestamp + API key + recv_window + jsonBodyString
// Use the HMAC_SHA256 or RSA_SHA256 algorithm to sign the string in step 1, and convert it to a lowercase HEX string for HMAC_SHA256, or base64 for RSA_SHA256 to obtain the string value of your signature.
// Add your signature to X-BAPI-API-KEY header send the HTTP request. You can refer to examples below for more info

// Make it async from the very beginning, so we can use streams for efficiency later.
async function getSignature(params: ByBitSignatureParams, apiSecret: string) {
  const { query, apiKey, timestamp, recvWindow, jsonBody } = params;
  let baseString = `${timestamp}${apiKey}${recvWindow}${query}`;
  if (jsonBody) {
    baseString += jsonBody;
  }
  return signMessage(baseString, apiSecret);
}

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

  async getWalletBalance(): Promise<ByBitApiResponse<ByBitWalletBalance>> {
    const path = '/v5/account/wallet-balance';
    // TODO: add support for individual coins
    const params = {
      accountType: 'UNIFIED',
    };

    return this.handleRequest(path, params) as Promise<
      ByBitApiResponse<ByBitWalletBalance>
    >;
  }

  private async handleRequest(
    path: string,
    params: object,
  ): Promise<ByBitApiResponse<object>> {
    const { url, requestOptions } = await this.prepareRequest(path, params);
    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  private async prepareRequest(path: string, params: object = {}) {
    const query = serializeParams(params);
    const recvWindow = 5000;
    const timestamp = Date.now();
    const signature = await getSignature(
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
}

export default new ByBitApi({
  apiKey: config.bybitApiKey,
  apiSecret: config.bybitApiSecret,
});
