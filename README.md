# 📦 vihat-sdk

Thư viện Node.js hiện đại cho tích hợp các dịch vụ **[ViHAT](https://vihat.vn/) / [eSMS.vn](https://esms.vn/)** (SMS Brandname, Voice OTP, Zalo ZNS, Multi-Channel, Viber) vào ứng dụng của bạn.

Hỗ trợ TypeScript đầy đủ, modular imports, tree-shaking và không có bất kỳ runtime dependency nào.

---

## 🔗 Thông tin thư viện

- [Website ViHAT](https://vihat.vn/)
- [Cổng dịch vụ eSMS](https://esms.vn/)
- [npm](https://www.npmjs.com/package/vihat-sdk)
- [GitHub](https://github.com/petertuananh/ViHAT-SDK)
- [Báo lỗi / Góp ý](https://github.com/petertuananh/ViHAT-SDK/issues)

> ⚠️ **LƯU Ý QUAN TRỌNG:** Đây là thư viện **backend-only**. Không bao giờ import `VihatClient` trong frontend client-side như React, Vue, Angular hay trình duyệt vì `ApiKey` và `SecretKey` phải được giữ bí mật an toàn trên máy chủ.

---

## ✨ Tính năng

- 💰 **Tra cứu số dư tài khoản:** Kiểm tra số dư khả dụng và thông tin `UserID` trên hệ thống eSMS.
- 📱 **Gửi SMS đa dạng:** Hỗ trợ SMS Brandname Chăm sóc khách hàng (CSKH), đầu số cố định 10 số, tin nhắn Unicode tiếng Việt có dấu, chế độ Sandbox thử nghiệm và hẹn giờ gửi (`SendDate`).
- 🔎 **Tra cứu trạng thái tin nhắn:** Kiểm tra trạng thái tin nhắn theo `SMSID` (RefId) và chi tiết trạng thái gửi đến từng số điện thoại người nhận.
- 📅 **Lịch sử tin nhắn:** Lấy danh sách tin nhắn đã gửi trong khoảng thời gian xác định (`From` - `To`).
- 🏷️ **Quản lý Brandname & Template:** Liệt kê danh sách Brandname đã khai báo và các mẫu Template SMS được duyệt trên hệ thống.
- 🔐 **Sinh mã OTP tự động:** API tự động tạo OTP ngẫu nhiên (`AutoGenCode`), hỗ trợ tạo mã trực tiếp hoặc tạo mã và gửi tự động qua kịch bản Zalo ➔ SMS.
- 📞 **Cuộc gọi tự động (Voice Call API):**
  - Tạo cuộc gọi thoại đọc mã OTP tự động (`sendVoiceOtp`).
  - Cuộc gọi tự động theo mẫu có sẵn (`makeVoiceCallTemplate`), hỗ trợ text-to-speech nhiều giọng đọc Bắc / Trung / Nam và điều chỉnh tốc độ đọc.
  - Cuộc gọi tự động từ file ghi âm (`makeVoiceCallRecord`), hỗ trợ lặp lại, gọi lại khi bận máy và phím bấm tương tác IVR chuyển tiếp cuộc gọi.
  - Tra cứu trạng thái cuộc gọi thoại (`getVoiceCallStatus`) bao gồm thời lượng cuộc gọi (`callduration`), trạng thái trả lời và phím IVR phản hồi.
- 💬 **Zalo ZNS & Zalo Follower:**
  - Gửi tin nhắn Zalo Notification Service (ZNS) theo mẫu template đã duyệt.
  - Gửi ZNS hàng loạt mỗi khách hàng một nội dung/biến số riêng biệt (`sendZnsBulk`).
  - Quản lý Zalo Official Account (OA) và danh sách template ZNS.
  - Lấy danh sách người quan tâm (Follower) của Zalo OA.
  - Gửi tin nhắn tương tác cho Follower: đính kèm hình ảnh (Media), menu danh sách (List Menu), nút bấm tương tác gọi điện/mở web/SMS (Buttons).
  - Kiểm tra hạn mức gửi tin trong ngày (`getZnsQuota`), chất lượng gửi tin 48 giờ & 7 ngày gần nhất (`getZnsQuality`) và phản hồi/đánh giá của khách hàng (`getZnsRating`).
- 🔀 **Tin nhắn Multi-Channel (Đa kênh):** Gửi tin nhắn thông minh theo thứ tự ưu tiên (ví dụ Zalo ZNS ➔ tự động fallback gửi SMS nếu Zalo thất bại).
- 🟣 **Gửi tin nhắn Viber:** Hỗ trợ gửi tin nhắn Viber Brandname kết hợp hình ảnh, nút bấm (CTA) và link liên kết.
- 🔔 **Xử lý Callback / Webhook:** Các hàm helper tiện ích giúp parse và type-cast kết quả webhook trả về từ eSMS cho cả SMS và Voice call.
- 🛡️ **Xử lý lỗi chuyên nghiệp:** Định danh mã lỗi kinh doanh rõ ràng từ eSMS (`VihatApiError`), lỗi tham số đầu vào (`VihatValidationError`), lỗi mạng (`VihatHttpError`) và timeout (`VihatTimeoutError`).
- ⚡ **Zero Dependencies:** Không phụ thuộc axios hay request; sử dụng `fetch` và `AbortController` có sẵn từ Node.js 18+.

---

## 📚 Tài liệu tham khảo

- [Tài liệu API eSMS.vn (Version 24.12.01)](https://esms.vn/)
- [Đăng ký tài khoản & Quản lý API Key eSMS](https://account.esms.vn/)
- [Cổng Zalo for Developers & ZNS Portal](https://developers.zalo.me/)

---

## 🚀 Cài đặt

Cài đặt thư viện thông qua npm:

```bash
npm install vihat-sdk
```

Hoặc qua yarn / pnpm / bun:

```bash
# yarn
yarn add vihat-sdk

# pnpm
pnpm add vihat-sdk

# bun
bun add vihat-sdk
```

---

## 📦 Import

### Import đầy đủ

```typescript
import {
  VihatClient,
  EsmsClient, // Alias của VihatClient
  SmsType,
  BrandnameType,
  VoiceSpeaker,
  VoiceSpeed,
  SendStatus,
  TelcoId,
  parseSmsCallback,
  parseVoiceCallback,
} from "vihat-sdk";
```

### Import theo module (Modular imports / Tree-shaking)

```typescript
// Các hằng số và Enum
import { SmsType, SendStatus, VoiceSpeaker } from "vihat-sdk/constants";

// Lỗi
import { VihatApiError, VihatValidationError } from "vihat-sdk/errors";

// Helper Webhook / Callback
import { parseSmsCallback, parseVoiceCallback } from "vihat-sdk/callback";

// Services riêng lẻ
import { SmsService } from "vihat-sdk/sms";
import { VoiceService } from "vihat-sdk/voice";
import { ZaloService } from "vihat-sdk/zalo";
import { ViberService } from "vihat-sdk/viber";
```

### Types-only (TypeScript)

```typescript
import type {
  VihatConfig,
  SendSmsOptions,
  VihatMessageResponse,
  SendZnsMessageOptions,
  SendMultiChannelOptions,
  MakeVoiceCallTemplateOptions,
  SmsCallbackPayload,
  VoiceCallbackPayload,
} from "vihat-sdk/types";
```

---

## 💳 Khởi tạo client

```typescript
import { VihatClient } from "vihat-sdk";

const vihat = new VihatClient({
  apiKey: process.env.ESMS_API_KEY!,
  secretKey: process.env.ESMS_SECRET_KEY!,
  // Các tùy chọn nâng cao (nếu cần):
  // baseUrl: 'https://restapi.esms.vn/MainService.svc', // Mặc định là https://restapi.esms.vn/MainService.svc
  // voiceUrl: 'http://voiceapi.esms.vn/MainService.svc', // Mặc định là Voice API endpoint
  // ecomUrl: 'http://restecom.esms.vn/MainService.svc',  // Endpoint cho Brandname/ZOA Template
  // zaloUrl: 'http://rest.apiesms.com/MainService.svc',  // Endpoint cho Zalo ZNS / MultiChannel
  // timeoutMs: 30000,                                   // Mặc định 30 giây (30,000ms)
});
```

---

## 🗺️ Chức năng và endpoint eSMS / ViHAT

| Chức năng | Method trong `vihat` | HTTP Request eSMS |
| :--- | :--- | :--- |
| **Tra cứu số dư tài khoản** | `vihat.getBalance()` | `POST /json/GetBalance_json` |
| **Gửi tin nhắn SMS** | `vihat.sendSms()` / `sendMessage()` | `POST /json/SendMultipleMessage_V4_post_json/` hoặc `GET /json/SendMultipleMessage_V4_get` |
| **Kiểm tra trạng thái tin nhắn** | `vihat.getMessageStatus(refId)` | `GET /json/GetSendStatus` |
| **Kiểm tra chi tiết từng số nhận tin** | `vihat.getMessageReceivers(refId)` | `GET /json/GetSmsReceiverStatus_get` |
| **Lấy danh sách tin nhắn theo ngày** | `vihat.getSentData({ from, to })` | `POST /json/GetSmsSentData_V1` |
| **Lấy danh sách Brandname** | `vihat.getBrandnames()` | `GET /json/GetListBrandname/{ApiKey}/{SecretKey}` |
| **Lấy danh sách Template SMS** | `vihat.getSmsTemplates(brandname)` | `POST /json/GetTemplate/` |
| **Tự động sinh mã OTP** | `vihat.generateOtp()` | `POST /json/SendMessageAutoGenCode_V5` |
| **Tạo cuộc gọi theo Template** | `vihat.makeVoiceCallTemplate()` | `GET /json/MakeCallTemplate_V2` |
| **Tạo cuộc gọi từ File ghi âm** | `vihat.makeVoiceCallRecord()` | `GET /json/MakeCallRecord_V2` |
| **Tạo cuộc gọi thoại đọc mã OTP** | `vihat.sendVoiceOtp()` | `GET /json/SendMultipleMessage_V4_get?SmsType=8` |
| **Kiểm tra trạng thái cuộc gọi** | `vihat.getVoiceCallStatus()` | `GET /json/GetSendStatus` (Voice) |
| **Gửi thông báo Zalo ZNS** | `vihat.sendZnsMessage()` | `POST /json/SendZaloMessage_V4_post_json/` |
| **Gửi ZNS mỗi khách một nội dung (Bulk)** | `vihat.sendZnsBulk()` | `POST /json/Send_zns_bulk_v4_post_json/` |
| **Lấy danh sách Zalo OA** | `vihat.getZaloOaList()` | `POST /json/ZNS/GetListZOA/` |
| **Lấy danh sách Template Zalo OA** | `vihat.getZaloTemplates(oaId)` | `POST /json/GetTemplate/` |
| **Lấy danh sách Zalo Follower** | `vihat.getZaloFollowers(oaId)` | `POST /json/ZNS/GetFollowers/` |
| **Gửi tin Zalo Follower kèm ảnh** | `vihat.sendZaloFollowerMedia()` | `POST /json/SendZaloFollowerMessage_V4_post_json/` |
| **Gửi tin Zalo Follower dạng Menu** | `vihat.sendZaloFollowerList()` | `POST /json/SendZaloFollowerMessage_V4_post_json/` |
| **Gửi tin Zalo Follower dạng Button** | `vihat.sendZaloFollowerButton()` | `POST /json/SendZaloFollowerMessage_V5_post_json/` |
| **Lấy Quota gửi ZNS của OA** | `vihat.getZnsQuota(oaId)` | `POST /json/ZNS/GetQuota/` |
| **Lấy chất lượng gửi ZNS của OA** | `vihat.getZnsQuality(oaId)` | `POST /json/ZNS/GetQuality/` |
| **Kiểm tra đánh giá rating ZNS** | `vihat.getZnsRating()` | `POST /json/ZNS/GetRating/` |
| **Gửi tin nhắn Multi-Channel** | `vihat.sendMultiChannel()` | `POST /json/MultiChannelMessage/` |
| **Gửi tin nhắn Viber** | `vihat.sendViberMessage()` | `GET /json/SendMultipleMessage_V4_get?SmsType=23` |

---

## 📖 Chi tiết hướng dẫn sử dụng

### 1. Tra cứu số dư tài khoản

```typescript
const balance = await vihat.getBalance();
console.log(`Số dư: ${balance.Balance.toLocaleString('vi-VN')} VND (UserID: ${balance.UserID})`);
```

---

### 2. Gửi tin nhắn SMS

Hỗ trợ gửi SMS Brandname chăm sóc khách hàng hoặc đầu số cố định 10 số.

```typescript
import { SmsType } from "vihat-sdk";

// Gửi tin nhắn Brandname CSKH
const result = await vihat.sendSms({
  phone: "0901234567",
  content: "Cam on quy khach da su dung dich vu cua chung toi.",
  brandname: "Baotrixemay",
  smsType: SmsType.BRANDNAME_CSKH, // 2
  requestId: "ORDER_9981",         // Idempotency ID của bạn (tối đa 120 ký tự)
  callbackUrl: "https://yourapp.com/api/vihat/sms-callback",
  // isUnicode: 0,                 // 1: Tiếng Việt có dấu, 0: không dấu (mặc định 0)
  // sandbox: 0,                   // 1: thử nghiệm (không trừ tiền, không gửi thật)
});

console.log("SMS ID:", result.SMSID);
```

#### Tra cứu trạng thái tin nhắn đã gửi

```typescript
// Tra cứu tổng thể trạng thái của một lượt gửi tin (SMSID)
const status = await vihat.getMessageStatus("sms-uuid-1234");
console.log(`Trạng thái: ${status.SendStatus}, Thành công: ${status.SendSuccess}/${status.TotalSent}`);

// Tra cứu chi tiết từng số điện thoại người nhận
const receivers = await vihat.getMessageReceivers("sms-uuid-1234");
for (const receiver of receivers.ReceiverList) {
  console.log(`Số: ${receiver.Phone} - Gửi thành công: ${receiver.SentResult}`);
}
```

---

### 3. Tự động sinh mã OTP (`generateOtp`)

eSMS cung cấp API tự động tạo mã OTP ngẫu nhiên:

- **Type 1 (`GEN_CODE_ONLY`):** Hệ thống chỉ sinh mã OTP trả về cho bạn tự xử lý.
- **Type 2 (`GEN_AND_SEND`):** Hệ thống sinh mã và tự động kích hoạt kịch bản gửi tin (Zalo ZNS ➔ SMS fallback).

```typescript
import { OtpGenType } from "vihat-sdk";

// Type 1: Chỉ lấy mã OTP
const otp = await vihat.generateOtp({
  phone: "0901234567",
  timeAlive: 15, // Thời gian hiệu lực (phút)
  typeId: OtpGenType.GEN_CODE_ONLY, // 1
});
console.log("Mã OTP được tạo là:", otp.Message);

// Type 2: Sinh mã và gửi về máy qua kịch bản Zalo -> SMS
const sentOtp = await vihat.generateOtp({
  phone: "0901234567",
  timeAlive: 15,
  typeId: OtpGenType.GEN_AND_SEND, // 2
  multiChannelTempId: "ZALO_SMS_TEMPLATE_ID",
  callbackUrl: "https://yourapp.com/api/vihat/otp-callback",
});
console.log("SMSID lượt gửi OTP:", sentOtp.SMSID);
```

---

### 4. Cuộc gọi tự động (Voice Call API)

#### Cuộc gọi thoại đọc mã OTP (`sendVoiceOtp`)

```typescript
const voiceOtp = await vihat.sendVoiceOtp({
  phone: "0901234567",
  code: 6868, // Mã OTP cần đọc cho người nghe
});
console.log("Cuộc gọi OTP SMSID:", voiceOtp.SMSID);
```

#### Cuộc gọi tự động theo Template Text-To-Speech

```typescript
import { VoiceSpeaker, VoiceSpeed } from "vihat-sdk";

const voiceCall = await vihat.makeVoiceCallTemplate({
  phone: "0901234567",
  templateId: "12345",
  variableListStr: ["Tuấn Anh", "500000"], // Biến truyền vào template, tự động nối bởi '||'
  voice: VoiceSpeaker.HATIEUMAI,            // Giọng nữ miền Nam (male, female, hatieumai, ngoclam)
  speed: VoiceSpeed.NORMAL,                 // Tốc độ: -3 (rất chậm) đến 3 (rất nhanh)
  callbackUrl: "https://yourapp.com/api/vihat/voice-callback",
});
```

#### Cuộc gọi từ file ghi âm có tương tác phím IVR

```typescript
const recordCall = await vihat.makeVoiceCallRecord({
  phone: "0901234567",
  templateId: "RECORD_FILE_ID", // Id file ghi âm đã upload trên account.esms.vn
  maxRepeat: 2,                 // Số lần lặp lại file ghi âm
  maxRetry: 3,                  // Số lần gọi lại nếu khách không bắt máy
  waitRetry: 60,                // Khoảng cách giữa các lần gọi lại (giây)
  ivr: 1,                       // Phím bấm để chuyển tiếp cuộc gọi
  numberForward: "0909999999",  // Số điện thoại nhận chuyển tiếp khi khách bấm phím 1
  timeWaitToIvr: 10,            // Thời gian chờ khách bấm phím (giây)
  callbackUrl: "https://yourapp.com/api/vihat/voice-callback",
});
```

#### Kiểm tra trạng thái cuộc gọi

```typescript
const callStatus = await vihat.getVoiceCallStatus("call-reference-id");
console.log(`Kết quả: ${callStatus.callstatus}, Thời lượng: ${callStatus.callduration}s, Phím bấm: ${callStatus.ivr}`);
```

---

### 5. Zalo ZNS (Zalo Notification Service)

Gửi thông báo ZNS đến số điện thoại người dùng đã đăng ký Zalo:

```typescript
const znsResult = await vihat.sendZnsMessage({
  phone: "0842090998",
  oaId: "35897654231871",
  templateId: "686868",
  params: ["Nguyễn Văn A", "DH123456", "250.000đ"], // Các biến theo thứ tự khai báo trên Zalo
  campaignId: "Chien_dich_xac_nhan_don",
  callbackUrl: "https://yourapp.com/api/vihat/zns-callback",
});
console.log("ZNS SMSID:", znsResult.SMSID);
```

#### Gửi ZNS Bulk (Mỗi khách hàng một nội dung/biến số)

```typescript
const bulkResult = await vihat.sendZnsBulk({
  oaId: "745830328927467685",
  templateId: "686868",
  data: [
    { phone: "0707494337", params: ["Khách hàng 1", "Mã giảm giá A"] },
    { phone: "0922090763", params: ["Khách hàng 2", "Mã giảm giá B"] },
  ],
});
console.log(`Đã gửi: Thành công ${bulkResult.TotalSuccess}, Thất bại ${bulkResult.TotalFail}`);
```

#### Quản lý Zalo OA & Kiểm tra hạn mức, chất lượng gửi

```typescript
// Lấy danh sách Zalo OA liên kết với eSMS
const oasList = await vihat.getZaloOaList();

// Lấy danh sách Template của OA
const templates = await vihat.getZaloTemplates("35897654231871");

// Kiểm tra hạn mức (Quota) còn lại trong ngày
const quota = await vihat.getZnsQuota("35897654231871");
console.log(`Hạn mức: ${quota.RemainingQuota}/${quota.DailyQuota}`);

// Kiểm tra chất lượng gửi tin ZNS của OA
const quality = await vihat.getZnsQuality("35897654231871");
console.log(`Chất lượng 48h: ${quality.Oa7dayQuality}, 7 ngày: ${quality.OaCurrentQuality}`);
```

---

### 6. Gửi tin nhắn cho người quan tâm Zalo OA (Follower)

Khi khách hàng đã nhấn "Quan tâm" (Follow) Zalo OA, bạn có thể gửi các định dạng tin nhắn tương tác phong phú:

#### Gửi tin nhắn kèm ảnh (Media)

```typescript
await vihat.sendZaloFollowerMedia({
  oaId: "35897654231871",
  userId: "8813370397556853094",
  content: "Chào mừng quý khách đến với dịch vụ của chúng tôi!",
  url: "https://example.com/banner.png",
});
```

#### Gửi tin nhắn dạng Danh mục Menu (List Menu)

```typescript
await vihat.sendZaloFollowerList({
  oaId: "35897654231871",
  userId: "8813370397556853094",
  elements: [
    {
      title: "Sản phẩm nổi bật 2026",
      subtitle: "Ưu đãi giảm giá 30% khi đặt mua hôm nay",
      imageUrl: "https://example.com/banner.jpg",
      defaultAction: {
        type: "oa.open.url",
        url: "https://example.com/san-pham",
      },
    },
    {
      title: "Tổng đài hỗ trợ 24/7",
      imageUrl: "https://example.com/hotline.png",
      defaultAction: {
        type: "oa.open.phone",
        phoneCode: "84901888484",
      },
    },
  ],
});
```

#### Gửi tin nhắn kèm Nút bấm tương tác (Buttons)

```typescript
await vihat.sendZaloFollowerButton({
  oaId: "35897654231871",
  userId: "8813370397556853094",
  text: "Cảm ơn bạn đã quan tâm. Hãy chọn thao tác bên dưới:",
  buttons: [
    {
      title: "Xem Website",
      type: "oa.open.url",
      payload: { url: "https://vihat.vn" },
    },
    {
      title: "Gọi Hotline",
      type: "oa.open.phone",
      payload: { phone_code: "0901888484" },
    },
    {
      title: "Gửi SMS hỗ trợ",
      type: "oa.open.sms",
      payload: { content: "Toi can ho tro", phone_code: "0901888484" },
    },
  ],
});
```

---

### 7. Gửi tin nhắn Multi-Channel (Zalo ➔ SMS Fallback)

Tính năng thông minh giúp tối ưu chi phí: Gửi qua Zalo ZNS trước, nếu gửi thất bại hoặc khách không dùng Zalo, hệ thống tự động chuyển tiếp nội dung sang SMS:

```typescript
import { SmsType } from "vihat-sdk";

const multiResult = await vihat.sendMultiChannel({
  phone: "0350000026",
  channels: ["zalo", "sms"],
  zaloData: {
    oaId: "436181207180",
    templateId: "200300",
    params: ["Nguyễn Văn A", "DH9988"],
    campaignId: "Chien_dich_xac_nhan",
  },
  smsData: {
    content: "Don hang DH9988 cua ban da duoc tiep nhan.",
    smsType: SmsType.BRANDNAME_CSKH,
    brandname: "eSMS",
    campaignId: "Chien_dich_xac_nhan",
  },
});
```

---

### 8. Gửi tin nhắn Viber

```typescript
const viberResult = await vihat.sendViberMessage({
  phone: "0842090998",
  brandname: "eSMS.vn",
  content: "Ưu đãi đặc biệt nhân dịp ngày lễ dành riêng cho bạn!",
  ottLabel: "Xem chi tiết ngay",
  ottUrl: "https://example.com/voucher",
  ottImgUrl: "https://example.com/viber-banner.jpg",
});
```

---

## 🔔 Xử lý Callback / Webhook

eSMS sẽ gọi đến `CallbackUrl` của bạn khi trạng thái tin nhắn hoặc cuộc gọi thay đổi. Bạn có thể dùng helper `parseSmsCallback` và `parseVoiceCallback` với Express, Fastify, NestJS, Hono:

### Ví dụ với Express

```typescript
import express from "express";
import { parseSmsCallback, parseVoiceCallback, SendStatus, getTelcoName } from "vihat-sdk";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Webhook nhận kết quả gửi tin SMS / ZNS
app.get("/api/vihat/sms-callback", (req, res) => {
  // Tự động parse từ query string hoặc req.query
  const callback = parseSmsCallback(req.query);

  console.log(`[SMS Callback] SMSID: ${callback.SMSID}`);
  console.log(`Nhà mạng: ${getTelcoName(callback.telcoid)}`);
  console.log(`Gửi thành công: ${callback.SendSuccess}, Thất bại: ${callback.SendFailed}`);

  if (callback.SendStatus === SendStatus.SENT) {
    console.log("Tin nhắn đã được gửi đến thiết bị thành công!");
    // Cập nhật trạng thái tin nhắn trong cơ sở dữ liệu của bạn...
  }

  res.status(200).send("OK");
});

// Webhook nhận kết quả cuộc gọi Voice
app.get("/api/vihat/voice-callback", (req, res) => {
  const call = parseVoiceCallback(req.query);

  console.log(`[Voice Callback] RefID: ${call.ReferenceId}`);
  console.log(`Trạng thái: ${call.CallStatus}, Thời lượng: ${call.CallDuration}s`);
  console.log(`Khách bấm phím: ${call.Ivr}`);

  res.status(200).send("OK");
});
```

---

## ⚠️ Xử lý lỗi

Thư viện ném ra các lỗi kế thừa từ `VihatError`, giúp bạn dễ dàng bắt và phân loại lỗi:

```typescript
import {
  VihatError,
  VihatApiError,
  VihatValidationError,
  VihatTimeoutError,
  VihatHttpError,
} from "vihat-sdk";

try {
  await vihat.sendSms({
    phone: "0901234567",
    content: "Test nội dung",
    brandname: "BrandChuaDangKy",
  });
} catch (error) {
  if (error instanceof VihatApiError) {
    // Lỗi trả về từ eSMS / ViHAT API (CodeResult / CodeResponse khác 100/200)
    console.error("Mã lỗi eSMS:", error.resultCode);
    console.error("Thông báo lỗi:", error.message);
    console.error("Dữ liệu thô từ API:", error.rawResponse);
  } else if (error instanceof VihatValidationError) {
    // Lỗi kiểm tra tham số đầu vào phía client (thiếu số điện thoại, thiếu brandname...)
    console.error("Lỗi tham số trường:", error.field);
    console.error("Chi tiết:", error.message);
  } else if (error instanceof VihatTimeoutError) {
    // Quá thời gian chờ phản hồi (mặc định 30s)
    console.error(`Request bị timeout sau ${error.timeoutMs}ms`);
  } else if (error instanceof VihatHttpError) {
    // Lỗi HTTP / kết nối mạng (500, DNS error, rớt mạng...)
    console.error("Lỗi mạng:", error.statusCode, error.message);
  } else if (error instanceof VihatError) {
    console.error("Lỗi ViHAT:", error.code, error.message);
  } else {
    console.error("Lỗi không mong muốn:", error);
  }
}
```

---

## 🛠️ Phát triển & Đóng góp

Dự án sử dụng Node.js built-in `node:test` và mock fetch, không cần cài thêm thư viện test nặng nề:

```bash
# Cài đặt dev dependencies (TypeScript, @types/node)
npm install

# Build mã nguồn thành dual ESM / CommonJS (.d.ts)
npm run build

# Chạy toàn bộ test suites
npm test

# Kiểm tra bundle tarball trước khi publish
npm pack --dry-run
```

---

## 📄 Bản quyền

Phát hành theo giấy phép [MIT](LICENSE).

Bản quyền (c) 2026 Peter Tuan Anh ([petertuananh@hotmail.com](mailto:petertuananh@hotmail.com)).
