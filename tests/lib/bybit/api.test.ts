import { ByBitApi } from '../../../src/lib/bybit/api';
import { signMessage } from '../../../src/lib/bybit/cryptoUtils';
import {
  serializeParams,
  buildRequestUrl,
} from '../../../src/lib/bybit/requestUtils';
import axios from 'axios';
import {
  mockTimestamp,
  mockUnifiedResponse,
  mockFundingResponse,
  mockErrorResponse,
  mockExpectedSuccessResponse,
} from './__mocks__/mockData';

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
    beforeEach(() => {
      mockAxios.get.mockImplementation((url) => {
        if (url.includes('/v5/account/wallet-balance')) {
          return Promise.resolve({ data: mockUnifiedResponse });
        } else if (
          url.includes('/v5/asset/transfer/query-account-coins-balance')
        ) {
          return Promise.resolve({ data: mockFundingResponse });
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });
    });

    it('should make requests with correct parameters and headers', async () => {
      await api.getWalletBalance();

      const unifiedParams = { accountType: 'UNIFIED' };
      const fundParams = { accountType: 'FUND' };
      const serializedUnifiedParams = serializeParams(unifiedParams);
      const serializedFundParams = serializeParams(fundParams);

      const expectedUnifiedUrl = buildRequestUrl(
        'https://api.bybit.com',
        '/v5/account/wallet-balance',
        serializedUnifiedParams,
      );
      const expectedFundUrl = buildRequestUrl(
        'https://api.bybit.com',
        '/v5/asset/transfer/query-account-coins-balance',
        serializedFundParams,
      );

      // Calculate expected signatures
      const unifiedSignatureMessage = `${mockTimestamp}${mockApiKey}5000${serializedUnifiedParams}`;
      const fundSignatureMessage = `${mockTimestamp}${mockApiKey}5000${serializedFundParams}`;
      const expectedUnifiedSignature = await signMessage(
        unifiedSignatureMessage,
        mockApiSecret,
      );
      const expectedFundSignature = await signMessage(
        fundSignatureMessage,
        mockApiSecret,
      );

      // Verify axios was called with correct URLs and headers for both requests
      expect(mockAxios.get).toHaveBeenCalledWith(expectedUnifiedUrl, {
        headers: {
          'X-BAPI-SIGN-TYPE': '2',
          'X-BAPI-API-KEY': mockApiKey,
          'X-BAPI-RECV-WINDOW': '5000',
          'X-BAPI-TIMESTAMP': mockTimestamp.toString(),
          'X-BAPI-SIGN': expectedUnifiedSignature,
        },
      });

      expect(mockAxios.get).toHaveBeenCalledWith(expectedFundUrl, {
        headers: {
          'X-BAPI-SIGN-TYPE': '2',
          'X-BAPI-API-KEY': mockApiKey,
          'X-BAPI-RECV-WINDOW': '5000',
          'X-BAPI-TIMESTAMP': mockTimestamp.toString(),
          'X-BAPI-SIGN': expectedFundSignature,
        },
      });
    });

    it('should return combined wallet balance response', async () => {
      const response = await api.getWalletBalance();
      expect(response).toEqual(mockExpectedSuccessResponse);
    });

    it('should handle API errors', async () => {
      mockAxios.get.mockResolvedValue({ data: mockErrorResponse });

      const response = await api.getWalletBalance();
      expect(response.retCode).toBe(10001);
      expect(response.retMsg).toBe('Failed');
    });

    it('should handle network errors', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(api.getWalletBalance()).rejects.toThrow('Network error');
    });
  });
});
