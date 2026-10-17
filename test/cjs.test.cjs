const test = require('node:test');
const assert = require('node:assert/strict');
const {
  VihatClient,
  EsmsClient,
  parseSmsCallback,
  parseVoiceCallback,
  SmsType,
  SendStatus,
  VihatValidationError,
} = require('../dist/cjs/index.js');

test('CommonJS compatibility', (t) => {
  t.test('exports classes and functions correctly in CJS', () => {
    assert.equal(typeof VihatClient, 'function');
    assert.equal(typeof EsmsClient, 'function');
    assert.equal(typeof parseSmsCallback, 'function');
    assert.equal(typeof parseVoiceCallback, 'function');
    assert.equal(SmsType.BRANDNAME_CSKH, 2);
    assert.equal(SendStatus.SENT, 5);

    const client = new VihatClient({
      apiKey: 'k',
      secretKey: 's',
    });
    assert.ok(client);
    assert.ok(client.sms);
    assert.ok(client.voice);
    assert.ok(client.zalo);
    assert.ok(client.viber);
  });

  t.test('throws validation error on invalid config in CJS', () => {
    assert.throws(() => new VihatClient(), VihatValidationError);
  });
});
