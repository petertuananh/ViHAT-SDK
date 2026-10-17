import { TELCO_NAMES, SendStatus } from '../constants.js';
import type { SmsCallbackPayload, VoiceCallbackPayload } from '../types/index.js';

function toRecord(
  input: Record<string, unknown> | URLSearchParams | string
): Record<string, string> {
  const result: Record<string, string> = {};

  if (typeof input === 'string') {
    const search = input.startsWith('?') ? input.slice(1) : input;
    const params = new URLSearchParams(search);
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
  } else if (input instanceof URLSearchParams) {
    for (const [key, value] of input.entries()) {
      result[key] = value;
    }
  } else if (typeof input === 'object' && input !== null) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined && value !== null) {
        result[key] = String(value);
      }
    }
  }

  return result;
}

/**
 * Parse and type-cast the SMS callback webhook payload received from eSMS
 */
export function parseSmsCallback(
  input: Record<string, unknown> | URLSearchParams | string
): SmsCallbackPayload {
  const data = toRecord(input);

  const smsId = data.SMSID || data.smsid || data.SmsId || '';
  const sendFailed = parseInt(data.SendFailed || data.sendFailed || '0', 10);
  const sendStatus = parseInt(data.SendStatus || data.sendStatus || '0', 10);
  const sendSuccess = parseInt(data.SendSuccess || data.sendSuccess || '0', 10);
  const totalPrice = parseFloat(data.TotalPrice || data.totalPrice || '0');
  const totalReceiver = parseInt(data.TotalReceiver || data.totalReceiver || '0', 10);
  const totalSent = parseInt(data.TotalSent || data.totalSent || '0', 10);
  const requestId = data.RequestId || data.requestId || data.requestid || undefined;
  const telcoidRaw = data.telcoid || data.telcpoid || data.TelcoId;
  const telcoid = telcoidRaw !== undefined ? parseInt(telcoidRaw, 10) : undefined;
  const typeIdRaw = data.TypeId || data.typeId;
  const typeId = typeIdRaw !== undefined ? parseInt(typeIdRaw, 10) : undefined;

  return {
    SMSID: smsId,
    SendFailed: Number.isNaN(sendFailed) ? 0 : sendFailed,
    SendStatus: Number.isNaN(sendStatus) ? 0 : sendStatus,
    SendSuccess: Number.isNaN(sendSuccess) ? 0 : sendSuccess,
    TotalPrice: Number.isNaN(totalPrice) ? 0 : totalPrice,
    TotalReceiver: Number.isNaN(totalReceiver) ? 0 : totalReceiver,
    TotalSent: Number.isNaN(totalSent) ? 0 : totalSent,
    RequestId: requestId,
    telcoid: telcoid !== undefined && !Number.isNaN(telcoid) ? telcoid : undefined,
    TypeId: typeId !== undefined && !Number.isNaN(typeId) ? typeId : undefined,
  };
}

/**
 * Parse and type-cast the Voice call callback webhook payload received from eSMS
 */
export function parseVoiceCallback(
  input: Record<string, unknown> | URLSearchParams | string
): VoiceCallbackPayload {
  const data = toRecord(input);

  const referenceId = data.ReferenceId || data.referenceId || data.SMSID || '';
  const callDuration = parseInt(data.CallDuration || data.callDuration || '0', 10);
  const callStatus = data.CallStatus || data.callStatus || '';
  const ivr = data.Ivr || data.ivr || undefined;
  const priceRaw = data.Price || data.price;
  const price = priceRaw !== undefined ? parseFloat(priceRaw) : undefined;
  const sentResult = parseInt(data.SentResult || data.sentResult || '0', 10);
  const cid = data.CID || data.cid || undefined;

  return {
    ReferenceId: referenceId,
    CallDuration: Number.isNaN(callDuration) ? 0 : callDuration,
    CallStatus: callStatus,
    Ivr: ivr,
    Price: price !== undefined && !Number.isNaN(price) ? price : undefined,
    SentResult: (Number.isNaN(sentResult) ? 0 : sentResult) as 0 | 1,
    CID: cid,
  };
}

/**
 * Check if an SMS callback indicates delivery completion
 */
export function isSmsDeliveryDone(payload: SmsCallbackPayload): boolean {
  return payload.SendStatus === SendStatus.SENT;
}

/**
 * Check if a Voice call callback indicates the call was answered
 */
export function isVoiceCallAnswered(payload: VoiceCallbackPayload): boolean {
  return payload.CallStatus === 'ANSWERED';
}

/**
 * Helper to get human-readable telco operator name from ID
 */
export function getTelcoName(telcoId?: number): string {
  if (telcoId === undefined || !(telcoId in TELCO_NAMES)) {
    return 'Unknown';
  }
  return TELCO_NAMES[telcoId];
}
