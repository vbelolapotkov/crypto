import {
  serializeParams,
  buildRequestUrl,
} from '../../../src/lib/bybit/requestUtils';

describe('serializeParams', () => {
  it('should serialize an empty object to empty string', () => {
    expect(serializeParams({})).toBe('');
  });

  it('should serialize a simple object with string values', () => {
    const params = {
      name: 'test',
      value: 'example',
    };
    expect(serializeParams(params)).toBe('name=test&value=example');
  });

  it('should encode special characters in values', () => {
    const params = {
      query: 'hello world',
      special: '!@#$%^&*()',
      url: 'https://example.com',
    };
    expect(serializeParams(params)).toBe(
      'query=hello%20world&special=!%40%23%24%25%5E%26*()&url=https%3A%2F%2Fexample.com',
    );
  });

  it('should handle numbers and booleans', () => {
    const params = {
      count: 42,
      active: true,
      price: 99.99,
    };
    expect(serializeParams(params)).toBe('count=42&active=true&price=99.99');
  });
});

describe('buildRequestUrl', () => {
  const baseURL = 'https://api.example.com';
  const path = '/v1/orders';

  it('should build URL without query parameters', () => {
    expect(buildRequestUrl(baseURL, path, '')).toBe(
      'https://api.example.com/v1/orders',
    );
  });

  it('should build URL with query parameters', () => {
    const query = 'limit=10&offset=20';
    expect(buildRequestUrl(baseURL, path, query)).toBe(
      'https://api.example.com/v1/orders?limit=10&offset=20',
    );
  });

  it('should handle paths with or without leading slash', () => {
    const pathWithoutSlash = 'v1/orders';
    expect(buildRequestUrl(baseURL, pathWithoutSlash, '')).toBe(
      'https://api.example.com/v1/orders',
    );
  });

  it('should handle base URLs with or without trailing slash', () => {
    const baseURLWithSlash = 'https://api.example.com/';
    expect(buildRequestUrl(baseURLWithSlash, path, '')).toBe(
      'https://api.example.com//v1/orders',
    );
  });
});
