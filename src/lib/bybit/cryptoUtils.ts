import crypto from 'node:crypto';

/**
 * Sign a message using the HMAC_SHA256 algorithm
 * @param message - The message to sign
 * @param secret - The secret key to use for signing
 * @returns A promise that resolves to the signed message
 */
export function signMessage(message: string, secret: string) {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
  return Promise.resolve(signature);
}
