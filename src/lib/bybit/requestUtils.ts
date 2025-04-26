export function serializeParams(params: object) {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

export function buildRequestUrl(baseURL: string, path: string, query: string) {
  return query ? `${baseURL}${path}?${query}` : `${baseURL}${path}`;
}
