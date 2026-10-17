import test from 'node:test';
import assert from 'node:assert/strict';
import { VihatClient, EsmsClient, VihatValidationError } from '../dist/esm/index.js';

test('VihatClient initialization', async (t) => {
  await t.test('throws VihatValidationError if config is missing or invalid', () => {
    assert.throws(() => new VihatClient(), VihatValidationError);
    assert.throws(() => new VihatClient({ apiKey: '', secretKey: 'secret' }), VihatValidationError);
    assert.throws(() => new VihatClient({ apiKey: 'key', secretKey: '' }), VihatValidationError);
  });

  await t.test('creates instance with valid keys and default URLs', () => {
    const client = new VihatClient({
      apiKey: 'test-api-key',
      secretKey: 'test-secret-key',
    });

    assert.ok(client);
    assert.ok(client.sms);
    assert.ok(client.voice);
    assert.ok(client.zalo);
    assert.ok(client.viber);
  });

  await t.test('EsmsClient is an alias for VihatClient', () => {
    const client = new EsmsClient({
      apiKey: 'test-api-key',
      secretKey: 'test-secret-key',
    });

    assert.ok(client instanceof VihatClient);
  });

  await t.test('custom endpoints and timeout configuration', () => {
    const client = new VihatClient({
      apiKey: 'test-api-key',
      secretKey: 'test-secret-key',
      baseUrl: 'https://custom.esms.vn',
      timeoutMs: 15000,
    });

    assert.ok(client);
  });
});
