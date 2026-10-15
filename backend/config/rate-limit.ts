import { rateLimit } from "express-rate-limit";

interface RateLimiter {
  time?: number;
  limit?: number;
  error?: string;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

/**
 * Configures and returns an Express rate-limiting middleware.
 *
 * @param options.time - Rolling window duration in minutes (defaults to 1 minute).
 * @param options.limit - Maximum number of allowed requests per IP within the window.
 * @param options.error - Short error label returned in the 429 response.
 * @param options.message - Human-readable guidance message returned in the 429 response.
 * @param options.skipSuccessfulRequests - Whether to count only failed requests against the limit.
 */
export const customRateLimiter = ({
  time = 1,
  limit = 60,
  error = "Too many requests",
  message = "You have exceeded the rate limit",
  skipSuccessfulRequests = false,
}: RateLimiter) =>
  rateLimit({
    windowMs: time * 60 * 1000,
    limit: limit,
    skipSuccessfulRequests: skipSuccessfulRequests,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    handler: (req, res, next, options) => {
      const retryAfter = Math.ceil(options.windowMs / 1000);
      res.status(429).json({
        error: error,
        message: `${message}. Try again in ${retryAfter} seconds.`,
        retryAfter,
      });
    },
  });
