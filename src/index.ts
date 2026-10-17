export { VihatClient, EsmsClient } from './client.js';

export {
  VIHAT_BASE_URL,
  VIHAT_RESTAPI_URL,
  VIHAT_VOICE_URL,
  VIHAT_ECOM_URL,
  VIHAT_ZALO_URL,
  DEFAULT_TIMEOUT_MS,
  SmsType,
  BrandnameType,
  OtpGenType,
  VoiceSpeaker,
  VoiceSpeed,
  SendStatus,
  TelcoId,
  TELCO_NAMES,
  VIHAT_RESPONSE_CODES,
} from './constants.js';

export type {
  SmsTypeValue,
  BrandnameTypeValue,
  OtpGenTypeValue,
  VoiceSpeakerValue,
  VoiceSpeedValue,
  SendStatusValue,
  TelcoIdValue,
} from './constants.js';

export {
  VihatError,
  VihatValidationError,
  VihatHttpError,
  VihatTimeoutError,
  VihatApiError,
} from './errors.js';

export { HttpClient } from './http.js';
export type { HttpClientOptions, RequestOptions } from './http.js';

export { SmsService } from './services/sms.js';
export { VoiceService } from './services/voice.js';
export { ZaloService } from './services/zalo.js';
export { ViberService } from './services/viber.js';

export {
  parseSmsCallback,
  parseVoiceCallback,
  isSmsDeliveryDone,
  isVoiceCallAnswered,
  getTelcoName,
} from './services/callback.js';

export type * from './types/index.js';
