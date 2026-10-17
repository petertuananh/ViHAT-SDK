import type {
  SmsTypeValue,
  BrandnameTypeValue,
  OtpGenTypeValue,
  VoiceSpeakerValue,
  VoiceSpeedValue,
  SendStatusValue,
  TelcoIdValue,
} from '../constants.js';

/**
 * ViHAT / eSMS Client Configuration Options
 */
export interface VihatConfig {
  /** API Key provided by eSMS / ViHAT */
  apiKey: string;
  /** Secret Key provided by eSMS / ViHAT */
  secretKey: string;
  /** Primary Base URL for SMS & general API. Defaults to 'https://restapi.esms.vn/MainService.svc' */
  baseUrl?: string;
  /** Base URL for Voice API. Defaults to 'http://voiceapi.esms.vn/MainService.svc' */
  voiceUrl?: string;
  /** Base URL for Ecommerce / ZOA Templates API. Defaults to 'http://restecom.esms.vn/MainService.svc' */
  ecomUrl?: string;
  /** Base URL for Zalo / MultiChannel API. Defaults to 'http://rest.apiesms.com/MainService.svc' */
  zaloUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30,000ms (30s) */
  timeoutMs?: number;
}

/**
 * Common response returned for message creation
 */
export interface VihatMessageResponse {
  CodeResult: string;
  CountRegenerate?: string | number;
  SMSID?: string;
  ErrorMessage?: string;
}

/**
 * Account balance response
 */
export interface BalanceResponse {
  Balance: number;
  CodeResponse: string;
  UserID: number | string;
}

/**
 * Options for sending SMS
 */
export interface SendSmsOptions {
  /** Recipient phone number (e.g. 0901234567, 84901234567) */
  phone: string;
  /** Content of the SMS message */
  content: string;
  /**
   * SMS Type. Default is 2 (Brandname CSKH).
   * 2: Brandname CSKH
   * 8: Fixed 10-digit number CSKH
   * 24: Priority Zalo
   * 25: Standard Zalo
   */
  smsType?: SmsTypeValue | number;
  /** Registered Brandname (required when smsType = 2) */
  brandname?: string;
  /** Whether content contains unicode Vietnamese diacritics. 0: No diacritics, 1: With diacritics */
  isUnicode?: boolean | 0 | 1;
  /** Sandbox testing mode. 0: Real send, 1: Sandbox test (no real delivery) */
  sandbox?: boolean | 0 | 1;
  /** Partner's unique transaction/request ID (max 120 chars) */
  requestId?: string;
  /** Campaign name (max 254 chars) */
  campaignId?: string;
  /** Webhook URL to receive SMS delivery status */
  callbackUrl?: string;
  /** Scheduled delivery datetime (Format: 'YYYY/MM/DD HH:mm:ss') */
  sendDate?: string;
  /** HTTP method to use. Default is 'POST' */
  method?: 'POST' | 'GET';
}

/**
 * Message delivery status query response
 */
export interface MessageStatusResponse {
  CodeResponse: string;
  SMSID: string;
  SendFailed: number;
  SendStatus: SendStatusValue | number;
  SendSuccess: number;
  TotalReceiver: number;
  TotalSent: number;
}

/**
 * Per-receiver status detail item
 */
export interface MessageReceiverItem {
  IsSent: boolean;
  Phone: string;
  SentResult: boolean;
}

/**
 * Message receivers query response
 */
export interface MessageReceiversResponse {
  CodeResult: string;
  ReceiverList: MessageReceiverItem[];
}

/**
 * Sent data query options
 */
export interface QuerySentDataOptions {
  /** Start datetime string, e.g. '2020/02/27 00:00:00' */
  from: string;
  /** End datetime string, e.g. '2020/02/28 23:59:59' */
  to: string;
}

/**
 * Sent message historical item
 */
export interface SentDataItem {
  SentTime: string;
  RefercenceId: string;
  SmsId: string;
  Phone: string;
  Content: string;
  SmsType: number | string;
  SentStatus: number | string;
  CodeResult: string;
  ErrorMessage?: string;
}

/**
 * Brandname item
 */
