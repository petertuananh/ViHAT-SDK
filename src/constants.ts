/**
 * Default API endpoints for ViHAT (eSMS.vn) services
 */
export const VIHAT_BASE_URL = 'http://rest.esms.vn/MainService.svc';
export const VIHAT_RESTAPI_URL = 'https://restapi.esms.vn/MainService.svc';
export const VIHAT_VOICE_URL = 'http://voiceapi.esms.vn/MainService.svc';
export const VIHAT_ECOM_URL = 'http://restecom.esms.vn/MainService.svc';
export const VIHAT_ZALO_URL = 'http://rest.apiesms.com/MainService.svc';

/**
 * Default timeout in milliseconds (30 seconds)
 */
export const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * SMS Types supported by eSMS / ViHAT
 */
export const SmsType = {
  /** Brandname Chăm sóc khách hàng (khuyến khích sử dụng) */
  BRANDNAME_CSKH: 2,
  /** Đầu số cố định 10 số chuyên dùng cho chăm sóc khách hàng */
  FIXED_NUMBER_10: 8,
  /** Gửi tin nhắn Viber */
  VIBER: 23,
  /** Tin nhắn Zalo ưu tiên */
  ZALO_PRIORITY: 24,
  /** Tin nhắn Zalo thường */
  ZALO_NORMAL: 25,
} as const;

export type SmsTypeValue = (typeof SmsType)[keyof typeof SmsType];

/**
 * Brandname Type
 */
export const BrandnameType = {
  /** Tin nhắn Quảng cáo */
  ADVERTISING: 1,
  /** Tin nhắn Chăm sóc khách hàng */
  CSKH: 2,
} as const;

export type BrandnameTypeValue = (typeof BrandnameType)[keyof typeof BrandnameType];

/**
 * OTP Code Generation Types
 */
export const OtpGenType = {
  /** Chỉ tạo ra mã Code */
  GEN_CODE_ONLY: 1,
  /** Tạo ra và gửi tin nhắn về máy (Zalo -> SMS fallback) */
  GEN_AND_SEND: 2,
} as const;

export type OtpGenTypeValue = (typeof OtpGenType)[keyof typeof OtpGenType];

/**
 * Voice text-to-speech speaker voices
 */
export const VoiceSpeaker = {
  /** Giọng nam miền Bắc */
  MALE: 'male',
  /** Giọng nữ miền Bắc */
  FEMALE: 'female',
  /** Giọng nữ miền Nam */
  HATIEUMAI: 'hatieumai',
  /** Giọng nữ Huế */
  NGOCLAM: 'ngoclam',
} as const;

export type VoiceSpeakerValue = (typeof VoiceSpeaker)[keyof typeof VoiceSpeaker];

/**
 * Voice text-to-speech reading speeds
 */
export const VoiceSpeed = {
  VERY_SLOW: -3,
  RATHER_SLOW: -2,
  SLOW: -1,
  NORMAL: 0,
  FAST: 1,
  RATHER_FAST: 2,
  VERY_FAST: 3,
} as const;

export type VoiceSpeedValue = (typeof VoiceSpeed)[keyof typeof VoiceSpeed];

/**
 * SMS / Notification Sending Status in eSMS
 */
export const SendStatus = {
  /** Chờ duyệt */
  PENDING_APPROVAL: 1,
  /** Đang chờ gửi */
  WAITING_TO_SEND: 2,
  /** Đang gửi */
  SENDING: 3,
  /** Bị từ chối */
  REJECTED: 4,
  /** Đã gửi xong */
  SENT: 5,
  /** Đã bị xoá */
  DELETED: 6,
} as const;

export type SendStatusValue = (typeof SendStatus)[keyof typeof SendStatus];

/**
 * Telco IDs
 */
export const TelcoId = {
  VIETTEL: 1,
  MOBIFONE: 2,
  VINAPHONE: 3,
  VIETNAMMOBILE: 4,
  GTEL: 5,
  ITEL: 6,
} as const;

export type TelcoIdValue = (typeof TelcoId)[keyof typeof TelcoId];

/**
 * Telco Name Mapping
 */
export const TELCO_NAMES: Record<number, string> = {
  1: 'Viettel',
  2: 'MobiFone',
  3: 'VinaPhone',
  4: 'Vietnamobile',
  5: 'Gtel',
  6: 'ITel',
};

/**
 * Standard ViHAT / eSMS Result and Error Code mappings
 */
export const VIHAT_RESPONSE_CODES: Record<string, string> = {
  '100': 'Request thành công / Đã được nhận và xử lý thành công',
  '200': 'Thành công (OTP Code)',
  '99': 'Lỗi không xác định, thử lại sau',
  '101': 'Đăng nhập thất bại (ApiKey hoặc SecretKey không đúng)',
  '102': 'Tài khoản đã bị khóa hoặc chưa có bảng giá',
  '103': 'Số dư tài khoản không đủ để gửi tin',
  '104': 'Mã Brandname không đúng hoặc không tồn tại hoặc đã bị hủy',
  '105': 'Id cuộc gọi/tin nhắn không tồn tại hoặc danh sách biến mẫu không hợp lệ',
  '106': 'File ghi âm không tồn tại',
  '107': 'Sai số điện thoại',
  '118': 'Loại tin nhắn không hợp lệ',
  '119': 'Brandname quảng cáo phải gửi ít nhất 20 số điện thoại hoặc sai TempID',
  '124': 'Trùng RequestId',
  '131': 'Tin nhắn brandname quảng cáo độ dài tối đa 422 ký tự',
  '132': 'Không có quyền gửi tin nhắn đầu số cố định 8755',
  '140': 'Thời gian không hợp lệ',
  '145': 'Sai template mạng xã hội',
  '146': 'Sai template Brandname CSKH',
  '159': 'RequestId quá 120 ký tự hoặc thiếu thuộc tính',
  '177': 'Brandname chưa đăng ký hướng mạng với nhà mạng (Viettel, Vina, Mobi, Gtel, Vietnamobile)',
  '204': 'Không tìm thấy thông tin',
  '300': 'Không có loại tin nhắn này',
  '788': 'Sai OA ID hoặc OA ID không active',
  '789': 'OA chưa được add hoặc sai OAID',
  '790': 'Tham số Params không khớp với template ZNS',
  '791': 'Thiếu OAID hoặc sai OAID hoặc thiếu Params',
};
