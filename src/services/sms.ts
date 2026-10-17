import type { HttpClient } from '../http.js';
import { SmsType } from '../constants.js';
import { VihatValidationError } from '../errors.js';
import type {
  AutoGenCodeOptions,
  AutoGenCodeResponse,
  BalanceResponse,
  BrandnameListResponse,
  MessageReceiversResponse,
  MessageStatusResponse,
  QuerySentDataOptions,
  SendSmsOptions,
  SentDataItem,
  SmsTemplateListResponse,
  VihatMessageResponse,
} from '../types/index.js';

export class SmsService {
  private readonly http: HttpClient;
  private readonly baseUrl: string;
  private readonly ecomUrl: string;

  constructor(http: HttpClient, baseUrl: string, ecomUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.ecomUrl = ecomUrl.replace(/\/+$/, '');
  }

  /**
   * Get account balance and user ID
   * @see http://rest.esms.vn/MainService.svc/json/GetBalance_json
   */
  public async getBalance(): Promise<BalanceResponse> {
    const url = `${this.baseUrl}/json/GetBalance_json`;
    return this.http.postJson<BalanceResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
    });
  }

  /**
   * Send SMS to one or more phone numbers (Brandname or 10-digit fixed number)
   * Supports both POST (default) and GET protocols as specified by ViHAT
   */
  public async sendMessage(options: SendSmsOptions): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (!options.content || !options.content.trim()) {
      throw new VihatValidationError('Message content is required', 'content');
    }

    const smsType = options.smsType ?? SmsType.BRANDNAME_CSKH;
    if (smsType === SmsType.BRANDNAME_CSKH && !options.brandname) {
      throw new VihatValidationError(
        'Brandname is required when sending SmsType 2 (Brandname CSKH)',
        'brandname'
      );
    }

    const isUnicodeVal = options.isUnicode ? '1' : '0';
    const sandboxVal = options.sandbox ? '1' : '0';

    if (options.method === 'GET') {
      const url = `${this.baseUrl}/json/SendMultipleMessage_V4_get`;
      return this.http.get<VihatMessageResponse>(url, {
        Phone: options.phone.trim(),
        Content: options.content,
        ApiKey: this.http.getApiKey(),
        SecretKey: this.http.getSecretKey(),
        IsUnicode: isUnicodeVal,
        Brandname: options.brandname,
        SmsType: String(smsType),
        CallbackUrl: options.callbackUrl,
        RequestId: options.requestId,
        SendDate: options.sendDate,
        Sandbox: sandboxVal,
      });
    }

    const url = `${this.baseUrl}/json/SendMultipleMessage_V4_post_json/`;
    return this.http.postJson<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      Phone: options.phone.trim(),
      Content: options.content,
      IsUnicode: isUnicodeVal,
      Brandname: options.brandname,
      SmsType: String(smsType),
      RequestId: options.requestId,
      CallbackUrl: options.callbackUrl,
      campaignid: options.campaignId,
      SendDate: options.sendDate,
      Sandbox: sandboxVal,
    });
  }

  /**
   * Alias for sendMessage
   */
  public async sendSms(options: SendSmsOptions): Promise<VihatMessageResponse> {
    return this.sendMessage(options);
  }

  /**
   * Query the delivery status of a sent SMS by SMS ID (RefId)
   */
  public async getMessageStatus(refId: string): Promise<MessageStatusResponse> {
    if (!refId || !refId.trim()) {
      throw new VihatValidationError('Message refId (SMSID) is required', 'refId');
    }
    const url = `${this.baseUrl}/json/GetSendStatus`;
    return this.http.get<MessageStatusResponse>(url, {
      RefId: refId.trim(),
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
    });
  }

  /**
   * Query delivery status for each individual recipient phone number in a message batch
   */
  public async getMessageReceivers(refId: string): Promise<MessageReceiversResponse> {
    if (!refId || !refId.trim()) {
      throw new VihatValidationError('Message refId (SMSID) is required', 'refId');
    }
    const url = `${this.baseUrl}/json/GetSmsReceiverStatus_get`;
    return this.http.get<MessageReceiversResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      RefId: refId.trim(),
    });
  }

  /**
   * Query sent SMS records within a date range
   */
  public async getSentData(options: QuerySentDataOptions): Promise<SentDataItem[]> {
    if (!options.from || !options.to) {
      throw new VihatValidationError('Both "from" and "to" timestamps are required', 'from/to');
    }
    const url = `${this.baseUrl}/json/GetSmsSentData_V1`;
    const res = await this.http.postJson<unknown>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      From: options.from,
      To: options.to,
    });

    if (Array.isArray(res)) {
      return res as SentDataItem[];
    }
    if (typeof res === 'object' && res !== null) {
      const dataObj = res as Record<string, unknown>;
      if (Array.isArray(dataObj.Data)) {
        return dataObj.Data as SentDataItem[];
      }
      return [res as SentDataItem];
    }
    return [];
  }

  /**
   * Get list of registered Brandnames for the account
   */
  public async getBrandnames(): Promise<BrandnameListResponse> {
    const apiKey = encodeURIComponent(this.http.getApiKey());
    const secretKey = encodeURIComponent(this.http.getSecretKey());
    const url = `${this.baseUrl}/json/GetListBrandname/${apiKey}/${secretKey}`;
    return this.http.get<BrandnameListResponse>(url);
  }

  /**
   * Get registered SMS templates for a specific Brandname
   */
  public async getTemplates(
    brandname: string,
    smsType: number = SmsType.BRANDNAME_CSKH
  ): Promise<SmsTemplateListResponse> {
    if (!brandname || !brandname.trim()) {
      throw new VihatValidationError('Brandname is required', 'brandname');
    }
    const url = `${this.ecomUrl}/json/GetTemplate/`;
    return this.http.postJson<SmsTemplateListResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      Brandname: brandname.trim(),
      SmsType: String(smsType),
    });
  }

  /**
   * Auto-generate an OTP code and optionally deliver it via multi-channel fallback
   * - typeId = 1: Generate OTP only (code in response.Message)
   * - typeId = 2: Generate OTP and send to device (requires multiChannelTempId)
   */
  public async autoGenCode(options: AutoGenCodeOptions): Promise<AutoGenCodeResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    const typeId = options.typeId ?? 1;
    if (typeId === 2 && !options.multiChannelTempId) {
      throw new VihatValidationError(
        'multiChannelTempId is required when typeId is 2 (Generate and send)',
        'multiChannelTempId'
      );
    }

    const url = `${this.baseUrl}/json/SendMessageAutoGenCode_V5`;
    return this.http.postJson<AutoGenCodeResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      Phone: options.phone.trim(),
      TimeAlive: String(options.timeAlive),
      TypeId: String(typeId),
      MultiChannelTempId: options.multiChannelTempId,
      CallbackUrl: options.callbackUrl,
    });
  }

  /**
   * Alias for autoGenCode
   */
  public async generateOtp(options: AutoGenCodeOptions): Promise<AutoGenCodeResponse> {
    return this.autoGenCode(options);
  }
}