export interface BrandnameItem {
  Brandname: string;
  Type: BrandnameTypeValue | number;
}

/**
 * List brandnames response
 */
export interface BrandnameListResponse {
  CodeResponse: string;
  ListBrandName: BrandnameItem[];
}

/**
 * SMS Template item
 */
export interface SmsTemplateItem {
  NetworkID: number;
  TempContent: string;
  TempId: number | string;
}

/**
 * List SMS Templates response
 */
export interface SmsTemplateListResponse {
  CodeResult: string;
  ErrorMessage: string;
  BrandnameTemplates: SmsTemplateItem[];
}

/**
 * Auto-generate OTP code options
 */
export interface AutoGenCodeOptions {
  /** Recipient phone number */
  phone: string;
  /** OTP lifetime in minutes (e.g. 15) */
  timeAlive: number | string;
  /**
   * 1: Generate OTP code only (returned in response.Message)
   * 2: Generate OTP and send message via fallback route (requires multiChannelTempId)
   */
  typeId?: OtpGenTypeValue | 1 | 2;
  /** Multi-channel template ID when typeId = 2 */
  multiChannelTempId?: string;
  /** Webhook callback URL */
  callbackUrl?: string;
}

/**
 * Auto-generate OTP code response
 */
export interface AutoGenCodeResponse {
  CodeResult: string;
  CountRegenerate?: number;
  /** OTP code returned when typeId = 1 */
  Message?: string;
  /** SMS ID returned when typeId = 2 */
  SMSID?: string;
  ErrorMessage?: string;
}

/**
 * Options for making automated voice call from template
 */
export interface MakeVoiceCallTemplateOptions {
  /** Recipient phone number */
  phone: string;
  /** Registered voice template ID */
  templateId: string | number;
  /**
   * Variables for template placeholders, joined by '||'
   * Can be passed as a string ("Trung||20000") or an array (['Trung', '20000'])
   */
  variableListStr?: string | (string | number)[];
  /** Schedule datetime, format: 'yyyy/MM/dd HH:mm:ss' */
  sendDate?: string;
  /** Voice gender/accent: 'male' | 'female' | 'hatieumai' | 'ngoclam' */
  voice?: VoiceSpeakerValue | string;
  /** Reading speed: -3 to 3 */
  speed?: VoiceSpeedValue | number;
  /** Callback URL */
  callbackUrl?: string;
  /** Request tracking ID */
  requestId?: string;
}

/**
 * Options for making automated voice call from recorded audio file
 */
export interface MakeVoiceCallRecordOptions {
  /** Recipient phone number */
  phone: string;
  /** Recorded audio file template ID */
  templateId: string | number;
  /** Scheduled datetime (yyyy/MM/dd HH:mm:ss) */
  sendDate?: string;
  /** Phone number to forward call to if recipient presses matching IVR key */
  numberForward?: string;
  /** Number of times to replay audio when listener stays on line */
  maxRepeat?: number;
  /** Number of retries if listener doesn't answer */
  maxRetry?: number;
  /** IVR key (0-9) */
  ivr?: string | number;
  /** Wait time before recipient can press IVR key (in seconds) */
  timeWaitToIvr?: number;
  /** Delay between retries when recipient doesn't answer (in seconds) */
  waitRetry?: number;
  /** Callback URL */
  callbackUrl?: string;
  /** Request tracking ID */
  requestId?: string;
}

/**
 * Options for sending voice OTP
 */
export interface SendVoiceOtpOptions {
  /** Recipient phone number */
  phone: string;
  /** OTP numeric code (e.g. 6868) */
  code: string | number;
}

/**
 * Voice call status query response
 */
export interface VoiceCallStatusResponse {
  CodeResponse: string;
  callduration: number;
  callstatus: 'ANSWERED' | 'NOANSWERED' | string;
  ivr: string;
}

/**
 * Options for sending single Zalo ZNS message
 */
