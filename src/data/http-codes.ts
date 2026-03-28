export type HTTPCategory = 'informational' | 'success' | 'redirection' | 'client_error' | 'server_error';

export interface HTTPCode {
  code: number;
  name: string;
  category: HTTPCategory;
  description: string;
  spec: string;
  specUrl: string;
  commonUse: string;
  example?: {
    request: string;
    response: string;
  };
  headers?: {
    name: string;
    description: string;
    example: string;
  }[];
  relatedCodes?: number[];
  apiResponse?: {
    defaultHeaders?: Record<string, string>;
    defaultBody?: string;
  };
}

export const categoryConfig: Record<HTTPCategory, { label: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  informational: {
    label: 'Informational',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    icon: 'ℹ️'
  },
  success: {
    label: 'Success',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: '✅'
  },
  redirection: {
    label: 'Redirection',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: '↪️'
  },
  client_error: {
    label: 'Client Error',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    icon: '⚠️'
  },
  server_error: {
    label: 'Server Error',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: '🔥'
  }
};

export const httpCodes: HTTPCode[] = [
  // 1xx Informational
  {
    code: 100,
    name: 'Continue',
    category: 'informational',
    description: 'The server has received the request headers and the client should proceed to send the request body.',
    spec: 'RFC 9110, Section 15.2.1',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.2.1',
    commonUse: 'Used when the client sends a request with an Expect: 100-continue header. The server confirms it\'s ready to receive the body before the client sends it, saving bandwidth if the request would be rejected. Note: 1xx status codes are informational and cannot be sent as a final HTTP response. Our API returns them with status 200 and an X-Original-Status header indicating the original code. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/100',
    example: {
      request: 'PUT /upload HTTP/1.1\nHost: example.com\nContent-Length: 1024\nExpect: 100-continue',
      response: 'HTTP/1.1 100 Continue'
    },
    relatedCodes: [101, 102, 103]
  },
  {
    code: 101,
    name: 'Switching Protocols',
    category: 'informational',
    description: 'The server agrees to switch protocols as requested by the client via the Upgrade header.',
    spec: 'RFC 9110, Section 15.2.2',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.2.2',
    commonUse: 'Commonly used when upgrading from HTTP to WebSocket connections, or from HTTP/1.1 to HTTP/2 or HTTP/3. Note: 1xx status codes are informational and cannot be sent as a final HTTP response. Our API returns them with status 200 and an X-Original-Status header indicating the original code. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/101',
    example: {
      request: 'GET /chat HTTP/1.1\nHost: example.com\nUpgrade: websocket\nConnection: Upgrade',
      response: 'HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade'
    },
    relatedCodes: [100, 102, 103]
  },
  {
    code: 102,
    name: 'Processing',
    category: 'informational',
    description: 'The server has received and is processing the request, but no response is available yet.',
    spec: 'RFC 2518',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc2518',
    commonUse: 'Used in WebDAV operations to prevent client timeout when processing complex requests that may take a long time. Note: 1xx status codes are informational and cannot be sent as a final HTTP response. Our API returns them with status 200 and an X-Original-Status header indicating the original code. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/102',
    relatedCodes: [100, 101, 103]
  },
  {
    code: 103,
    name: 'Early Hints',
    category: 'informational',
    description: 'Used to return some response headers before the final HTTP message.',
    spec: 'RFC 8297',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc8297',
    commonUse: 'Allows browsers to start preloading critical resources (CSS, JS) while the server prepares the main response, improving page load times. Note: 1xx status codes are informational and cannot be sent as a final HTTP response. Our API returns them with status 200 and an X-Original-Status header indicating the original code. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/103',
    headers: [
      {
        name: 'Link',
        description: 'Hints for resources the browser should preload',
        example: 'Link: </style.css>; rel=preload; as=style'
      }
    ],
    relatedCodes: [100, 101, 102]
  },

  // 2xx Success
  {
    code: 200,
    name: 'OK',
    category: 'success',
    description: 'The request has succeeded. The meaning of the success depends on the HTTP method used.',
    spec: 'RFC 9110, Section 15.3.1',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.1',
    commonUse: 'The most common success response. GET returns the requested resource, POST returns the result of the action, PUT/DELETE confirm successful modification.',
    example: {
      request: 'GET /users/123 HTTP/1.1\nHost: api.example.com',
      response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id": 123, "name": "John Doe"}'
    },
    relatedCodes: [201, 204, 206]
  },
  {
    code: 201,
    name: 'Created',
    category: 'success',
    description: 'The request has been fulfilled and has resulted in one or more new resources being created.',
    spec: 'RFC 9110, Section 15.3.2',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.2',
    commonUse: 'Standard response for POST requests that create new resources. The response typically includes a Location header pointing to the new resource.',
    example: {
      request: 'POST /users HTTP/1.1\nContent-Type: application/json\n\n{"name": "Jane Doe"}',
      response: 'HTTP/1.1 201 Created\nLocation: /users/124\nContent-Type: application/json\n\n{"id": 124, "name": "Jane Doe"}'
    },
    headers: [
      {
        name: 'Location',
        description: 'URI of the newly created resource',
        example: 'Location: /users/124'
      }
    ],
    relatedCodes: [200, 202, 204]
  },
  {
    code: 202,
    name: 'Accepted',
    category: 'success',
    description: 'The request has been accepted for processing, but the processing has not been completed.',
    spec: 'RFC 9110, Section 15.3.3',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.3',
    commonUse: 'Used for asynchronous processing. The request is valid and queued for processing (e.g., video transcoding, batch jobs, report generation).',
    example: {
      request: 'POST /jobs/export HTTP/1.1\nContent-Type: application/json',
      response: 'HTTP/1.1 202 Accepted\nLocation: /jobs/12345/status'
    },
    relatedCodes: [200, 201, 204]
  },
  {
    code: 203,
    name: 'Non-Authoritative Information',
    category: 'success',
    description: 'The request was successful but the payload has been modified by a transforming proxy.',
    spec: 'RFC 9110, Section 15.3.4',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.4',
    commonUse: 'Rarely used. Indicates the response came from a cache or proxy that modified the original response (e.g., converted image format, compressed content).',
    relatedCodes: [200, 204]
  },
  {
    code: 204,
    name: 'No Content',
    category: 'success',
    description: 'The server successfully processed the request and is not returning any content.',
    spec: 'RFC 9110, Section 15.3.5',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.5',
    commonUse: 'Common for DELETE requests and successful PUT updates where no body is needed. Also used for preflight OPTIONS responses.',
    example: {
      request: 'DELETE /users/123 HTTP/1.1',
      response: 'HTTP/1.1 204 No Content'
    },
    relatedCodes: [200, 201, 202]
  },
  {
    code: 205,
    name: 'Reset Content',
    category: 'success',
    description: 'The server successfully processed the request and asks the client to reset its document view.',
    spec: 'RFC 9110, Section 15.3.6',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.6',
    commonUse: 'Rarely used in modern web applications. Originally designed for form submissions where the form should be cleared after successful submission.',
    relatedCodes: [200, 204]
  },
  {
    code: 206,
    name: 'Partial Content',
    category: 'success',
    description: 'The server is delivering only part of the resource due to a range header sent by the client.',
    spec: 'RFC 9110, Section 15.3.7',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.7',
    commonUse: 'Used for resumable downloads, video streaming (seeking), and large file downloads split into chunks. Supports parallel download segments.',
    example: {
      request: 'GET /video.mp4 HTTP/1.1\nRange: bytes=0-1023',
      response: 'HTTP/1.1 206 Partial Content\nContent-Range: bytes 0-1023/2048'
    },
    headers: [
      {
        name: 'Content-Range',
        description: 'Indicates the part of the resource being sent',
        example: 'Content-Range: bytes 0-1023/2048'
      }
    ],
    relatedCodes: [200, 416]
  },
  {
    code: 207,
    name: 'Multi-Status',
    category: 'success',
    description: 'Provides status for multiple independent operations in a single response.',
    spec: 'RFC 4918',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc4918',
    commonUse: 'WebDAV response for batch operations. The response body contains XML with individual status codes for each operation (e.g., multiple file operations).',
    relatedCodes: [200, 422]
  },
  {
    code: 208,
    name: 'Already Reported',
    category: 'success',
    description: 'Used in a 207 Multi-Status response to avoid repeatedly enumerating internal members of multiple bindings to the same collection.',
    spec: 'RFC 5842',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc5842',
    commonUse: 'WebDAV specific. Prevents duplicate listing of resources that appear multiple times in a directory structure (bound to multiple locations).',
    relatedCodes: [207]
  },
  {
    code: 226,
    name: 'IM Used',
    category: 'success',
    description: 'The server has fulfilled a GET request with instance manipulations applied.',
    spec: 'RFC 3229',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc3229',
    commonUse: 'Used with delta encoding. The server returns only the differences between the client\'s cached version and the current version, saving bandwidth.',
    relatedCodes: [200, 206]
  },

  // 3xx Redirection
  {
    code: 300,
    name: 'Multiple Choices',
    category: 'redirection',
    description: 'The request has multiple possible responses. The user-agent or user should choose one.',
    spec: 'RFC 9110, Section 15.4.1',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.1',
    commonUse: 'Rare in APIs. Sometimes used for content negotiation (different formats available) or when a resource exists at multiple locations.',
    relatedCodes: [301, 302, 303, 307, 308]
  },
  {
    code: 301,
    name: 'Moved Permanently',
    category: 'redirection',
    description: 'The requested resource has been permanently moved to a new URL.',
    spec: 'RFC 9110, Section 15.4.2',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.2',
    commonUse: 'Used when a resource permanently changes its URL. SEO-critical: search engines update their indexes. Browsers cache this redirect indefinitely.',
    example: {
      request: 'GET /old-page HTTP/1.1',
      response: 'HTTP/1.1 301 Moved Permanently\nLocation: https://example.com/new-page'
    },
    headers: [
      {
        name: 'Location',
        description: 'The new permanent URI',
        example: 'Location: https://example.com/new-page'
      }
    ],
    relatedCodes: [302, 307, 308]
  },
  {
    code: 302,
    name: 'Found',
    category: 'redirection',
    description: 'The resource temporarily resides under a different URI.',
    spec: 'RFC 9110, Section 15.4.3',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.3',
    commonUse: 'Temporary redirect. The original method may change to GET on the target (historic behavior). For preserving the method, use 307 instead.',
    headers: [
      {
        name: 'Location',
        description: 'The temporary URI',
        example: 'Location: /maintenance-page'
      }
    ],
    relatedCodes: [301, 303, 307, 308]
  },
  {
    code: 303,
    name: 'See Other',
    category: 'redirection',
    description: 'The response to the request can be found at another URI using the GET method.',
    spec: 'RFC 9110, Section 15.4.4',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.4',
    commonUse: 'The correct way to redirect after a POST request (Post/Redirect/Get pattern). Prevents form resubmission on page refresh.',
    example: {
      request: 'POST /checkout HTTP/1.1',
      response: 'HTTP/1.1 303 See Other\nLocation: /order-confirmation/12345'
    },
    headers: [
      {
        name: 'Location',
        description: 'The URI to redirect to with GET',
        example: 'Location: /order-confirmation/12345'
      }
    ],
    relatedCodes: [302, 307]
  },
  {
    code: 304,
    name: 'Not Modified',
    category: 'redirection',
    description: 'The resource has not been modified since the version specified in request headers.',
    spec: 'RFC 9110, Section 15.4.5',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.5',
    commonUse: 'Conditional request response. The browser can use its cached version. Saves bandwidth by not retransmitting unchanged resources.',
    example: {
      request: 'GET /style.css HTTP/1.1\nIf-None-Match: "abc123"',
      response: 'HTTP/1.1 304 Not Modified'
    },
    relatedCodes: [200, 412]
  },
  {
    code: 305,
    name: 'Use Proxy',
    category: 'redirection',
    description: 'The requested resource must be accessed through the proxy given by the Location header.',
    spec: 'RFC 9110, Section 15.4.6',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.6',
    commonUse: 'Deprecated due to security concerns. Originally intended to indicate a required proxy, but clients often ignored it.',
    relatedCodes: [306, 307]
  },
  {
    code: 307,
    name: 'Temporary Redirect',
    category: 'redirection',
    description: 'The resource temporarily resides under a different URI. The method must not change.',
    spec: 'RFC 9110, Section 15.4.8',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.8',
    commonUse: 'Modern, unambiguous temporary redirect. Unlike 302, guarantees the HTTP method (POST stays POST). Preferred for API redirects.',
    headers: [
      {
        name: 'Location',
        description: 'The temporary URI',
        example: 'Location: /api/v2/resource'
      }
    ],
    relatedCodes: [302, 303, 308]
  },
  {
    code: 308,
    name: 'Permanent Redirect',
    category: 'redirection',
    description: 'The resource has been permanently moved to a new URI. The method must not change.',
    spec: 'RFC 9110, Section 15.4.9',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.9',
    commonUse: 'Modern, unambiguous permanent redirect. Unlike 301, guarantees the HTTP method is preserved. Ideal for API version upgrades.',
    headers: [
      {
        name: 'Location',
        description: 'The new permanent URI',
        example: 'Location: /api/v2/resource'
      }
    ],
    relatedCodes: [301, 307]
  },

  // 4xx Client Errors
  {
    code: 400,
    name: 'Bad Request',
    category: 'client_error',
    description: 'The server cannot process the request due to client error (malformed syntax, invalid message framing, deceptive request routing).',
    spec: 'RFC 9110, Section 15.5.1',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1',
    commonUse: 'Generic client error. Used for malformed JSON, missing required fields, invalid parameter types, or syntactically incorrect requests.',
    example: {
      request: 'POST /api/users HTTP/1.1\nContent-Type: application/json\n\n{invalid json}',
      response: 'HTTP/1.1 400 Bad Request\n\n{"error": "Invalid JSON"}'
    },
    relatedCodes: [422, 401, 403, 404]
  },
  {
    code: 401,
    name: 'Unauthorized',
    category: 'client_error',
    description: 'The request requires user authentication. The client must authenticate itself to get the requested response.',
    spec: 'RFC 9110, Section 15.5.2',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.2',
    commonUse: 'Not authenticated. Used when the client needs to log in or provide valid credentials (API keys, tokens, session cookies).',
    example: {
      request: 'GET /api/protected HTTP/1.1',
      response: 'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer'
    },
    headers: [
      {
        name: 'WWW-Authenticate',
        description: 'Authentication scheme required',
        example: 'WWW-Authenticate: Bearer realm="api"'
      }
    ],
    relatedCodes: [403, 407]
  },
  {
    code: 402,
    name: 'Payment Required',
    category: 'client_error',
    description: 'Reserved for future use. Intended for digital payment systems.',
    spec: 'RFC 9110, Section 15.5.3',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.3',
    commonUse: 'Not standardized for general use. Some APIs use it to indicate quota exceeded, subscription expired, or payment required.',
    relatedCodes: [401, 403]
  },
  {
    code: 403,
    name: 'Forbidden',
    category: 'client_error',
    description: 'The server understood the request but refuses to authorize it.',
    spec: 'RFC 9110, Section 15.5.4',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4',
    commonUse: 'Authenticated but not authorized. The user lacks permissions for this resource. Unlike 401, re-authenticating won\'t help.',
    example: {
      request: 'DELETE /api/users/1 HTTP/1.1\nAuthorization: Bearer token123',
      response: 'HTTP/1.1 403 Forbidden\n\n{"error": "Admin privileges required"}'
    },
    relatedCodes: [401, 404]
  },
  {
    code: 404,
    name: 'Not Found',
    category: 'client_error',
    description: 'The requested resource could not be found on the server.',
    spec: 'RFC 9110, Section 15.5.5',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.5',
    commonUse: 'The most famous HTTP error. Resource doesn\'t exist or the endpoint is wrong. Often used instead of 403 to hide resource existence.',
    example: {
      request: 'GET /api/users/999999 HTTP/1.1',
      response: 'HTTP/1.1 404 Not Found\n\n{"error": "User not found"}'
    },
    relatedCodes: [403, 410]
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    category: 'client_error',
    description: 'The request method is known but not supported by the target resource.',
    spec: 'RFC 9110, Section 15.5.6',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.6',
    commonUse: 'Used when trying POST on a read-only endpoint, or DELETE on a resource that doesn\'t support deletion.',
    example: {
      request: 'DELETE /api/users HTTP/1.1',
      response: 'HTTP/1.1 405 Method Not Allowed\nAllow: GET, POST, PATCH'
    },
    headers: [
      {
        name: 'Allow',
        description: 'List of allowed methods',
        example: 'Allow: GET, POST, HEAD'
      }
    ],
    relatedCodes: [404, 501]
  },
  {
    code: 406,
    name: 'Not Acceptable',
    category: 'client_error',
    description: 'The target resource does not have a current representation that would be acceptable to the user agent.',
    spec: 'RFC 9110, Section 15.5.7',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.7',
    commonUse: 'Content negotiation failure. The server cannot produce a response matching the Accept-* headers (e.g., client wants XML but API only returns JSON).',
    relatedCodes: [404, 415]
  },
  {
    code: 407,
    name: 'Proxy Authentication Required',
    category: 'client_error',
    description: 'The client must first authenticate itself with the proxy.',
    spec: 'RFC 9110, Section 15.5.8',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.8',
    commonUse: 'Similar to 401 but for proxy authentication. Corporate networks and some VPNs require this.',
    headers: [
      {
        name: 'Proxy-Authenticate',
        description: 'Proxy authentication scheme required',
        example: 'Proxy-Authenticate: Basic realm="proxy"'
      }
    ],
    relatedCodes: [401]
  },
  {
    code: 408,
    name: 'Request Timeout',
    category: 'client_error',
    description: 'The server did not receive a complete request message within the time it was prepared to wait.',
    spec: 'RFC 9110, Section 15.5.9',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.9',
    commonUse: 'Client took too long to send the complete request. Common in slow connections or when uploading large files.',
    relatedCodes: [504]
  },
  {
    code: 409,
    name: 'Conflict',
    category: 'client_error',
    description: 'The request could not be completed due to a conflict with the current state of the target resource.',
    spec: 'RFC 9110, Section 15.5.10',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.10',
    commonUse: 'Used for resource conflicts: duplicate entry, optimistic locking failure, version mismatch, or concurrent modification issues.',
    example: {
      request: 'PUT /api/documents/123 HTTP/1.1\nIf-Match: "abc"\n\n{"content": "new"}',
      response: 'HTTP/1.1 409 Conflict\n\n{"error": "Document was modified by another user"}'
    },
    relatedCodes: [412, 422]
  },
  {
    code: 410,
    name: 'Gone',
    category: 'client_error',
    description: 'The target resource is no longer available at the server and no forwarding address is known.',
    spec: 'RFC 9110, Section 15.5.11',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.11',
    commonUse: 'Permanent 404. Indicates intentional and permanent removal. Useful for deleted resources that should be removed from search engines and caches.',
    relatedCodes: [404]
  },
  {
    code: 411,
    name: 'Length Required',
    category: 'client_error',
    description: 'The server refuses to accept the request without a defined Content-Length.',
    spec: 'RFC 9110, Section 15.5.12',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.12',
    commonUse: 'Rare in modern APIs. Some servers require Content-Length instead of chunked transfer encoding for certain operations.',
    relatedCodes: [400, 412]
  },
  {
    code: 412,
    name: 'Precondition Failed',
    category: 'client_error',
    description: 'One or more conditions given in the request header fields evaluated to false.',
    spec: 'RFC 9110, Section 15.5.13',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.13',
    commonUse: 'Used with If-Match, If-None-Match, If-Modified-Since. Common in optimistic concurrency control (ETag mismatch).',
    relatedCodes: [409]
  },
  {
    code: 413,
    name: 'Content Too Large',
    category: 'client_error',
    description: 'The request entity is larger than limits defined by server.',
    spec: 'RFC 9110, Section 15.5.14',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.14',
    commonUse: 'File uploads exceeding size limits, request bodies too large. Servers may close the connection to prevent continued uploads.',
    relatedCodes: [400, 411]
  },
  {
    code: 414,
    name: 'URI Too Long',
    category: 'client_error',
    description: 'The URI requested by the client is longer than the server is willing to interpret.',
    spec: 'RFC 9110, Section 15.5.15',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.15',
    commonUse: 'Usually occurs from GET requests with excessively long query strings (e.g., too many parameters or large base64 data in URL).',
    relatedCodes: [400]
  },
  {
    code: 415,
    name: 'Unsupported Media Type',
    category: 'client_error',
    description: 'The media format of the requested data is not supported by the server.',
    spec: 'RFC 9110, Section 15.5.16',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.16',
    commonUse: 'Server cannot process the Content-Type sent. Example: API expects JSON but receives XML, or unsupported image format.',
    relatedCodes: [400, 406]
  },
  {
    code: 416,
    name: 'Range Not Satisfiable',
    category: 'client_error',
    description: 'The range specified in the Range header field cannot be fulfilled.',
    spec: 'RFC 9110, Section 15.5.17',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.17',
    commonUse: 'Invalid byte range request (e.g., requesting bytes 1000-2000 of a 500-byte file). Often includes the actual content size.',
    relatedCodes: [206]
  },
  {
    code: 417,
    name: 'Expectation Failed',
    category: 'client_error',
    description: 'The expectation given in the Expect header field could not be met by the server.',
    spec: 'RFC 9110, Section 15.5.18',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.18',
    commonUse: 'Rare. Used when the server cannot meet the requirements specified in Expect: 100-continue or other expectation extensions.',
    relatedCodes: [100, 418]
  },
  {
    code: 418,
    name: "I'm a Teapot",
    category: 'client_error',
    description: 'Any attempt to brew coffee with a teapot should result in the error code 418.',
    spec: 'RFC 2324 (HTCPCP)',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc2324',
    commonUse: 'Easter egg! An RFC 2324 joke that became an actual registered status code. Used for fun, testing, or as a hidden feature in APIs.',
    example: {
      request: 'BREW /coffee HTTP/1.1\nHost: teapot.example.com',
      response: 'HTTP/1.1 418 I\'m a Teapot'
    },
    apiResponse: {
      defaultBody: JSON.stringify({
        code: 418,
        name: "I'm a Teapot",
        message: "Short and stout",
        ascii: "    (_)\n     )\n    (   )\n     )  (\n    (   )\n     ) (\n   _.' '._\n  (   _   )\n   `-...-'"
      }, null, 2)
    }
  },
  {
    code: 421,
    name: 'Misdirected Request',
    category: 'client_error',
    description: 'The request was directed at a server that is not able to produce a response.',
    spec: 'RFC 9110, Section 15.5.20',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.20',
    commonUse: 'Occurs with HTTP/2 when a connection is reused for a different hostname but the server cannot serve that host.',
    relatedCodes: [404]
  },
  {
    code: 422,
    name: 'Unprocessable Content',
    category: 'client_error',
    description: 'The server understands the content type and syntax but cannot process the contained instructions.',
    spec: 'RFC 9110, Section 15.5.21',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.21',
    commonUse: 'Very common in REST APIs. Validation errors: missing required fields, invalid values, business rule violations. The request is syntactically correct but semantically invalid.',
    example: {
      request: 'POST /api/users HTTP/1.1\n\n{"email": "not-an-email"}',
      response: 'HTTP/1.1 422 Unprocessable Content\n\n{"errors": {"email": "Invalid format"}}'
    },
    relatedCodes: [400, 409]
  },
  {
    code: 423,
    name: 'Locked',
    category: 'client_error',
    description: 'The source or destination resource of a method is locked.',
    spec: 'RFC 4918',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc4918',
    commonUse: 'WebDAV specific. Used when a resource is locked by another user or process and cannot be modified.',
    relatedCodes: [409]
  },
  {
    code: 424,
    name: 'Failed Dependency',
    category: 'client_error',
    description: 'The method could not be performed on the resource because the requested action depended on another action that failed.',
    spec: 'RFC 4918',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc4918',
    commonUse: 'WebDAV specific. Used in batch operations where one operation\'s failure causes dependent operations to fail.',
    relatedCodes: [422, 423]
  },
  {
    code: 425,
    name: 'Too Early',
    category: 'client_error',
    description: 'The server is unwilling to risk processing a request that might be replayed.',
    spec: 'RFC 8470',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc8470',
    commonUse: 'Used with early data (0-RTT) in TLS 1.3. The server rejects potentially replayable requests to prevent replay attacks.',
    relatedCodes: [400]
  },
  {
    code: 426,
    name: 'Upgrade Required',
    category: 'client_error',
    description: 'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades.',
    spec: 'RFC 9110, Section 15.5.22',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.22',
    commonUse: 'Used to force protocol upgrades, typically from HTTP/1.1 to HTTP/2 or to require TLS encryption.',
    headers: [
      {
        name: 'Upgrade',
        description: 'Required protocol version',
        example: 'Upgrade: TLS/1.2, HTTP/1.1'
      }
    ],
    relatedCodes: [101]
  },
  {
    code: 428,
    name: 'Precondition Required',
    category: 'client_error',
    description: 'The origin server requires the request to be conditional.',
    spec: 'RFC 6585',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc6585',
    commonUse: 'Prevents the "lost update" problem. Server requires If-Match or If-Unmodified-Since headers for state-changing requests.',
    relatedCodes: [412]
  },
  {
    code: 429,
    name: 'Too Many Requests',
    category: 'client_error',
    description: 'The user has sent too many requests in a given amount of time.',
    spec: 'RFC 6585',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc6585',
    commonUse: 'Rate limiting response. APIs return this when quota is exceeded. May include Retry-After header indicating when to retry.',
    example: {
      request: 'GET /api/data HTTP/1.1',
      response: 'HTTP/1.1 429 Too Many Requests\nRetry-After: 3600\n\n{"error": "Quota exceeded"}'
    },
    headers: [
      {
        name: 'Retry-After',
        description: 'Seconds to wait before retrying',
        example: 'Retry-After: 60'
      }
    ],
    relatedCodes: [503]
  },
  {
    code: 431,
    name: 'Request Header Fields Too Large',
    category: 'client_error',
    description: 'The server is unwilling to process the request because its header fields are too large.',
    spec: 'RFC 6585',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc6585',
    commonUse: 'Occurs with too many cookies, large authentication tokens, or excessive custom headers. May indicate a header size limit was reached.',
    relatedCodes: [400]
  },
  {
    code: 451,
    name: 'Unavailable For Legal Reasons',
    category: 'client_error',
    description: 'The server is denying access to the resource as a consequence of a legal demand.',
    spec: 'RFC 7725',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc7725',
    commonUse: 'Named after Fahrenheit 451. Used for content blocked due to copyright infringement, court orders, GDPR restrictions, or government censorship.',
    relatedCodes: [403]
  },

  // 5xx Server Errors
  {
    code: 500,
    name: 'Internal Server Error',
    category: 'server_error',
    description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
    spec: 'RFC 9110, Section 15.6.1',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1',
    commonUse: 'Generic server error. Used for unhandled exceptions, database connection failures, or any unexpected server-side problem.',
    example: {
      request: 'GET /api/users HTTP/1.1',
      response: 'HTTP/1.1 500 Internal Server Error\n\n{"error": "Database connection failed"}'
    },
    relatedCodes: [502, 503]
  },
  {
    code: 501,
    name: 'Not Implemented',
    category: 'server_error',
    description: 'The server does not support the functionality required to fulfill the request.',
    spec: 'RFC 9110, Section 15.6.2',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.2',
    commonUse: 'Used for HTTP methods not implemented (e.g., PATCH, TRACE) or features planned but not yet available.',
    relatedCodes: [405, 500]
  },
  {
    code: 502,
    name: 'Bad Gateway',
    category: 'server_error',
    description: 'The server, while acting as a gateway or proxy, received an invalid response from an upstream server.',
    spec: 'RFC 9110, Section 15.6.3',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.3',
    commonUse: 'Common with reverse proxies and load balancers. The upstream server is down, returned garbage, or disconnected unexpectedly.',
    relatedCodes: [500, 503, 504]
  },
  {
    code: 503,
    name: 'Service Unavailable',
    category: 'server_error',
    description: 'The server is currently unable to handle the request due to temporary overload or maintenance.',
    spec: 'RFC 9110, Section 15.6.4',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.4',
    commonUse: 'Used during deployments, maintenance windows, or when the server is overloaded. Often includes Retry-After header.',
    example: {
      request: 'GET /api/data HTTP/1.1',
      response: 'HTTP/1.1 503 Service Unavailable\nRetry-After: 300\n\n{"error": "Maintenance in progress"}'
    },
    headers: [
      {
        name: 'Retry-After',
        description: 'When the service will be available',
        example: 'Retry-After: 3600'
      }
    ],
    relatedCodes: [502, 504]
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    category: 'server_error',
    description: 'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.',
    spec: 'RFC 9110, Section 15.6.5',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.5',
    commonUse: 'The upstream server took too long to respond. Common with slow database queries, external API calls, or complex computations.',
    relatedCodes: [502, 503, 408]
  },
  {
    code: 505,
    name: 'HTTP Version Not Supported',
    category: 'server_error',
    description: 'The server does not support, or refuses to support, the HTTP protocol version used in the request.',
    spec: 'RFC 9110, Section 15.6.6',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.6',
    commonUse: 'Rare in modern web. May occur with very old HTTP/0.9 requests or future HTTP versions not yet supported.',
    relatedCodes: [400]
  },
  {
    code: 506,
    name: 'Variant Also Negotiates',
    category: 'server_error',
    description: 'The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation.',
    spec: 'RFC 2295',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc2295',
    commonUse: 'Very rare. Indicates a server configuration error in content negotiation setup, creating a circular reference.',
    relatedCodes: [500]
  },
  {
    code: 507,
    name: 'Insufficient Storage',
    category: 'server_error',
    description: 'The method could not be performed because the server cannot store the representation needed to complete the request.',
    spec: 'RFC 4918',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc4918',
    commonUse: 'WebDAV specific. Server is out of disk space or quota for the user. May also be used for upload size limits exceeded.',
    relatedCodes: [413, 500]
  },
  {
    code: 508,
    name: 'Loop Detected',
    category: 'server_error',
    description: 'The server detected an infinite loop while processing a request with Depth: infinity.',
    spec: 'RFC 5842',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc5842',
    commonUse: 'WebDAV specific. Used when binding operations would create a circular reference (binding a collection to itself).',
    relatedCodes: [500]
  },
  {
    code: 510,
    name: 'Not Extended',
    category: 'server_error',
    description: 'The policy for accessing the resource has not been met in the request.',
    spec: 'RFC 2774',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc2774',
    commonUse: 'Rare. Used when the server requires additional extensions in the request to fulfill it.',
    relatedCodes: [400]
  },
  {
    code: 511,
    name: 'Network Authentication Required',
    category: 'server_error',
    description: 'The client needs to authenticate to gain network access.',
    spec: 'RFC 6585',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc6585',
    commonUse: 'Used by captive portals (airport/hotel WiFi) to intercept requests and require authentication before internet access is granted.',
    headers: [
      {
        name: 'Location',
        description: 'URL of the login page',
        example: 'Location: https://wifi.example.com/login'
      }
    ],
    relatedCodes: [401, 407]
  },

  // Non-standard but widely used codes
  {
    code: 420,
    name: 'Enhance Your Calm',
    category: 'client_error',
    description: 'Returned by the Twitter Search and Trends API when the client is being rate limited.',
    spec: 'Twitter (legacy)',
    specUrl: 'https://developer.twitter.com',
    commonUse: 'Twitter/X legacy error code, made famous as an easter egg. Sometimes used humorously or for rate limiting in APIs.',
    relatedCodes: [429]
  },
  {
    code: 444,
    name: 'No Response',
    category: 'server_error',
    description: 'A non-standard status code used by nginx to indicate that the server has returned no information and closed the connection.',
    spec: 'Nginx',
    specUrl: 'https://nginx.org',
    commonUse: 'Nginx-specific. Used to deny malicious or malformed requests without providing any response information to the client.',
    apiResponse: {
      defaultBody: ''
    }
  },
  {
    code: 499,
    name: 'Client Closed Request',
    category: 'client_error',
    description: 'A non-standard status code used by nginx to indicate that the client closed the connection while the server was processing the request.',
    spec: 'Nginx',
    specUrl: 'https://nginx.org',
    commonUse: 'Nginx-specific. Indicates the user cancelled the request, navigated away, or their connection dropped before the server could respond.',
    apiResponse: {
      defaultBody: ''
    }
  },
  {
    code: 529,
    name: 'Site is Overloaded',
    category: 'server_error',
    description: 'The server is currently overloaded and cannot process the request.',
    spec: 'Non-standard',
    specUrl: '',
    commonUse: 'Used by some hosting providers and CDNs to indicate server overload, distinct from 503 to indicate the origin specifically is overloaded.',
    relatedCodes: [503]
  },
  {
    code: 530,
    name: 'Site is Frozen',
    category: 'server_error',
    description: 'The site has been frozen due to inactivity or non-payment.',
    spec: 'Pantheon (hosting)',
    specUrl: 'https://pantheon.io',
    commonUse: 'Pantheon hosting specific. Returned when a site is in a frozen state due to inactivity or billing issues.',
    relatedCodes: [503]
  },
  {
    code: 598,
    name: 'Network Read Timeout',
    category: 'server_error',
    description: 'Network read timeout behind the proxy.',
    spec: 'Informal (Microsoft)',
    specUrl: '',
    commonUse: 'Used by some HTTP proxies to signal a network read timeout. Not standardized but encountered in some enterprise environments.',
    relatedCodes: [504]
  },
  {
    code: 599,
    name: 'Network Connect Timeout',
    category: 'server_error',
    description: 'Network connect timeout behind the proxy.',
    spec: 'Informal (Microsoft)',
    specUrl: '',
    commonUse: 'Used by some HTTP proxies to signal a network connection timeout to the upstream server. Not standardized but used in practice.',
    relatedCodes: [504]
  }
];

// Helper functions
export function getHTTPCode(code: number): HTTPCode | undefined {
  return httpCodes.find(c => c.code === code);
}

export function getCodesByCategory(category: HTTPCategory): HTTPCode[] {
  return httpCodes.filter(c => c.category === category);
}

export function getAllCodes(): HTTPCode[] {
  return httpCodes;
}

export function isValidStatusCode(code: number): boolean {
  return httpCodes.some(c => c.code === code);
}

export function getRelatedCodes(code: HTTPCode): HTTPCode[] {
  if (!code.relatedCodes) return [];
  return code.relatedCodes.map(c => getHTTPCode(c)).filter((c): c is HTTPCode => c !== undefined);
}
