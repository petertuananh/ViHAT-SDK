import test from 'node:test';
import assert from 'node:assert/strict';
import { VihatClient, VihatValidationError } from '../dist/esm/index.js';
import { createMockFetch, jsonResponse } from './helpers.mjs';

test('ViberService', async (t) => {
  const client = new VihatClient({
    apiKey: 'my-api-key',
    secretKey: 'my-secret-key',
  });

  await t.test('sendViberMessage() validates inputs', async () => {
    await assert.rejects(
      async () => client.sendViberMessage({ phone: '', brandname: 'Brand' }),
      VihatValidationError
    );
    await assert.rejects(
      async () => client.sendViberMessage({ phone: '0901234567', brandname: '' }),
      VihatValidationError
    );
    await assert.rejects(
      async () => client.sendViberMessage({ phone: '0901234567', brandname: 'Brand' }),
      VihatValidationError
    );
  });

  await t.test('sendViberMessage() sends valid GET request', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendMultipleMessage_V4_get'));
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('Phone'), '0842090998');
      assert.equal(parsedUrl.searchParams.get('Brandname'), 'eSMS.vn');
      assert.equal(parsedUrl.searchParams.get('SmsType'), '23');
      assert.equal(parsedUrl.searchParams.get('Content'), 'Viber content test');
      assert.equal(parsedUrl.searchParams.get('OTTLabel'), 'View Now');
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'viber-msg-1',
      });
    });

    try {
      const res = await client.sendViberMessage({
        phone: '0842090998',
        brandname: 'eSMS.vn',
        content: 'Viber content test',
        ottLabel: 'View Now',
        ottUrl: 'https://example.com',
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'viber-msg-1');
    } finally {
      mock.restore();
    }
  });
});