export interface SendZnsMessageOptions {
  /** Recipient phone number */
  phone: string;
  /** Zalo Official Account ID */
  oaId: string | number;
  /** Registered ZNS template ID */
  templateId: string | number;
  /** Parameters matching the registered ZNS template variables in exact order */
  params: (string | number)[] | Record<string, string | number>;
  /** Partner's unique request ID */
  requestId?: string;
  /** Campaign name */
  campaignId?: string;
  /** Callback webhook URL */
  callbackUrl?: string;
}

/**
 * ZNS Bulk message item for each recipient
 */
export interface ZnsBulkItem {
  /** Recipient phone number */
  phone: string;
  /** Template parameter values */
  params: (string | number)[];
}

/**
 * Options for sending ZNS bulk messages
 */
export interface SendZnsBulkOptions {
  /** Zalo Official Account ID */
  oaId: string | number;
  /** ZNS Template ID */
  templateId: string | number;
  /** Array of recipient items with phone and specific params */
  data: ZnsBulkItem[];
}

/**
 * ZNS Bulk delivery detail result for each recipient
 */
export interface ZnsBulkDetailItem {
  CodeResult: string;
  Phone: string;
  SMSID?: string;
  ErrorMessage?: string;
}

/**
 * ZNS Bulk response
 */
export interface SendZnsBulkResponse {
  CodeResult: string;
  Message: string;
  TotalFail: number;
  TotalSuccess: number;
  detail: ZnsBulkDetailItem[];
}

/**
 * Zalo OA item
 */
export interface ZaloOaItem {
  OAID: string;
  OAName: string;
}

/**
 * Zalo OA list response
 */
export interface ZaloOaListResponse {
  CodeResult: string;
  ErrorMessage: string;
  ZOAList: ZaloOaItem[];
}

/**
 * ZNS Template Detail parameter spec
 */
export interface ZnsTemplateDetailParam {
  Limit: number;
  Param: string;
  ParamLevel: number;
  RequireType: string;
}

/**
 * ZNS Template item
 */
export interface ZnsTemplateItem {
  TempContent: string;
  TempId: number;
  TempName: string;
  ZNSTempDetail: ZnsTemplateDetailParam[];
}

/**
 * ZNS Template list response
 */
export interface ZnsTemplateListResponse {
  CodeResult: string;
  ErrorMessage: string;
  ZNSTemplates: ZnsTemplateItem[];
}

/**
 * Zalo Follower user item
 */
export interface ZaloFollowerItem {
  User_Id: string;
}

/**
 * Zalo Follower list response
 */
export interface ZaloFollowerListResponse {
  CodeResult: string;
  ErrorMessage: string;
  Followers: ZaloFollowerItem[];
  Total: number;
}

/**
 * Options for sending media message to Zalo Follower
 */
export interface SendZaloFollowerMediaOptions {
  /** Zalo OA ID */
  oaId: string | number;
  /** Follower User ID */
  userId: string;
  /** Message text content */
  content: string;
  /** Image URL (PNG or JPG) */
  url: string;
  /** Webhook callback URL */
  callbackUrl?: string;
}

/**
 * Action triggered by clicking a menu list item
 */
export interface ZaloMenuAction {
  type: 'oa.open.url' | 'oa.open.phone';
  url?: string;
  phoneCode?: string;
}

/**
 * Menu list element in Zalo Follower menu
 */
export interface ZaloMenuItem {
  title: string;
  subtitle?: string;
  imageUrl: string;
  defaultAction: ZaloMenuAction;
}

/**
 * Options for sending List Menu message to Zalo Follower
 */
export interface SendZaloFollowerListOptions {
  /** Zalo OA ID */
  oaId: string | number;
  /** Single Follower User ID or comma-separated string */
  userId: string | string[];
  /** Array of menu items */
  elements: ZaloMenuItem[];
  /** Webhook callback URL */
  callbackUrl?: string;
}

/**
 * Zalo Interactive Button spec
 */
export interface ZaloButton {
  title: string;
  type:
    | 'oa.open.url'
    | 'oa.query.show'
    | 'oa.query.hide'
    | 'oa.open.sms'
    | 'oa.open.phone';
  payload:
    | { url: string }
    | { content: string; phone_code: string }
    | { phone_code: string }
    | string;
}

/**
 * Options for sending button interactive message to Zalo Follower
 */
