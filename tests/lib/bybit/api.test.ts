import { ByBitApi } from '../../../src/lib/bybit/api';
import { signMessage } from '../../../src/lib/bybit/cryptoUtils';
import {
  serializeParams,
  buildRequestUrl,
} from '../../../src/lib/bybit/requestUtils';
import {
  ByBitApiResponse,
  ByBitWalletBalance,
} from '../../../src/lib/bybit/bybitTypes';
import axios from 'axios';

// Only mock config to avoid using real API credentials
jest.mock('../../../src/config/config', () => ({
  bybitApiSecret: 'test-api-secret',
}));

// Mock axios instead of fetch
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('ByBitApi', () => {
  const mockApiKey = 'test-api-key';
  const mockApiSecret = 'test-api-secret';
  const mockTimestamp = 1234567890000;

  let api: ByBitApi;

  beforeEach(() => {
    // Reset axios mock
    jest.clearAllMocks();

    // Mock Date.now()
    jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

    // Create a new instance of ByBitApi for each test
    api = new ByBitApi({
      apiKey: mockApiKey,
      apiSecret: mockApiSecret,
    });
  });

  describe('constructor', () => {
    it('should initialize with mainnet URL by default', () => {
      expect(api['baseURL']).toBe('https://api.bybit.com');
    });

    it('should initialize with testnet URL when testnet is true', () => {
      api = new ByBitApi({
        apiKey: mockApiKey,
        apiSecret: mockApiSecret,
        testnet: true,
      });
      expect(api['baseURL']).toBe('https://api-testnet.bybit.com');
    });
  });

  describe('getWalletBalance', () => {
    const mockResponse: ByBitApiResponse<ByBitWalletBalance> = {
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
            coin: [],
          },
        ],
      },
      time: mockTimestamp,
      extExtInfo: {},
    };

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockResponse });
    });

    it('should make a request with correct parameters and headers', async () => {
      await api.getWalletBalance();

      const params = { accountType: 'UNIFIED' };
      const serializedParams = serializeParams(params);
      const expectedUrl = buildRequestUrl(
        'https://api.bybit.com',
        '/v5/account/wallet-balance',
        serializedParams,
      );

      // Calculate expected signature
      const signatureMessage = `${mockTimestamp}${mockApiKey}5000${serializedParams}`;
      const expectedSignature = await signMessage(
        signatureMessage,
        mockApiSecret,
      );

      // Verify axios was called with correct URL and headers
      expect(mockAxios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          'X-BAPI-SIGN-TYPE': '2',
          'X-BAPI-API-KEY': mockApiKey,
          'X-BAPI-RECV-WINDOW': '5000',
          'X-BAPI-TIMESTAMP': mockTimestamp.toString(),
          'X-BAPI-SIGN': expectedSignature,
        },
      });
    });

    it('should return the wallet balance response', async () => {
      const response = await api.getWalletBalance();
      expect(response).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const errorResponse = {
        retCode: 10001,
        retMsg: 'Invalid API key',
        result: null,
        time: mockTimestamp,
        extExtInfo: {},
      };

      mockAxios.get.mockResolvedValue({ data: errorResponse });

      const response = await api.getWalletBalance();
      expect(response).toEqual(errorResponse);
    });

    it('should handle network errors', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(api.getWalletBalance()).rejects.toThrow('Network error');
    });
  });
});
