import type { HttpClient } from '../http.js';
import { VihatValidationError } from '../errors.js';
import type {
  MakeVoiceCallRecordOptions,
  MakeVoiceCallTemplateOptions,
  SendVoiceOtpOptions,
  VihatMessageResponse,
  VoiceCallStatusResponse,
} from '../types/index.js';

export class VoiceService {
  private readonly http: HttpClient;
  private readonly voiceUrl: string;
  private readonly baseUrl: string;

  constructor(http: HttpClient, voiceUrl: string, baseUrl: string) {
    this.http = http;
    this.voiceUrl = voiceUrl.replace(/\/+$/, '');
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Check status of a voice call by Reference ID (SMSID)
   * @see http://voiceapi.esms.vn/MainService.svc/json/GetSendStatus
   */
  public async getVoiceCallStatus(referenceId: string): Promise<VoiceCallStatusResponse> {
    if (!referenceId || !referenceId.trim()) {
      throw new VihatValidationError('Voice referenceId is required', 'referenceId');
    }
    const url = `${this.voiceUrl}/json/GetSendStatus`;
    return this.http.get<VoiceCallStatusResponse>(url, {
      ReferenceId: referenceId.trim(),
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
    });
  }

  /**
   * Make an automated voice call using a registered template
   * @see http://voiceapi.esms.vn/MainService.svc/json/MakeCallTemplate_V2
   */
  public async makeVoiceCallTemplate(
    options: MakeVoiceCallTemplateOptions
  ): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (options.templateId === undefined || options.templateId === null || options.templateId === '') {
      throw new VihatValidationError('Template ID is required', 'templateId');
    }

    let variableListStr: string | undefined;
    if (Array.isArray(options.variableListStr)) {
      variableListStr = options.variableListStr.join('||');
    } else if (typeof options.variableListStr === 'string') {
      variableListStr = options.variableListStr;
    }

    const url = `${this.voiceUrl}/json/MakeCallTemplate_V2`;
    return this.http.get<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      TemplateId: String(options.templateId),
      Phone: options.phone.trim(),
      VariableListStr: variableListStr,
      SendDate: options.sendDate,
      Voice: options.voice,
      Speed: options.speed !== undefined ? String(options.speed) : undefined,
      CallbackUrl: options.callbackUrl,
      RequestId: options.requestId,
    });
  }

  /**
   * Make an automated voice call using a pre-recorded audio file
   * @see http://voiceapi.esms.vn/MainService.svc/json/MakeCallRecord_V2
   */
  public async makeVoiceCallRecord(
    options: MakeVoiceCallRecordOptions
  ): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (options.templateId === undefined || options.templateId === null || options.templateId === '') {
      throw new VihatValidationError('Template ID (RecordId) is required', 'templateId');
    }

    const url = `${this.voiceUrl}/json/MakeCallRecord_V2`;
    return this.http.get<VihatMessageResponse>(url, {
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      TemplateId: String(options.templateId),
      Phone: options.phone.trim(),
      SendDate: options.sendDate,
      NumberForward: options.numberForward,
      MaxRepeat: options.maxRepeat !== undefined ? String(options.maxRepeat) : undefined,
      MaxRetry: options.maxRetry !== undefined ? String(options.maxRetry) : undefined,
      Ivr: options.ivr !== undefined ? String(options.ivr) : undefined,
      TimeWaitToIvr: options.timeWaitToIvr !== undefined ? String(options.timeWaitToIvr) : undefined,
      WaitRetry: options.waitRetry !== undefined ? String(options.waitRetry) : undefined,
      CallbackUrl: options.callbackUrl,
      RequestID: options.requestId,
    });
  }

  /**
   * Send a voice call speaking an OTP code
   * @see http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?SmsType=8
   */
  public async sendVoiceOtp(options: SendVoiceOtpOptions): Promise<VihatMessageResponse> {
    if (!options.phone || !options.phone.trim()) {
      throw new VihatValidationError('Phone number is required', 'phone');
    }
    if (options.code === undefined || options.code === null || options.code === '') {
      throw new VihatValidationError('OTP Code is required', 'code');
    }

    const url = `${this.baseUrl}/json/SendMultipleMessage_V4_get`;
    return this.http.get<VihatMessageResponse>(url, {
      SmsType: '8',
      ApiKey: this.http.getApiKey(),
      SecretKey: this.http.getSecretKey(),
      Phone: options.phone.trim(),
      Content: String(options.code),
    });
  }
}
