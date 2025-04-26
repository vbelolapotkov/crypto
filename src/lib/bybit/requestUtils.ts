export function serializeParams(params: object) {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

export function buildRequestUrl(baseURL: string, path: string, query: string) {
  // Ensure path starts with a forward slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return query
    ? `${baseURL}${normalizedPath}?${query}`
    : `${baseURL}${normalizedPath}`;
}
