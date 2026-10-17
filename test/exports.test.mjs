import test from 'node:test';
import assert from 'node:assert/strict';

test('Subpath imports', async (t) => {
  await t.test('imports from constants', async () => {
    const { SmsType, SendStatus } = await import('../dist/esm/constants.js');
    assert.equal(SmsType.BRANDNAME_CSKH, 2);
    assert.equal(SendStatus.SENT, 5);
  });

  await t.test('imports from errors', async () => {
    const { VihatError, VihatApiError, VihatValidationError } = await import(
      '../dist/esm/errors.js'
    );
    assert.ok(VihatError);
    assert.ok(VihatApiError);
    assert.ok(VihatValidationError);
  });

  await t.test('imports from services/sms', async () => {
    const { SmsService } = await import('../dist/esm/services/sms.js');
    assert.ok(SmsService);
  });

  await t.test('imports from services/voice', async () => {
    const { VoiceService } = await import('../dist/esm/services/voice.js');
    assert.ok(VoiceService);
  });

  await t.test('imports from services/zalo', async () => {
    const { ZaloService } = await import('../dist/esm/services/zalo.js');
    assert.ok(ZaloService);
  });

  await t.test('imports from services/viber', async () => {
    const { ViberService } = await import('../dist/esm/services/viber.js');
    assert.ok(ViberService);
  });

  await t.test('imports from services/callback', async () => {
    const { parseSmsCallback, parseVoiceCallback } = await import(
      '../dist/esm/services/callback.js'
    );
    assert.ok(parseSmsCallback);
    assert.ok(parseVoiceCallback);
  });
});
