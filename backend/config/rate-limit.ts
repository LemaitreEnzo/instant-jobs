import { rateLimit } from "express-rate-limit";

interface RateLimiter {
  time?: number;
  limit?: number;
  error?: string;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

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
