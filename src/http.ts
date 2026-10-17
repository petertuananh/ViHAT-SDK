import {
  DEFAULT_TIMEOUT_MS,
  VIHAT_RESPONSE_CODES,
} from './constants.js';
import {
  VihatApiError,
  VihatHttpError,
  VihatTimeoutError,
} from './errors.js';

export interface HttpClientOptions {
  apiKey: string;
  secretKey: string;
  timeoutMs?: number;
}

export interface RequestOptions {
  timeoutMs?: number;
  skipCodeValidation?: boolean;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly timeoutMs: number;

  constructor(options: HttpClientOptions) {
    this.apiKey = options.apiKey;
    this.secretKey = options.secretKey;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getSecretKey(): string {
    return this.secretKey;
  }

  /**
   * Performs an HTTP GET request
   */
  public async get<T>(
    endpointUrl: string,
    queryParams?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    const url = new URL(endpointUrl);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return this.executeRequest<T>(
      url.toString(),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
      options
    );
  }

  /**
   * Performs an HTTP POST request with JSON payload
   */
  public async postJson<T>(
    endpointUrl: string,
    body: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    return this.executeRequest<T>(
      endpointUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      },
      options
    );
  }

  private async executeRequest<T>(
    fullUrl: string,
    init: RequestInit,
    options?: RequestOptions
  ): Promise<T> {
    const effectiveTimeout = options?.timeoutMs ?? this.timeoutMs;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, effectiveTimeout);

    let response: Response;

    try {
      response = await fetch(fullUrl, {
        ...init,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new VihatTimeoutError(
          `Request to ${fullUrl} timed out after ${effectiveTimeout}ms`,
          effectiveTimeout
        );
      }
      throw new VihatHttpError(
        `Network request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      clearTimeout(timer);
    }

    const responseText = await response.text();

    if (!response.ok) {
      throw new VihatHttpError(
        `HTTP error ${response.status} ${response.statusText}`,
        response.status,
        response.statusText,
        responseText
      );
    }

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      throw new VihatHttpError(
        `Failed to parse JSON response from ${fullUrl}: ${responseText.slice(0, 150)}`,
        response.status,
        response.statusText,
        responseText
      );
    }

    if (!options?.skipCodeValidation && typeof parsedData === 'object' && parsedData !== null) {
      const dataObj = parsedData as Record<string, unknown>;

      const codeResult = dataObj.CodeResult ?? dataObj.codeResult;
      const codeResponse = dataObj.CodeResponse ?? dataObj.codeResponse;

      const code = codeResult !== undefined ? String(codeResult) : codeResponse !== undefined ? String(codeResponse) : undefined;

      // In ViHAT: 100 = success, 200 = success (for OTP GenCode)
      if (code !== undefined && code !== '100' && code !== '200') {
        const errorMsg =
          (dataObj.ErrorMessage as string) ||
          (dataObj.message as string) ||
          (dataObj.Message as string) ||
          VIHAT_RESPONSE_CODES[code];
        throw new VihatApiError(code, parsedData, errorMsg, response.status, fullUrl);
      }
    }

    return parsedData as T;
  }
}
