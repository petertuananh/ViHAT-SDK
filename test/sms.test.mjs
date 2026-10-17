import test from 'node:test';
import assert from 'node:assert/strict';
import { VihatClient, VihatValidationError, SmsType } from '../dist/esm/index.js';
import { createMockFetch, jsonResponse } from './helpers.mjs';

test('SmsService & methods', async (t) => {
  const client = new VihatClient({
    apiKey: 'my-api-key',
    secretKey: 'my-secret-key',
  });

  await t.test('getBalance() returns balance', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetBalance_json'));
      assert.equal(init.method, 'POST');
      const body = JSON.parse(init.body);
      assert.equal(body.ApiKey, 'my-api-key');
      assert.equal(body.SecretKey, 'my-secret-key');
      return jsonResponse({
        Balance: 7527430,
        CodeResponse: '100',
        UserID: '0001',
      });
    });

    try {
      const res = await client.getBalance();
      assert.equal(res.Balance, 7527430);
      assert.equal(res.CodeResponse, '100');
      assert.equal(res.UserID, '0001');
      assert.equal(mock.calls.length, 1);
    } finally {
      mock.restore();
    }
  });

  await t.test('sendSms() validates input', async () => {
    await assert.rejects(
      async () => client.sendSms({ phone: '', content: 'hello' }),
      VihatValidationError
    );
    await assert.rejects(
      async () => client.sendSms({ phone: '0901234567', content: '' }),
      VihatValidationError
    );
    // When smsType = 2, brandname is required
    await assert.rejects(
      async () => client.sendSms({ phone: '0901234567', content: 'test', smsType: SmsType.BRANDNAME_CSKH }),
      VihatValidationError
    );
  });

  await t.test('sendSms() POST JSON (default)', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendMultipleMessage_V4_post_json/'));
      assert.equal(init.method, 'POST');
      const body = JSON.parse(init.body);
      assert.equal(body.ApiKey, 'my-api-key');
      assert.equal(body.SecretKey, 'my-secret-key');
      assert.equal(body.Phone, '0901234567');
      assert.equal(body.Content, 'Hello world');
      assert.equal(body.Brandname, 'Baotrixemay');
      assert.equal(body.SmsType, '2');
      return jsonResponse({
        CodeResult: '100',
        CountRegenerate: '0',
        SMSID: 'sms-uuid-1234',
      });
    });

    try {
      const res = await client.sendSms({
        phone: '0901234567',
        content: 'Hello world',
        brandname: 'Baotrixemay',
        smsType: SmsType.BRANDNAME_CSKH,
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'sms-uuid-1234');
    } finally {
      mock.restore();
    }
  });

  await t.test('sendSms() GET mode', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendMultipleMessage_V4_get'));
      assert.equal(init.method, 'GET');
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('Phone'), '0901234567');
      assert.equal(parsedUrl.searchParams.get('ApiKey'), 'my-api-key');
      assert.equal(parsedUrl.searchParams.get('Brandname'), 'Baotrixemay');
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'sms-uuid-get-5678',
      });
    });

    try {
      const res = await client.sendSms({
        phone: '0901234567',
        content: 'Hello via GET',
        brandname: 'Baotrixemay',
        method: 'GET',
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'sms-uuid-get-5678');
    } finally {
      mock.restore();
    }
  });

  await t.test('getMessageStatus() returns status', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetSendStatus'));
      assert.equal(init.method, 'GET');
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('RefId'), 'sms-123');
      return jsonResponse({
        CodeResponse: '100',
        SMSID: 'sms-123',
        SendFailed: 0,
        SendStatus: 5,
        SendSuccess: 1,
        TotalReceiver: 1,
        TotalSent: 1,
      });
    });

    try {
      const res = await client.getMessageStatus('sms-123');
      assert.equal(res.CodeResponse, '100');
      assert.equal(res.SendStatus, 5);
      assert.equal(res.SendSuccess, 1);
    } finally {
      mock.restore();
    }
  });

  await t.test('getMessageReceivers() returns receivers detail', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetSmsReceiverStatus_get'));
      const parsedUrl = new URL(url);
      assert.equal(parsedUrl.searchParams.get('RefId'), 'sms-123');
      return jsonResponse({
        CodeResult: '100',
        ReceiverList: [
          { IsSent: true, Phone: '0901234567', SentResult: true },
        ],
      });
    });

    try {
      const res = await client.getMessageReceivers('sms-123');
      assert.equal(res.CodeResult, '100');
      assert.equal(res.ReceiverList.length, 1);
      assert.equal(res.ReceiverList[0].Phone, '0901234567');
      assert.equal(res.ReceiverList[0].SentResult, true);
    } finally {
      mock.restore();
    }
  });

  await t.test('getSentData() returns history', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetSmsSentData_V1'));
      assert.equal(init.method, 'POST');
      return jsonResponse([
        {
          SentTime: '2020/02/27 10:00:00',
          RefercenceId: 'ref-1',
          SmsId: 'sms-1',
          Phone: '0901234567',
          Content: 'Hello',
          SmsType: 2,
          SentStatus: 5,
          CodeResult: '100',
        },
      ]);
    });

    try {
      const res = await client.getSentData({
        from: '2020/02/27 00:00:00',
        to: '2020/02/28 23:59:59',
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].Phone, '0901234567');
    } finally {
      mock.restore();
    }
  });

  await t.test('getBrandnames() returns registered brandnames', async () => {
    const mock = createMockFetch(async (url) => {
      assert.ok(url.includes('/GetListBrandname/my-api-key/my-secret-key'));
      return jsonResponse({
        CodeResponse: '100',
        ListBrandName: [
          { Brandname: 'Test_Sang', Type: 2 },
          { Brandname: 'sangbrand', Type: 2 },
        ],
      });
    });

    try {
      const res = await client.getBrandnames();
      assert.equal(res.CodeResponse, '100');
      assert.equal(res.ListBrandName.length, 2);
    } finally {
      mock.restore();
    }
  });

  await t.test('getSmsTemplates() returns templates', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetTemplate/'));
      assert.equal(init.method, 'POST');
      const body = JSON.parse(init.body);
      assert.equal(body.Brandname, 'Baotrixemay');
      assert.equal(body.SmsType, '2');
      return jsonResponse({
        CodeResult: '100',
        ErrorMessage: 'success',
        BrandnameTemplates: [
          {
            NetworkID: 4,
            TempContent: 'Test {P1,20}',
            TempId: 466,
          },
        ],
      });
    });

    try {
      const res = await client.getSmsTemplates('Baotrixemay', 2);
      assert.equal(res.CodeResult, '100');
      assert.equal(res.BrandnameTemplates.length, 1);
      assert.equal(res.BrandnameTemplates[0].TempId, 466);
    } finally {
      mock.restore();
    }
  });

  await t.test('generateOtp() Type 1 (Code only)', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendMessageAutoGenCode_V5'));
      const body = JSON.parse(init.body);
      assert.equal(body.TypeId, '1');
      assert.equal(body.Phone, '0901234567');
      assert.equal(body.TimeAlive, '15');
      return jsonResponse({
        CodeResult: '200',
        CountRegenerate: 0,
        Message: '365628',
      });
    });

    try {
      const res = await client.generateOtp({
        phone: '0901234567',
        timeAlive: 15,
        typeId: 1,
      });

      assert.equal(res.CodeResult, '200');
      assert.equal(res.Message, '365628');
    } finally {
      mock.restore();
    }
  });

  await t.test('generateOtp() Type 2 requires multiChannelTempId', async () => {
    await assert.rejects(
      async () => client.generateOtp({ phone: '0901234567', timeAlive: 15, typeId: 2 }),
      VihatValidationError
    );
  });
});
