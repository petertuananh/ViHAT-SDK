import { VIHAT_RESPONSE_CODES } from './constants.js';

/**
 * Base error class for all ViHAT SDK errors
 */
export class VihatError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'VIHAT_ERROR') {
    super(message);
    this.name = 'VihatError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error raised when input validation fails before making an API call
 */
export class VihatValidationError extends VihatError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'INVALID_ARGUMENT');
    this.name = 'VihatValidationError';
    this.field = field;
  }
}

/**
 * Error raised when an HTTP network error occurs
 */
export class VihatHttpError extends VihatError {
  public readonly statusCode?: number;
  public readonly statusText?: string;
  public readonly responseBody?: string;

  constructor(
    message: string,
    statusCode?: number,
    statusText?: string,
    responseBody?: string
  ) {
    super(message, 'HTTP_ERROR');
    this.name = 'VihatHttpError';
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

/**
 * Error raised when a request exceeds the configured timeout
 */
export class VihatTimeoutError extends VihatError {
  public readonly timeoutMs: number;

  constructor(message: string, timeoutMs: number) {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'VihatTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Error raised when the ViHAT / eSMS API returns a business error code (CodeResult / CodeResponse != 100/200)
 */
export class VihatApiError extends VihatError {
  public readonly resultCode: string;
  public readonly rawResponse: unknown;
  public readonly httpStatus?: number;
  public readonly url?: string;

  constructor(
    resultCode: string | number,
    rawResponse: unknown,
    customMessage?: string,
    httpStatus?: number,
    url?: string
  ) {
    const codeStr = String(resultCode);
    const standardMessage = VIHAT_RESPONSE_CODES[codeStr];
    const message = customMessage || standardMessage || `ViHAT API error with code: ${codeStr}`;

    super(message, `API_ERROR_${codeStr}`);
    this.name = 'VihatApiError';
    this.resultCode = codeStr;
    this.rawResponse = rawResponse;
    this.httpStatus = httpStatus;
    this.url = url;
  }
}
