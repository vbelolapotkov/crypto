import { signMessage } from '../../../src/lib/bybit/cryptoUtils';

describe('signMessage', () => {
  it('should sign a simple message correctly', async () => {
    const message = 'Hello, World!';
    const secret = 'mySecret';
    const signature = await signMessage(message, secret);
    // Known correct signature for this input, verified with external HMAC-SHA256 tool
    expect(signature).toBe(
      '2ae3e087788e9c4400bb1aec66c06e2b15f0e0a9a31ceb6b23b25e0d983c0fb4',
    );
  });

  it('should sign an empty message', async () => {
    const message = '';
    const secret = 'mySecret';
    const signature = await signMessage(message, secret);
    // Known correct signature for empty message
    expect(signature).toBe(
      '3a0dae80e8af6c3fffdcbb0ec47ed427fe8ec1fbc150e2b148f33b804e77627d',
    );
  });

  it('should sign a message with special characters', async () => {
    const message = '!@#$%^&*()_+';
    const secret = 'mySecret';
    const signature = await signMessage(message, secret);
    // Known correct signature for special characters
    expect(signature).toBe(
      '0af26729b72a0056fb3a2f1dfa3f4bc2d99072c963e430344f3b9721d4723746',
    );
  });

  it('should produce different signatures for different secrets with same message', async () => {
    const message = 'Same Message';
    const signature1 = await signMessage(message, 'secret1');
    const signature2 = await signMessage(message, 'secret2');
    expect(signature1).not.toBe(signature2);
  });

  it('should produce different signatures for different messages with same secret', async () => {
    const secret = 'sameSecret';
    const signature1 = await signMessage('Message1', secret);
    const signature2 = await signMessage('Message2', secret);
    expect(signature1).not.toBe(signature2);
  });

  it('should always produce the same signature for the same input', async () => {
    const message = 'Consistent Message';
    const secret = 'consistentSecret';
    const signature1 = await signMessage(message, secret);
    const signature2 = await signMessage(message, secret);
    expect(signature1).toBe(signature2);
  });
});
