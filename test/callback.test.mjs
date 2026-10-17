import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSmsCallback,
  parseVoiceCallback,
  isSmsDeliveryDone,
  isVoiceCallAnswered,
  getTelcoName,
  SendStatus,
  TelcoId,
} from '../dist/esm/index.js';

test('Callback & Webhook parsers', async (t) => {
  await t.test('parseSmsCallback from query string', () => {
    const qs = '?SMSID=01587c8b-76fd-4j15-98c4-05f19aa5891210&SendFailed=0&SendStatus=5&SendSuccess=1&TotalPrice=790.0000&TotalReceiver=1&TotalSent=1&RequestId=req-999&telcoid=3';
    const payload = parseSmsCallback(qs);

    assert.equal(payload.SMSID, '01587c8b-76fd-4j15-98c4-05f19aa5891210');
    assert.equal(payload.SendFailed, 0);
    assert.equal(payload.SendStatus, SendStatus.SENT);
    assert.equal(payload.SendSuccess, 1);
    assert.equal(payload.TotalPrice, 790);
    assert.equal(payload.TotalReceiver, 1);
    assert.equal(payload.TotalSent, 1);
    assert.equal(payload.RequestId, 'req-999');
    assert.equal(payload.telcoid, TelcoId.VINAPHONE);
    assert.equal(getTelcoName(payload.telcoid), 'VinaPhone');
    assert.equal(isSmsDeliveryDone(payload), true);
  });

  await t.test('parseSmsCallback from Express req.query object', () => {
    const queryObj = {
      SMSID: 'abc-xyz',
      SendFailed: '2',
      SendStatus: '4', // REJECTED
      SendSuccess: '0',
      TotalPrice: '1500',
      TotalReceiver: '2',
      TotalSent: '2',
      telcoid: '1',
    };
    const payload = parseSmsCallback(queryObj);

    assert.equal(payload.SMSID, 'abc-xyz');
    assert.equal(payload.SendFailed, 2);
    assert.equal(payload.SendStatus, SendStatus.REJECTED);
    assert.equal(payload.telcoid, TelcoId.VIETTEL);
    assert.equal(getTelcoName(payload.telcoid), 'Viettel');
    assert.equal(isSmsDeliveryDone(payload), false);
  });

  await t.test('parseVoiceCallback from query string', () => {
    const qs = '?ReferenceId=ref-call-100&CallDuration=35&CallStatus=ANSWERED&Ivr=2&Price=1200&SentResult=1&CID=0287300000';
    const payload = parseVoiceCallback(qs);

    assert.equal(payload.ReferenceId, 'ref-call-100');
    assert.equal(payload.CallDuration, 35);
    assert.equal(payload.CallStatus, 'ANSWERED');
    assert.equal(payload.Ivr, '2');
    assert.equal(payload.Price, 1200);
    assert.equal(payload.SentResult, 1);
    assert.equal(payload.CID, '0287300000');
    assert.equal(isVoiceCallAnswered(payload), true);
  });

  await t.test('parseVoiceCallback with failed call', () => {
    const payload = parseVoiceCallback({
      ReferenceId: 'ref-call-200',
      CallDuration: 0,
      CallStatus: 'NO ANSWER',
      SentResult: 0,
    });

    assert.equal(payload.ReferenceId, 'ref-call-200');
    assert.equal(payload.CallStatus, 'NO ANSWER');
    assert.equal(isVoiceCallAnswered(payload), false);
  });
});