export interface SendZaloFollowerButtonOptions {
  /** Zalo OA ID */
  oaId: string | number;
  /** Recipient Follower User ID */
  userId: string;
  /** Message text */
  text: string;
  /** Array of interactive buttons */
  buttons: ZaloButton[];
  /** Partner request ID */
  requestId?: string;
  /** Sandbox mode (0: real, 1: test) */
  isSandbox?: boolean | 0 | 1;
  /** Webhook callback URL */
  callbackUrl?: string;
}

/**
 * ZNS Quota response
 */
export interface ZnsQuotaResponse {
  CodeResult: string;
  ErrorMessage: string;
  DailyQuota: number;
  RemainingQuota: number;
}

/**
 * ZNS Quality response
 */
export interface ZnsQualityResponse {
  CodeResult: string;
  ErrorMessage: string;
  /** Quality level over past 48 hours: HIGH | MEDIUM | LOW | UNDEFINED */
  Oa7dayQuality: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNDEFINED' | string;
  /** Quality level over past 7 days: HIGH | MEDIUM | LOW | UNDEFINED */
  OaCurrentQuality: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNDEFINED' | string;
}

/**
 * ZNS customer feedback rating item
 */
export interface ZnsRatingFeedbackItem {
  feedbacks: string[];
  msgId: string;
  note: string;
  rate: number;
  submitDate: string;
  trackingId: string;
}

/**
 * ZNS Template Rating response
 */
export interface ZnsRatingResponse {
  CodeResult: string;
  ErrorMessage: string;
  Data: ZnsRatingFeedbackItem[];
  Total: number;
}

/**
 * Options for querying ZNS template rating
 */
export interface QueryZnsRatingOptions {
  oaId: string | number;
  templateId: string | number;
  /** Format: 'MM/dd/yyyy' */
  fromTime: string;
  /** Format: 'MM/dd/yyyy' */
  toTime: string;
  offset?: number;
  limit?: number;
}

/**
 * Multi-Channel channel data payload
 */
export interface MultiChannelZaloData {
  oaId: string | number;
  templateId: string | number;
  params: (string | number)[];
  campaignId?: string;
  callbackUrl?: string;
}

export interface MultiChannelSmsData {
  content: string;
  isUnicode?: boolean | 0 | 1;
  smsType: SmsTypeValue | number;
  brandname?: string;
  requestId?: string;
  campaignId?: string;
  callbackUrl?: string;
}

/**
 * Options for sending multi-channel message
 */
export interface SendMultiChannelOptions {
  /** Recipient phone number */
  phone: string;
  /** Channel precedence order, e.g. ['zalo', 'sms'] */
  channels: ('zalo' | 'sms')[];
  /** Channel-specific payload data */
  zaloData: MultiChannelZaloData;
  smsData: MultiChannelSmsData;
}

/**
 * Options for sending Viber message
 */
export interface SendViberOptions {
  /** Recipient phone number */
  phone: string;
  /** Content of the Viber message */
  content?: string;
  /** Registered Viber Brandname */
  brandname: string;
  /** Link URL when recipient clicks */
  ottUrl?: string;
  /** Banner image URL */
  ottImgUrl?: string;
  /** Button action label text */
  ottLabel?: string;
  /** Callback URL */
  callbackUrl?: string;
  /** Request ID */
  requestId?: string;
}

/**
 * Payload sent by eSMS to partner CallbackUrl on SMS delivery status change
 */
export interface SmsCallbackPayload {
  SMSID: string;
  SendFailed: number;
  SendStatus: SendStatusValue | number;
  SendSuccess: number;
  TotalPrice: number;
  TotalReceiver: number;
  TotalSent: number;
  RequestId?: string;
  telcoid?: TelcoIdValue | number;
  TypeId?: number;
}

/**
 * Payload sent by eSMS to partner CallbackUrl on Voice call delivery status change
 */
export interface VoiceCallbackPayload {
  ReferenceId: string;
  CallDuration: number;
  CallStatus: 'ANSWERED' | 'NO ANSWER' | string;
  Ivr?: string;
  Price?: number;
  SentResult: 0 | 1 | number;
  CID?: string;
}
