import type { HttpClient } from '../http.js';
import { SmsType } from '../constants.js';
import { VihatValidationError } from '../errors.js';
import type { SendViberOptions, VihatMessageResponse } from '../types/index.js';

export class ViberService {
  private readonly http: HttpClient;
  private readonly baseUrl: string;

  constructor(http: HttpClient, baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Send a Viber message to a recipient phone number
   * @see https://restapi.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?SmsType=23
   */
  public async sendViberMessage(options: SendViberOptions): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (!options.brandname || !options.brandname.trim()) {
      throw new VihatValidationError('Viber Brandname is required', 'brandname');
    }

    const hasAnyContent = Boolean(
      (options.content && options.content.trim()) ||
        (options.ottImgUrl && options.ottImgUrl.trim())
    );

    if (!hasAnyContent) {
      throw new VihatValidationError(
        'At least content or ottImgUrl must be provided for Viber message',
        'content/ottImgUrl'
      );
    }

    const url = `${this.baseUrl}/json/SendMultipleMessage_V4_get`;
    return this.http.get<VihatMessageResponse>(url, {
      Phone: options.phone.trim(),
      Content: options.content,
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      SmsType: String(SmsType.VIBER),
      Brandname: options.brandname.trim(),
      OTTUrl: options.ottUrl,
      OTTImgUrl: options.ottImgUrl,
      OTTLabel: options.ottLabel,
      CallbackUrl: options.callbackUrl,
      RequestId: options.requestId,
    });
  }
}
