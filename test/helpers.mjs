/**
 * Test helper to mock global fetch with custom responses or inspect calls
 */
export function createMockFetch(handler) {
  const originalFetch = globalThis.fetch;
  const calls = [];

  const mock = async (url, init) => {
    calls.push({ url: String(url), init });

    if (init?.signal) {
      if (init.signal.aborted) {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        throw error;
      }

      return new Promise((resolve, reject) => {
        const onAbort = () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        };

        init.signal.addEventListener('abort', onAbort, { once: true });

        Promise.resolve()
          .then(() => handler(String(url), init))
          .then((res) => {
            init.signal.removeEventListener('abort', onAbort);
            resolve(res);
          })
          .catch((err) => {
            init.signal.removeEventListener('abort', onAbort);
            reject(err);
          });
      });
    }

    const response = await handler(String(url), init);
    return response;
  };

  globalThis.fetch = mock;

  return {
    calls,
    restore() {
      globalThis.fetch = originalFetch;
    },
  };
}

export function jsonResponse(data, status = 200, statusText = 'OK') {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { 'Content-Type': 'application/json' },
  });
}
