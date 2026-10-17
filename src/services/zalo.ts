import type { HttpClient } from '../http.js';
import { VihatValidationError } from '../errors.js';
import type {
  QueryZnsRatingOptions,
  SendMultiChannelOptions,
  SendZaloFollowerButtonOptions,
  SendZaloFollowerListOptions,
  SendZaloFollowerMediaOptions,
  SendZnsBulkOptions,
  SendZnsBulkResponse,
  SendZnsMessageOptions,
  VihatMessageResponse,
  ZaloFollowerListResponse,
  ZaloOaListResponse,
  ZnsQualityResponse,
  ZnsQuotaResponse,
  ZnsRatingResponse,
  ZnsTemplateListResponse,
} from '../types/index.js';

export class ZaloService {
  private readonly http: HttpClient;
  private readonly baseUrl: string;
  private readonly ecomUrl: string;
  private readonly zaloUrl: string;

  constructor(http: HttpClient, baseUrl: string, ecomUrl: string, zaloUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.ecomUrl = ecomUrl.replace(/\/+$/, '');
    this.zaloUrl = zaloUrl.replace(/\/+$/, '');
  }

  /**
   * Send single Zalo ZNS notification message
   * @see http://rest.apiesms.com/MainService.svc/json/SendZaloMessage_V4_post_json/
   */
  public async sendZnsMessage(options: SendZnsMessageOptions): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (options.oaId === undefined || options.oaId === null || options.oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    if (options.templateId === undefined || options.templateId === null || options.templateId === '') {
      throw new VihatValidationError('Template ID is required', 'templateId');
    }

    let params: string[];
    if (Array.isArray(options.params)) {
      params = options.params.map(String);
    } else if (typeof options.params === 'object' && options.params !== null) {
      params = Object.values(options.params).map(String);
    } else {
      params = [];
    }

    const url = `${this.zaloUrl}/json/SendZaloMessage_V4_post_json/`;
    return this.http.postJson<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      Phone: options.phone.trim(),
      Params: params,
      TempID: String(options.templateId),
      RequestId: options.requestId,
      OAID: String(options.oaId),
      campaignid: options.campaignId,
      CallbackUrl: options.callbackUrl,
    });
  }

  /**
   * Send bulk Zalo ZNS messages where each recipient can have custom params
   * @see http://rest.esms.vn/MainService.svc/json/Send_zns_bulk_v4_post_json/
   */
  public async sendZnsBulk(options: SendZnsBulkOptions): Promise<SendZnsBulkResponse> {
    if (options.oaId === undefined || options.oaId === null || options.oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    if (options.templateId === undefined || options.templateId === null || options.templateId === '') {
      throw new VihatValidationError('Template ID is required', 'templateId');
    }
    if (!Array.isArray(options.data) || options.data.length === 0) {
      throw new VihatValidationError('Recipient data array cannot be empty', 'data');
    }

    const url = `${this.baseUrl}/json/Send_zns_bulk_v4_post_json/`;
    return this.http.postJson<SendZnsBulkResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      TempID: String(options.templateId),
      OAID: String(options.oaId),
      Data: options.data.map((item) => ({
        Phone: item.phone,
        Params: item.params.map(String),
      })),
    });
  }

  /**
   * Get list of authorized Zalo Official Accounts
   * @see http://restecom.esms.vn/MainService.svc/json/ZNS/GetListZOA/
   */
  public async getZaloOaList(): Promise<ZaloOaListResponse> {
    const url = `${this.ecomUrl}/json/ZNS/GetListZOA/`;
    return this.http.postJson<ZaloOaListResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
    });
  }

  /**
   * Get list of registered ZNS templates for an OA
   * @param oaId Zalo OA ID
   * @param smsType 24: Priority Zalo, 25: Normal Zalo (default: 25)
   * @see http://restecom.esms.vn/MainService.svc/json/GetTemplate/
   */
  public async getZaloTemplates(
    oaId: string | number,
    smsType: number = 25
  ): Promise<ZnsTemplateListResponse> {
    if (oaId === undefined || oaId === null || oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    const url = `${this.ecomUrl}/json/GetTemplate/`;
    return this.http.postJson<ZnsTemplateListResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      OAId: String(oaId),
      SmsType: String(smsType),
    });
  }

  /**
   * Get list of users following the Zalo OA
   * @see http://rest.esms.vn/MainService.svc/json/ZNS/GetFollowers/
   */
  public async getZaloFollowers(
    oaId: string | number,
    offset: number = 0,
    count: number = 10
  ): Promise<ZaloFollowerListResponse> {
    if (oaId === undefined || oaId === null || oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    const url = `${this.baseUrl}/json/ZNS/GetFollowers/`;
    return this.http.postJson<ZaloFollowerListResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      OAID: String(oaId),
      Offset: offset,
      Count: count,
    });
  }

  /**
   * Send notification with an attached image to a Zalo OA follower
   * @see http://rest.esms.vn/MainService.svc/json/SendZaloFollowerMessage_V4_post_json/
   */
  public async sendZaloFollowerMedia(
    options: SendZaloFollowerMediaOptions
  ): Promise<VihatMessageResponse> {
    if (options.oaId === undefined || options.oaId === null || options.oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    if (!options.userId || !options.userId.trim()) {
      throw new VihatValidationError('User ID is required', 'userId');
    }
    if (!options.url || !options.url.trim()) {
      throw new VihatValidationError('Image URL is required', 'url');
    }

    const url = `${this.baseUrl}/json/SendZaloFollowerMessage_V4_post_json/`;
    return this.http.postJson<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      OAID: String(options.oaId),
      User_id: options.userId.trim(),
      Content: options.content,
      Template_type: 'media',
      Url: options.url,
      CallbackUrl: options.callbackUrl,
    });
  }

  /**
   * Send interactive List Menu message to Zalo OA follower(s)
   * @see http://rest.esms.vn/MainService.svc/json/SendZaloFollowerMessage_V4_post_json/
   */
  public async sendZaloFollowerList(
    options: SendZaloFollowerListOptions
  ): Promise<VihatMessageResponse> {
    if (options.oaId === undefined || options.oaId === null || options.oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    if (!options.userId) {
      throw new VihatValidationError('User ID is required', 'userId');
    }
    if (!Array.isArray(options.elements) || options.elements.length === 0) {
      throw new VihatValidationError('Elements list cannot be empty', 'elements');
    }

    const userIdStr = Array.isArray(options.userId)
      ? options.userId.join(',')
      : String(options.userId);

    const formattedElements = options.elements.map((el) => ({
      Title: el.title,
      Subtitle: el.subtitle,
      Image_url: el.imageUrl,
      Default_action: {
        Type: el.defaultAction.type,
        Url: el.defaultAction.url,
        PhoneCode: el.defaultAction.phoneCode,
      },
    }));

    const url = `${this.baseUrl}/json/SendZaloFollowerMessage_V4_post_json/`;
    return this.http.postJson<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      User_id: userIdStr,
      OAID: String(options.oaId),
      Template_type: 'list',
      Elements: formattedElements,
      CallbackUrl: options.callbackUrl,
    });
  }

  /**
   * Send interactive button message to Zalo OA follower
   * @see http://rest.esms.vn/MainService.svc/json/SendZaloFollowerMessage_V5_post_json/
   */
  public async sendZaloFollowerButton(
    options: SendZaloFollowerButtonOptions
  ): Promise<VihatMessageResponse> {
    if (options.oaId === undefined || options.oaId === null || options.oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    if (!options.userId || !options.userId.trim()) {
      throw new VihatValidationError('User ID is required', 'userId');
    }
    if (!options.text || !options.text.trim()) {
      throw new VihatValidationError('Message text is required', 'text');
    }

    const isSandboxVal = options.isSandbox ? '1' : '0';

    const url = `${this.baseUrl}/json/SendZaloFollowerMessage_V5_post_json/`;
    return this.http.postJson<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      OAID: String(options.oaId),
      RequestId: options.requestId ?? null,
      IsSandbox: isSandboxVal,
      CallbackUrl: options.callbackUrl,
      Payload: {
        recipient: {
          user_id: options.userId.trim(),
        },
        message: {
          text: options.text,
          attachment: {
            type: 'template',
            payload: {
              buttons: options.buttons,
            },
          },
        },
      },
    });
  }

  /**
   * Get daily sending quota of the Zalo OA
   * @see http://rest.esms.vn/MainService.svc/json/ZNS/GetQuota/
   */
  public async getZnsQuota(oaId: string | number): Promise<ZnsQuotaResponse> {
    if (oaId === undefined || oaId === null || oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    const url = `${this.baseUrl}/json/ZNS/GetQuota/`;
    return this.http.postJson<ZnsQuotaResponse>(url, {
      ApiKey: this.http.getApiKey(),
      OAID: String(oaId),
      SecretKey: this.http.getSecretKey(),
    });
  }

  /**
   * Get ZNS message delivery quality status in last 48 hours and 7 days
   * @see http://rest.esms.vn/MainService.svc/json/ZNS/GetQuality/
   */
  public async getZnsQuality(oaId: string | number): Promise<ZnsQualityResponse> {
    if (oaId === undefined || oaId === null || oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    const url = `${this.baseUrl}/json/ZNS/GetQuality/`;
    return this.http.postJson<ZnsQualityResponse>(url, {
      ApiKey: this.http.getApiKey(),
      OAID: String(oaId),
      SecretKey: this.http.getSecretKey(),
    });
  }

  /**
   * Get rating and feedbacks submitted by customers for a rating template
   * @see http://rest.esms.vn/MainService.svc/json/ZNS/GetRating/
   */
  public async getZnsRating(options: QueryZnsRatingOptions): Promise<ZnsRatingResponse> {
    if (options.oaId === undefined || options.oaId === null || options.oaId === '') {
      throw new VihatValidationError('Zalo OA ID is required', 'oaId');
    }
    if (options.templateId === undefined || options.templateId === null || options.templateId === '') {
      throw new VihatValidationError('Template ID is required', 'templateId');
    }
    if (!options.fromTime || !options.toTime) {
      throw new VihatValidationError('fromTime and toTime are required', 'fromTime/toTime');
    }

    const url = `${this.baseUrl}/json/ZNS/GetRating/`;
    return this.http.postJson<ZnsRatingResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      OAID: String(options.oaId),
      TemplateID: String(options.templateId),
      FromTime: options.fromTime,
      ToTime: options.toTime,
      Offset: options.offset ?? 0,
      Limit: options.limit ?? 50,
    });
  }

  /**
   * Send Multi-Channel message (e.g. Zalo ZNS with automatic SMS fallback)
   * @see http://rest.apiesms.com/MainService.svc/json/MultiChannelMessage/
   */
  public async sendMultiChannel(options: SendMultiChannelOptions): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (!Array.isArray(options.channels) || options.channels.length === 0) {
      throw new VihatValidationError('Channels list is required', 'channels');
    }

    const url = `${this.zaloUrl}/json/MultiChannelMessage/`;
    return this.http.postJson<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      Phone: options.phone.trim(),
      Channels: options.channels,
      Data: [
        {
          OAID: String(options.zaloData.oaId),
          TempID: String(options.zaloData.templateId),
          Params: options.zaloData.params.map(String),
          campaignid: options.zaloData.campaignId,
          CallbackUrl: options.zaloData.callbackUrl,
        },
        {
          Content: options.smsData.content,
          IsUnicode: options.smsData.isUnicode ? 1 : 0,
          SmsType: options.smsData.smsType,
          Brandname: options.smsData.brandname,
          RequestId: options.smsData.requestId,
          campaignid: options.smsData.campaignId,
          CallbackUrl: options.smsData.callbackUrl,
        },
      ],
    });
  }
}
