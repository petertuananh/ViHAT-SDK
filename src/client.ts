import {
  DEFAULT_TIMEOUT_MS,
  VIHAT_BASE_URL,
  VIHAT_ECOM_URL,
  VIHAT_VOICE_URL,
  VIHAT_ZALO_URL,
} from './constants.js';
import { VihatValidationError } from './errors.js';
import { HttpClient } from './http.js';
import { SmsService } from './services/sms.js';
import { VoiceService } from './services/voice.js';
import { ZaloService } from './services/zalo.js';
import { ViberService } from './services/viber.js';
import {
  parseSmsCallback,
  parseVoiceCallback,
  isSmsDeliveryDone,
  isVoiceCallAnswered,
  getTelcoName,
} from './services/callback.js';
import type {
  AutoGenCodeOptions,
  AutoGenCodeResponse,
  BalanceResponse,
  BrandnameListResponse,
  MakeVoiceCallRecordOptions,
  MakeVoiceCallTemplateOptions,
  MessageReceiversResponse,
  MessageStatusResponse,
  QuerySentDataOptions,
  QueryZnsRatingOptions,
  SendMultiChannelOptions,
  SendSmsOptions,
  SendViberOptions,
  SendVoiceOtpOptions,
  SendZaloFollowerButtonOptions,
  SendZaloFollowerListOptions,
  SendZaloFollowerMediaOptions,
  SendZnsBulkOptions,
  SendZnsBulkResponse,
  SendZnsMessageOptions,
  SentDataItem,
  SmsCallbackPayload,
  SmsTemplateListResponse,
  VihatConfig,
  VihatMessageResponse,
  VoiceCallbackPayload,
  VoiceCallStatusResponse,
  ZaloFollowerListResponse,
  ZaloOaListResponse,
  ZnsQualityResponse,
  ZnsQuotaResponse,
  ZnsRatingResponse,
  ZnsTemplateListResponse,
} from './types/index.js';

/**
 * ViHAT / eSMS modern Node.js client
 */
export class VihatClient {
  public readonly sms: SmsService;
  public readonly voice: VoiceService;
  public readonly zalo: ZaloService;
  public readonly viber: ViberService;

  protected readonly http: HttpClient;

  constructor(config: VihatConfig) {
    if (!config) {
      throw new VihatValidationError('Client configuration is required');
    }
    if (!config.apiKey || !config.apiKey.trim()) {
      throw new VihatValidationError('ApiKey is required', 'apiKey');
    }
    if (!config.secretKey || !config.secretKey.trim()) {
      throw new VihatValidationError('SecretKey is required', 'secretKey');
    }

    const baseUrl = config.baseUrl || VIHAT_BASE_URL;
    const voiceUrl = config.voiceUrl || VIHAT_VOICE_URL;
    const ecomUrl = config.ecomUrl || VIHAT_ECOM_URL;
    const zaloUrl = config.zaloUrl || VIHAT_ZALO_URL;
    const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    this.http = new HttpClient({
      apiKey: config.apiKey.trim(),
      secretKey: config.secretKey.trim(),
      timeoutMs,
    });

    this.sms = new SmsService(this.http, baseUrl, ecomUrl);
    this.voice = new VoiceService(this.http, voiceUrl, baseUrl);
    this.zalo = new ZaloService(this.http, baseUrl, ecomUrl, zaloUrl);
    this.viber = new ViberService(this.http, baseUrl);
  }

  // --- Convenience top-level SMS methods ---

  /**
   * Get account balance and user ID
   */
  public async getBalance(): Promise<BalanceResponse> {
    return this.sms.getBalance();
  }

  /**
   * Send an SMS message (Brandname or 10-digit number)
   */
  public async sendSms(options: SendSmsOptions): Promise<VihatMessageResponse> {
    return this.sms.sendMessage(options);
  }

  /**
   * Send an SMS message (alias for sendSms)
   */
  public async sendMessage(options: SendSmsOptions): Promise<VihatMessageResponse> {
    return this.sms.sendMessage(options);
  }

  /**
   * Query the delivery status of a sent SMS by SMS ID
   */
  public async getMessageStatus(refId: string): Promise<MessageStatusResponse> {
    return this.sms.getMessageStatus(refId);
  }

  /**
   * Query delivery status for each recipient in a message batch
   */
  public async getMessageReceivers(refId: string): Promise<MessageReceiversResponse> {
    return this.sms.getMessageReceivers(refId);
  }

  /**
   * Query sent SMS records within a date range
   */
  public async getSentData(options: QuerySentDataOptions): Promise<SentDataItem[]> {
    return this.sms.getSentData(options);
  }

  /**
   * Get list of registered Brandnames for the account
   */
  public async getBrandnames(): Promise<BrandnameListResponse> {
    return this.sms.getBrandnames();
  }

  /**
   * Get registered SMS templates for a specific Brandname
   */
  public async getSmsTemplates(
    brandname: string,
    smsType: number = 2
  ): Promise<SmsTemplateListResponse> {
    return this.sms.getTemplates(brandname, smsType);
  }

  /**
   * Auto-generate an OTP code and optionally deliver it via multi-channel fallback
   */
  public async generateOtp(options: AutoGenCodeOptions): Promise<AutoGenCodeResponse> {
    return this.sms.autoGenCode(options);
  }

