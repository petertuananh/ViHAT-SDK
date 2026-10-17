import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VihatClient,
  VihatApiError,
  VihatHttpError,
  VihatTimeoutError,
} from '../dist/esm/index.js';
import { createMockFetch, jsonResponse } from './helpers.mjs';

test('Error handling in VihatClient', async (t) => {
  const client = new VihatClient({
    apiKey: 'my-api-key',
    secretKey: 'my-secret-key',
    timeoutMs: 100,
  });

  await t.test('throws VihatApiError when CodeResult is not 100 or 200', async () => {
    const mock = createMockFetch(async () => {
      return jsonResponse({
        CodeResult: '101',
        ErrorMessage: 'Sai ApiKey hoac SecretKey',
      });
    });

    try {
      await assert.rejects(
        async () => client.sendSms({ phone: '0901234567', content: 'test', brandname: 'Test' }),
        (err) => {
          assert.ok(err instanceof VihatApiError);
          assert.equal(err.resultCode, '101');
          assert.ok(err.message.includes('Sai ApiKey'));
          return true;
        }
      );
    } finally {
      mock.restore();
    }
  });

  await t.test('throws VihatApiError when CodeResponse indicates error', async () => {
    const mock = createMockFetch(async () => {
      return jsonResponse({
        CodeResponse: '103',
        Balance: 0,
        UserID: '0',
      });
    });

    try {
      await assert.rejects(
        async () => client.getBalance(),
        (err) => {
          assert.ok(err instanceof VihatApiError);
          assert.equal(err.resultCode, '103');
          assert.ok(err.message.includes('Số dư tài khoản không đủ'));
          return true;
        }
      );
    } finally {
      mock.restore();
    }
  });

  await t.test('throws VihatHttpError on HTTP 500 status', async () => {
    const mock = createMockFetch(async () => {
      return new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    try {
      await assert.rejects(
        async () => client.getBalance(),
        (err) => {
          assert.ok(err instanceof VihatHttpError);
          assert.equal(err.statusCode, 500);
          return true;
        }
      );
    } finally {
      mock.restore();
    }
  });

  await t.test('throws VihatTimeoutError when request times out', async () => {
    const mock = createMockFetch(async () => {
      // Simulate slow response exceeding timeoutMs (100ms)
      await new Promise((resolve) => setTimeout(resolve, 250));
      return jsonResponse({ CodeResponse: '100', Balance: 100, UserID: '1' });
    });

    try {
      await assert.rejects(
        async () => client.getBalance(),
        (err) => {
          assert.ok(err instanceof VihatTimeoutError);
          assert.equal(err.timeoutMs, 100);
          return true;
        }
      );
    } finally {
      mock.restore();
    }
  });
});
