import type { APIRoute } from 'astro';
import { getHTTPCode, isValidStatusCode } from '../../data/http-codes';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit';

export const prerender = false;

const MAX_DELAY = 30000; // 30 seconds max delay

// Rate limit config: 100 requests per minute per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100;

export const GET: APIRoute = async ({ params, request, site }) => {
  return handleRequest(params.code, request, site);
};

export const POST: APIRoute = async ({ params, request, site }) => {
  return handleRequest(params.code, request, site);
};

export const PUT: APIRoute = async ({ params, request, site }) => {
  return handleRequest(params.code, request, site);
};

export const DELETE: APIRoute = async ({ params, request, site }) => {
  return handleRequest(params.code, request, site);
};

export const PATCH: APIRoute = async ({ params, request, site }) => {
  return handleRequest(params.code, request, site);
};

export const HEAD: APIRoute = async ({ params, request, site }) => {
  const response = await handleRequest(params.code, request, site);
  // HEAD responses must not have a body
  return new Response(null, {
    status: response.status,
    headers: response.headers
  });
};

export const OPTIONS: APIRoute = async ({ params, request, site }) => {
  const response = await handleRequest(params.code, request, site);
  
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

async function handleRequest(codeParam: string | undefined, request: Request, site?: URL): Promise<Response> {
  const url = new URL(request.url);
  const siteUrl = site?.origin || '';
  
  // Check rate limit first
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(clientIP, {
    windowMs: RATE_LIMIT_WINDOW,
    maxRequests: RATE_LIMIT_MAX
  });
  
  // Build rate limit headers
  const rateLimitHeaders = new Headers();
  rateLimitHeaders.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  rateLimitHeaders.set('X-RateLimit-Remaining', String(Math.max(0, rateLimitResult.remaining)));
  rateLimitHeaders.set('X-RateLimit-Reset', String(Math.ceil(rateLimitResult.resetTime / 1000)));
  
  // If rate limit exceeded, return 429
  if (!rateLimitResult.allowed) {
    const errorBody = {
      error: 'Rate limit exceeded',
      message: `You have exceeded the limit of ${RATE_LIMIT_MAX} requests per minute. Please try again later.`,
      retry_after: rateLimitResult.retryAfter,
      limit: RATE_LIMIT_MAX,
      window: '1 minute'
    };
    
    rateLimitHeaders.set('Retry-After', String(rateLimitResult.retryAfter));
    rateLimitHeaders.set('Content-Type', 'application/json');
    rateLimitHeaders.set('Access-Control-Allow-Origin', '*');
    
    return new Response(JSON.stringify(errorBody, null, 2), {
      status: 429,
      headers: rateLimitHeaders
    });
  }
  
  const code = parseInt(codeParam || '', 10);

  // Validate code
  if (isNaN(code) || !isValidStatusCode(code)) {
    const errorBody = {
      error: 'Invalid HTTP status code',
      message: `Code ${codeParam} is not a recognized HTTP status code`,
      valid_range: '100-599 (plus common non-standard codes)',
      docs: `${siteUrl}/codes`
    };
    
    rateLimitHeaders.set('Content-Type', 'application/json');
    rateLimitHeaders.set('Access-Control-Allow-Origin', '*');
    rateLimitHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
    rateLimitHeaders.set('Access-Control-Allow-Headers', '*');
    
    return new Response(JSON.stringify(errorBody, null, 2), {
      status: 400,
      headers: rateLimitHeaders
    });
  }
  
  const httpCode = getHTTPCode(code);
  
  // Parse query parameters
  const delay = Math.min(
    parseInt(url.searchParams.get('delay') || '0', 10) || 0,
    MAX_DELAY
  );
  
  // Get custom body from query param (URL decoded)
  const bodyParam = url.searchParams.get('body');
  const customBody = bodyParam !== null ? decodeURIComponent(bodyParam) : null;
  
  const contentType = url.searchParams.get('content_type') || 'application/json';
  const customHeadersJson = url.searchParams.get('headers');
  
  // Get redirect URL (URL decoded to support full URLs)
  const redirectParam = url.searchParams.get('redirect_to');
  const redirectTo = redirectParam !== null ? decodeURIComponent(redirectParam) : null;
  
  const noRedirect = url.searchParams.has('no_redirect');
  const retryAfter = url.searchParams.get('retry_after');
  const allow = url.searchParams.get('allow');
  
  // Apply delay if specified
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Build response headers
  const headers = new Headers(rateLimitHeaders);
  headers.set('Content-Type', contentType);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  
  // Add cache headers for standard responses without customization
  const hasCustomization = customBody !== null || customHeadersJson || redirectTo !== null || retryAfter || allow || delay > 0;
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
  
  // Handle redirect codes (3xx)
  if (code >= 300 && code < 400) {
    // Use redirect_to parameter, or fallback to site URL
    const locationValue = redirectTo || siteUrl || '/';
    
    if (noRedirect) {
      // Return JSON with redirect info instead of actual redirect
      headers.set('X-Location', locationValue);
      headers.set('X-Redirect-Status', String(code));
    } else {
      // Perform actual redirect
      headers.set('Location', locationValue);
      
      // For 3xx responses, we typically don't want a body, but if user specified one, include it
      if (customBody !== null) {
        return new Response(customBody, { status: code, headers });
      }
      
      // Standard redirect response
      return new Response(null, { status: code, headers });
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
      const customHeaders = JSON.parse(decodeURIComponent(customHeadersJson));
      for (const [key, value] of Object.entries(customHeaders)) {
        headers.set(key, String(value));
      }
    } catch {
      // Ignore invalid JSON
    }
  }
  
  // Build response body
  let body: string | null;
  
  if (customBody !== null) {
    // Custom body requested via query param
    body = customBody;
  } else if (noRedirect && code >= 300 && code < 400) {
    // no_redirect mode for 3xx - return JSON with redirect info
    const responseBody: Record<string, unknown> = {
      code: httpCode?.code || code,
      name: httpCode?.name || 'Unknown',
      description: httpCode?.description || '',
      redirect: {
        location: redirectTo || siteUrl || '/',
        would_redirect_to: redirectTo || siteUrl || '/'
      }
    };
    body = JSON.stringify(responseBody, null, 2);
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
