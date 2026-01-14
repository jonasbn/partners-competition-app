import { Logtail } from "@logtail/browser";

// Initialize Logtail with error handling
let logtail;
const token = import.meta.env.LOGTAIL_KEY;

if (token) {
  try {
    logtail = new Logtail(token, {
      endpoint: 'https://in.logs.betterstack.com',
    });
  } catch (error) {
    console.error('Failed to initialize Logtail:', error);
  }
}

// Create a safe logger that works even if Logtail fails
const safeLogtail = logtail || {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  flush: () => Promise.resolve()
};

// Logger utility class to provide a clean interface
class Logger {
  static info(message, context = {}) {
    console.log(`[INFO] ${message}`, context);
    safeLogtail.info(message, context);
  }

  static warn(message, context = {}) {
    console.warn(`[WARN] ${message}`, context);
    safeLogtail.warn(message, context);
  }

  static error(message, error = null, context = {}) {
    console.error(`[ERROR] ${message}`, { error, ...context });
    safeLogtail.error(message, { error: error?.toString(), stack: error?.stack, ...context });
  }

  static debug(message, context = {}) {
    console.debug(`[DEBUG] ${message}`, context);
    safeLogtail.debug(message, context);
  }

  // Log user interactions
  static userAction(action, details = {}) {
    const logData = {
      type: 'user_action',
      action,
      timestamp: new Date().toISOString(),
      ...details
    };
    console.log(`[USER_ACTION] ${action}`, logData);
    safeLogtail.info(`User action: ${action}`, logData);
  }

  // Log performance metrics
  static performance(metric, value, context = {}) {
    const logData = {
      type: 'performance',
      metric,
      value,
      timestamp: new Date().toISOString(),
      ...context
    };
    console.log(`[PERFORMANCE] ${metric}: ${value}`, logData);
    safeLogtail.info(`Performance metric: ${metric}`, logData);
  }

  // Log application events
  static event(eventName, data = {}) {
    const logData = {
      type: 'application_event',
      event: eventName,
      timestamp: new Date().toISOString(),
      ...data
    };
    console.log(`[EVENT] ${eventName}`, logData);
    safeLogtail.info(`Application event: ${eventName}`, logData);
  }

  // Ensure logs are sent before page unload
  static flush() {
    return safeLogtail.flush();
  }
}

// Automatically flush logs when the page is about to unload
window.addEventListener('beforeunload', () => {
  Logger.flush();
});

export default Logger;
