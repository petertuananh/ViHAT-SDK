import test from 'node:test';
import assert from 'node:assert/strict';
import { VihatClient, VihatValidationError } from '../dist/esm/index.js';
import { createMockFetch, jsonResponse } from './helpers.mjs';

test('ZaloService & ZNS methods', async (t) => {
  const client = new VihatClient({
    apiKey: 'my-api-key',
    secretKey: 'my-secret-key',
  });

  await t.test('sendZnsMessage() validates and posts data', async () => {
    await assert.rejects(
      async () => client.sendZnsMessage({ phone: '', oaId: '123', templateId: '456', params: [] }),
      VihatValidationError
    );

    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendZaloMessage_V4_post_json/'));
      assert.equal(init.method, 'POST');
      const body = JSON.parse(init.body);
      assert.equal(body.Phone, '0842090998');
      assert.equal(body.OAID, '35897654231871');
      assert.equal(body.TempID, '686868');
      assert.deepEqual(body.Params, ['value1', 'value2', 'value3']);
      return jsonResponse({
        CodeResult: '100',
        CountRegenerate: '0',
        SMSID: 'zns-msg-1',
      });
    });

    try {
      const res = await client.sendZnsMessage({
        phone: '0842090998',
        oaId: '35897654231871',
        templateId: '686868',
        params: ['value1', 'value2', 'value3'],
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'zns-msg-1');
    } finally {
      mock.restore();
    }
  });

  await t.test('sendZnsBulk() sends multiple messages', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/Send_zns_bulk_v4_post_json/'));
      const body = JSON.parse(init.body);
      assert.equal(body.OAID, '745830328927467685');
      assert.equal(body.TempID, '686868');
      assert.equal(body.Data.length, 2);
      return jsonResponse({
        CodeResult: '100',
        Message: 'Sucess',
        TotalFail: 0,
        TotalSuccess: 2,
        detail: [
          { CodeResult: '100', Phone: '0707494337', SMSID: 'bulk-1' },
          { CodeResult: '100', Phone: '0922090763', SMSID: 'bulk-2' },
        ],
      });
    });

    try {
      const res = await client.sendZnsBulk({
        oaId: '745830328927467685',
        templateId: '686868',
        data: [
          { phone: '0707494337', params: ['o1', 'ak1'] },
          { phone: '0922090763', params: ['o2', 'ak2'] },
        ],
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.TotalSuccess, 2);
      assert.equal(res.detail.length, 2);
    } finally {
      mock.restore();
    }
  });

  await t.test('getZaloOaList() returns OA list', async () => {
    const mock = createMockFetch(async (url) => {
      assert.ok(url.includes('/ZNS/GetListZOA/'));
      return jsonResponse({
        CodeResult: '100',
        ErrorMessage: 'success',
        ZOAList: [
          { OAID: '4163728256688863813', OAName: 'Đồ Da Gence' },
        ],
      });
    });

    try {
      const res = await client.getZaloOaList();
      assert.equal(res.CodeResult, '100');
      assert.equal(res.ZOAList.length, 1);
      assert.equal(res.ZOAList[0].OAName, 'Đồ Da Gence');
    } finally {
      mock.restore();
    }
  });

  await t.test('getZaloTemplates() returns templates with parameter definitions', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/GetTemplate/'));
      const body = JSON.parse(init.body);
      assert.equal(body.OAId, '4163728256688863813');
      assert.equal(body.SmsType, '25');
      return jsonResponse({
        CodeResult: '100',
        ErrorMessage: 'success',
        ZNSTemplates: [
          {
            TempContent: 'Xin chào {{customer_name}}',
            TempId: 203162,
            TempName: 'Nhắc thanh toán',
            ZNSTempDetail: [
              { Limit: 30, Param: 'customer_name', ParamLevel: 1, RequireType: 'type_text' },
            ],
          },
        ],
      });
    });

    try {
      const res = await client.getZaloTemplates('4163728256688863813');
      assert.equal(res.CodeResult, '100');
      assert.equal(res.ZNSTemplates.length, 1);
      assert.equal(res.ZNSTemplates[0].TempId, 203162);
    } finally {
      mock.restore();
    }
  });

  await t.test('getZaloFollowers() returns followers list', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/ZNS/GetFollowers/'));
      const body = JSON.parse(init.body);
      assert.equal(body.OAID, 'oa-123');
      return jsonResponse({
        CodeResult: '100',
        ErrorMessage: 'success',
        Followers: [{ User_Id: '8813370397556853094' }],
        Total: 321,
      });
    });

    try {
      const res = await client.getZaloFollowers('oa-123', 0, 4);
      assert.equal(res.CodeResult, '100');
      assert.equal(res.Total, 321);
      assert.equal(res.Followers.length, 1);
    } finally {
      mock.restore();
    }
  });

  await t.test('sendZaloFollowerMedia() sends image message', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendZaloFollowerMessage_V4_post_json/'));
      const body = JSON.parse(init.body);
      assert.equal(body.Template_type, 'media');
      assert.equal(body.Url, 'https://example.com/photo.jpg');
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'media-msg-1',
      });
    });

    try {
      const res = await client.sendZaloFollowerMedia({
        oaId: 'oa-1',
        userId: 'u-1',
        content: 'Chao mung ban',
        url: 'https://example.com/photo.jpg',
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'media-msg-1');
    } finally {
      mock.restore();
    }
  });

  await t.test('sendZaloFollowerList() sends list menu', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendZaloFollowerMessage_V4_post_json/'));
      const body = JSON.parse(init.body);
      assert.equal(body.Template_type, 'list');
      assert.equal(body.Elements.length, 1);
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'list-msg-1',
      });
    });

    try {
      const res = await client.sendZaloFollowerList({
        oaId: 'oa-1',
        userId: 'u-1',
        elements: [
          {
            title: 'Menu Item 1',
            imageUrl: 'https://example.com/item.png',
            defaultAction: { type: 'oa.open.url', url: 'https://example.com' },
          },
        ],
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'list-msg-1');
    } finally {
      mock.restore();
    }
  });

  await t.test('sendZaloFollowerButton() sends button message', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/SendZaloFollowerMessage_V5_post_json/'));
      const body = JSON.parse(init.body);
      assert.equal(body.Payload.message.text, 'Tin nhan button');
      assert.equal(body.Payload.message.attachment.payload.buttons.length, 1);
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'btn-msg-1',
      });
    });

    try {
      const res = await client.sendZaloFollowerButton({
        oaId: 'oa-1',
        userId: 'u-1',
        text: 'Tin nhan button',
        buttons: [
          { title: 'Open URL', type: 'oa.open.url', payload: { url: 'https://example.com' } },
        ],
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'btn-msg-1');
    } finally {
      mock.restore();
    }
  });

  await t.test('getZnsQuota() and getZnsQuality()', async () => {
    const mock = createMockFetch(async (url) => {
      if (url.includes('/ZNS/GetQuota/')) {
        return jsonResponse({
          CodeResult: '100',
          ErrorMessage: 'success',
          DailyQuota: 5000,
          RemainingQuota: 4900,
        });
      }
      if (url.includes('/ZNS/GetQuality/')) {
        return jsonResponse({
          CodeResult: '100',
          ErrorMessage: 'success',
          Oa7dayQuality: 'HIGH',
          OaCurrentQuality: 'HIGH',
        });
      }
      throw new Error(`Unexpected url: ${url}`);
    });

    try {
      const quota = await client.getZnsQuota('oa-123');
      assert.equal(quota.DailyQuota, 5000);

      const quality = await client.getZnsQuality('oa-123');
      assert.equal(quality.Oa7dayQuality, 'HIGH');
    } finally {
      mock.restore();
    }
  });

  await t.test('sendMultiChannel() sends fallback config', async () => {
    const mock = createMockFetch(async (url, init) => {
      assert.ok(url.includes('/MultiChannelMessage/'));
      const body = JSON.parse(init.body);
      assert.equal(body.Phone, '0350000026');
      assert.deepEqual(body.Channels, ['zalo', 'sms']);
      assert.equal(body.Data.length, 2);
      return jsonResponse({
        CodeResult: '100',
        SMSID: 'multi-ch-1',
      });
    });

    try {
      const res = await client.sendMultiChannel({
        phone: '0350000026',
        channels: ['zalo', 'sms'],
        zaloData: {
          oaId: '436181207180',
          templateId: '200300',
          params: ['Value1', 'Value2'],
        },
        smsData: {
          content: 'Fallback SMS',
          smsType: 2,
          brandname: 'eSMS',
        },
      });

      assert.equal(res.CodeResult, '100');
      assert.equal(res.SMSID, 'multi-ch-1');
    } finally {
      mock.restore();
    }
  });
});
