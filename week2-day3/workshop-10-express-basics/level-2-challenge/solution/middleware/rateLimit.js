/**
 * middleware/rateLimit.js
 * - Simple in-memory rate limiter
 * - Uses Map keyed by client IP, stores request timestamps within window.
 */

const rateLimit = () => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 900000; // 15 min
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX, 10) || 100;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip);

    // Keep only timestamps inside the window
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests, please try again later'
        }
      });
    }

    recent.push(now);
    requests.set(ip, recent);

    next();
  };
};

module.exports = rateLimit;