  // --- Convenience top-level Voice methods ---

  /**
   * Make an automated voice call using a registered template
   */
  public async makeVoiceCallTemplate(
    options: MakeVoiceCallTemplateOptions
  ): Promise<VihatMessageResponse> {
    return this.voice.makeVoiceCallTemplate(options);
  }

  /**
   * Make an automated voice call using a recorded audio file
   */
  public async makeVoiceCallRecord(
    options: MakeVoiceCallRecordOptions
  ): Promise<VihatMessageResponse> {
    return this.voice.makeVoiceCallRecord(options);
  }

  /**
   * Send a voice call speaking an OTP code
   */
  public async sendVoiceOtp(options: SendVoiceOtpOptions): Promise<VihatMessageResponse> {
    return this.voice.sendVoiceOtp(options);
  }

  /**
   * Query status of a voice call by Reference ID (SMSID)
   */
  public async getVoiceCallStatus(referenceId: string): Promise<VoiceCallStatusResponse> {
    return this.voice.getVoiceCallStatus(referenceId);
  }

  // --- Convenience top-level Zalo ZNS methods ---

  /**
   * Send single Zalo ZNS notification message
   */
  public async sendZnsMessage(options: SendZnsMessageOptions): Promise<VihatMessageResponse> {
    return this.zalo.sendZnsMessage(options);
  }

  /**
   * Send bulk Zalo ZNS messages where each recipient can have custom params
   */
  public async sendZnsBulk(options: SendZnsBulkOptions): Promise<SendZnsBulkResponse> {
    return this.zalo.sendZnsBulk(options);
  }

  /**
   * Get list of authorized Zalo Official Accounts
   */
  public async getZaloOaList(): Promise<ZaloOaListResponse> {
    return this.zalo.getZaloOaList();
  }

  /**
   * Get list of registered ZNS templates for an OA
   */
  public async getZaloTemplates(
    oaId: string | number,
    smsType: number = 25
  ): Promise<ZnsTemplateListResponse> {
    return this.zalo.getZaloTemplates(oaId, smsType);
  }

  /**
   * Get list of users following the Zalo OA
   */
  public async getZaloFollowers(
    oaId: string | number,
    offset: number = 0,
    count: number = 10
  ): Promise<ZaloFollowerListResponse> {
    return this.zalo.getZaloFollowers(oaId, offset, count);
  }

  /**
   * Send notification with an attached image to a Zalo OA follower
   */
  public async sendZaloFollowerMedia(
    options: SendZaloFollowerMediaOptions
  ): Promise<VihatMessageResponse> {
    return this.zalo.sendZaloFollowerMedia(options);
  }

  /**
   * Send interactive List Menu message to Zalo OA follower(s)
   */
  public async sendZaloFollowerList(
    options: SendZaloFollowerListOptions
  ): Promise<VihatMessageResponse> {
    return this.zalo.sendZaloFollowerList(options);
  }

  /**
   * Send interactive button message to Zalo OA follower
   */
  public async sendZaloFollowerButton(
    options: SendZaloFollowerButtonOptions
  ): Promise<VihatMessageResponse> {
    return this.zalo.sendZaloFollowerButton(options);
  }

  /**
   * Get daily sending quota of the Zalo OA
   */
  public async getZnsQuota(oaId: string | number): Promise<ZnsQuotaResponse> {
    return this.zalo.getZnsQuota(oaId);
  }

  /**
   * Get ZNS message delivery quality status in last 48 hours and 7 days
   */
  public async getZnsQuality(oaId: string | number): Promise<ZnsQualityResponse> {
    return this.zalo.getZnsQuality(oaId);
  }

  /**
   * Get rating and feedbacks submitted by customers for a rating template
   */
  public async getZnsRating(options: QueryZnsRatingOptions): Promise<ZnsRatingResponse> {
    return this.zalo.getZnsRating(options);
  }

  /**
   * Send Multi-Channel message (e.g. Zalo ZNS with automatic SMS fallback)
   */
  public async sendMultiChannel(options: SendMultiChannelOptions): Promise<VihatMessageResponse> {
    return this.zalo.sendMultiChannel(options);
  }

  // --- Convenience top-level Viber methods ---

  /**
   * Send a Viber message to a recipient phone number
   */
  public async sendViberMessage(options: SendViberOptions): Promise<VihatMessageResponse> {
    return this.viber.sendViberMessage(options);
  }

  // --- Static callback helper methods ---

  public static parseSmsCallback(
    input: Record<string, unknown> | URLSearchParams | string
  ): SmsCallbackPayload {
    return parseSmsCallback(input);
  }

  public static parseVoiceCallback(
    input: Record<string, unknown> | URLSearchParams | string
  ): VoiceCallbackPayload {
    return parseVoiceCallback(input);
  }

  public static isSmsDeliveryDone(payload: SmsCallbackPayload): boolean {
    return isSmsDeliveryDone(payload);
  }

  public static isVoiceCallAnswered(payload: VoiceCallbackPayload): boolean {
    return isVoiceCallAnswered(payload);
  }

  public static getTelcoName(telcoId?: number): string {
    return getTelcoName(telcoId);
  }
}

/**
 * EsmsClient is an alias for VihatClient
 */
export class EsmsClient extends VihatClient {}
