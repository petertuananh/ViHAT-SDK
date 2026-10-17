import test from 'node:test';
import assert from 'node:assert/strict';
import { VihatClient, VihatValidationError, VoiceSpeaker, VoiceSpeed } from '../dist/esm/index.js';
import { createMockFetch, jsonResponse } from './helpers.mjs';

test('VoiceService & methods', async (t) => {
  const client = new VihatClient({
    apiKey: 'my-api-key',
    secretKey: 'my-secret-key',
  });

  await t.test('getVoiceCallStatus() validates referenceId and returns status', async () => {
    await assert.rejects(
      async () => client.getVoiceCallStatus(''),
      VihatValidationError
    );

    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetSendStatus'));
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('ReferenceId'), 'call-ref-123');
      return jsonResponse({
        CodeResponse: '100',
        callduration: 24,
        callstatus: 'ANSWERED',
        ivr: '2',
      });
    });

    try {
      const res = await client.getVoiceCallStatus('call-ref-123');
      assert.equal(res.CodeResponse, '100');
      assert.equal(res.callduration, 24);
      assert.equal(res.callstatus, 'ANSWERED');
      assert.equal(res.ivr, '2');
    } finally {
      mock.restore();
    }
  });

  await t.test('makeVoiceCallTemplate() sends GET request with joined variables', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/MakeCallTemplate_V2'));
      assert.equal(init.method, 'GET');
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('Phone'), '0901234567');
      assert.equal(parsedUrl.searchParams.get('TemplateId'), '12345');
      assert.equal(parsedUrl.searchParams.get('VariableListStr'), 'Trung||20000');
      assert.equal(parsedUrl.searchParams.get('Voice'), 'hatieumai');
      assert.equal(parsedUrl.searchParams.get('Speed'), '0');
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'voice-call-id-1',
      });
    });

    try {
      const res = await client.makeVoiceCallTemplate({
        phone: '0901234567',
        templateId: 12345,
        variableListStr: ['Trung', 20000],
        voice: VoiceSpeaker.HATIEUMAI,
        speed: VoiceSpeed.NORMAL,
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'voice-call-id-1');
    } finally {
      mock.restore();
    }
  });

  await t.test('makeVoiceCallRecord() sends GET request for recorded audio', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/MakeCallRecord_V2'));
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('Phone'), '0901234567');
      assert.equal(parsedUrl.searchParams.get('TemplateId'), 'rec-888');
      assert.equal(parsedUrl.searchParams.get('MaxRepeat'), '2');
      assert.equal(parsedUrl.searchParams.get('Ivr'), '1');
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'voice-rec-id-2',
      });
    });

    try {
      const res = await client.makeVoiceCallRecord({
        phone: '0901234567',
        templateId: 'rec-888',
        maxRepeat: 2,
        ivr: 1,
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'voice-rec-id-2');
    } finally {
      mock.restore();
    }
  });

  await t.test('sendVoiceOtp() sends OTP voice call', async () => {
    const mock = createMockFetch(async (url) => {
      assert.ok(url.includes('/SendMultipleMessage_V4_get'));
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('Phone'), '0901234567');
      assert.equal(parsedUrl.searchParams.get('Content'), '6868');
      assert.equal(parsedUrl.searchParams.get('SmsType'), '8');
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'voice-otp-id-3',
      });
    });

    try {
      const res = await client.sendVoiceOtp({
        phone: '0901234567',
        code: 6868,
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'voice-otp-id-3');
    } finally {
      mock.restore();
    }
  });
});
