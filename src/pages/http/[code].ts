import type { APIRoute } from 'astro';
import { getHTTPCode, isValidStatusCode } from '../../data/http-codes';

export const prerender = false;

const MAX_DELAY = 30000; // 30 seconds max delay

export const GET: APIRoute = async ({ params, request }) => {
  return handleRequest(params.code, request);
};

export const POST: APIRoute = async ({ params, request }) => {
  return handleRequest(params.code, request);
};

export const PUT: APIRoute = async ({ params, request }) => {
  return handleRequest(params.code, request);
};

export const DELETE: APIRoute = async ({ params, request }) => {
  return handleRequest(params.code, request);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  return handleRequest(params.code, request);
};

export const HEAD: APIRoute = async ({ params, request }) => {
  const response = await handleRequest(params.code, request);
  // HEAD responses must not have a body
  return new Response(null, {
    status: response.status,
    headers: response.headers
  });
};

export const OPTIONS: APIRoute = async ({ params, request }) => {
  const response = await handleRequest(params.code, request);
  
  // Add CORS headers for OPTIONS
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  headers.set('Access-Control-Max-Age', '86400');
  
  return new Response(response.body, {
    status: response.status,
    headers
  });
};

async function handleRequest(codeParam: string | undefined, request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = parseInt(codeParam || '', 10);
  
  // Validate code
  if (isNaN(code) || !isValidStatusCode(code)) {
    const errorBody = {
      error: 'Invalid HTTP status code',
      message: `Code ${codeParam} is not a recognized HTTP status code`,
      valid_range: '100-599 (plus common non-standard codes)',
      docs: 'https://http.uncodigo.com/codes'
    };
    
    return new Response(JSON.stringify(errorBody, null, 2), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }
  
  const httpCode = getHTTPCode(code);
  
  // Parse query parameters
  const delay = Math.min(
    parseInt(url.searchParams.get('delay') || '0', 10) || 0,
    MAX_DELAY
  );
  
  const customBody = url.searchParams.get('body');
  const contentType = url.searchParams.get('content_type') || 'application/json';
  const customHeadersJson = url.searchParams.get('headers');
  const redirectTo = url.searchParams.get('redirect_to');
  const noRedirect = url.searchParams.has('no_redirect');
  const retryAfter = url.searchParams.get('retry_after');
  const allow = url.searchParams.get('allow');
  
  // Apply delay if specified
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Build response headers
  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  
  // Add rate limit headers (informational - actual rate limiting should be done at edge)
  headers.set('X-RateLimit-Limit', '1000');
  headers.set('X-RateLimit-Remaining', '999');
  headers.set('X-RateLimit-Reset', String(Math.ceil(Date.now() / 1000) + 3600));
  
  // Add cache headers for standard responses without customization
  const hasCustomization = customBody || customHeadersJson || redirectTo || retryAfter || allow || delay > 0;
  if (!hasCustomization) {
    headers.set('Cache-Control', 'public, max-age=3600');
  } else {
    headers.set('Cache-Control', 'no-store');
  }
  
  // Add code-specific headers
  if (httpCode?.headers) {
    for (const header of httpCode.headers) {
      if (!headers.has(header.name)) {
        headers.set(header.name, header.example);
      }
    }
  }
  
  // Handle redirect codes
  if ((code >= 300 && code < 400) || [300, 301, 302, 303, 307, 308].includes(code)) {
    const locationValue = redirectTo || 'https://http.uncodigo.com';
    if (noRedirect) {
      // Return JSON with redirect info instead of actual redirect
      headers.set('X-Location', locationValue);
    } else if (!headers.has('Location')) {
      headers.set('Location', locationValue);
    }
  }
  
  // Handle 401 Unauthorized
  if (code === 401 && !headers.has('WWW-Authenticate')) {
    headers.set('WWW-Authenticate', 'Bearer realm="api"');
  }
  
  // Handle 407 Proxy Auth Required
  if (code === 407 && !headers.has('Proxy-Authenticate')) {
    headers.set('Proxy-Authenticate', 'Basic realm="proxy"');
  }
  
  // Handle 405 Method Not Allowed
  if (code === 405) {
    headers.set('Allow', allow || 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
  }
  
  // Handle 429 Too Many Requests and 503 Service Unavailable (Retry-After)
  if ((code === 429 || code === 503) && retryAfter) {
    headers.set('Retry-After', retryAfter);
  }
  
  // Handle 426 Upgrade Required
  if (code === 426 && !headers.has('Upgrade')) {
    headers.set('Upgrade', 'HTTP/2');
  }
  
  // Parse custom headers
  if (customHeadersJson) {
    try {
      const customHeaders = JSON.parse(customHeadersJson);
      for (const [key, value] of Object.entries(customHeaders)) {
        headers.set(key, String(value));
      }
    } catch {
      // Ignore invalid JSON
    }
  }
  
  // Build response body
  let body: string;
  
  if (customBody !== null) {
    // Custom body requested
    body = customBody;
  } else if (httpCode?.apiResponse?.defaultBody !== undefined) {
    // Use code-specific default body (e.g., empty for 444)
    body = httpCode.apiResponse.defaultBody;
  } else if (contentType === 'application/json') {
    // Standard JSON response
    const responseBody: Record<string, unknown> = {
      code: httpCode?.code || code,
      name: httpCode?.name || 'Unknown',
      description: httpCode?.description || '',
      spec: httpCode?.spec || ''
    };
    
    // Add request info
    responseBody.request = {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    };
    
    if (delay > 0) {
      responseBody.delayMs = delay;
    }
    
    body = JSON.stringify(responseBody, null, 2);
  } else {
    // Non-JSON content type without custom body
    body = `${code} ${httpCode?.name || ''}`;
  }
  
  // Handle 1xx Informational - cannot be used as final response status,
  // so we return 200 with the code info in the body and a custom header
  if (code >= 100 && code < 200) {
    headers.set('X-Original-Status', String(code));
    return new Response(body, { status: 200, headers });
  }

  // Handle no_redirect: return 200 with original status in header to avoid
  // opaque redirect responses in browser fetch
  if (noRedirect && code >= 300 && code < 400) {
    headers.set('X-Original-Status', String(code));
    return new Response(body, { status: 200, headers });
  }

  // Handle 204 No Content and similar - no body
  if (code === 204 || code === 304) {
    return new Response(null, { status: code, headers });
  }

  // Handle 444 No Response (Nginx) - close connection without response
  if (code === 444) {
    return new Response(null, { status: 444 });
  }

  return new Response(body, { status: code, headers });
}
