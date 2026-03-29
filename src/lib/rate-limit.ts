// Simple in-memory rate limiter for single-node deployments
// For multi-node setups, use Redis or similar

interface RateLimitEntry {
  count: number;
  resetTime: number;
  windowStart: number;
}

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  skipSuccessful?: boolean; // Don't count successful requests (optional)
}

// Default: 100 requests per minute per IP
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100
};

// In-memory store: Map<ip, RateLimitEntry>
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const now = Date.now();
  const { windowMs, maxRequests } = { ...DEFAULT_CONFIG, ...config };
  
  const entry = store.get(identifier);
  
  // No entry or window expired - create new
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
      windowStart: now
    };
    store.set(identifier, newEntry);
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter
    };
  }
  
  // Increment counter
  entry.count++;
  
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

// Get client IP from request (handles proxies)
export function getClientIP(request: Request): string {
  // Check for forwarded headers (when behind proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Get first IP in the chain
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback: extract from URL (for local development)
  try {
    const url = new URL(request.url);
    // In a real scenario, we'd use the connection info
    // This is a simplified version
    return url.hostname || 'unknown';
  } catch {
    return 'unknown';
  }
}

// Reset rate limit for an identifier (useful for testing)
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

// Get current stats (for monitoring)
export function getRateLimitStats(): {
  totalEntries: number;
  activeWindows: number;
} {
  const now = Date.now();
  let activeWindows = 0;
  
  for (const entry of store.values()) {
    if (now <= entry.resetTime) {
      activeWindows++;
    }
  }
  
  return {
    totalEntries: store.size,
    activeWindows
  };
}
