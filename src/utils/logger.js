import { Logtail } from "@logtail/browser";

// Initialize Logtail with the provided configuration
const logtail = new Logtail("gDcpojWzsEzzJVpXTyjAFsPF", {
  endpoint: 'https://in.logs.betterstack.com',
});

// Logger utility class to provide a clean interface
class Logger {
  static info(message, context = {}) {
    console.log(`[INFO] ${message}`, context);
    logtail.info(message, context);
  }

  static warn(message, context = {}) {
    console.warn(`[WARN] ${message}`, context);
    logtail.warn(message, context);
  }

  static error(message, error = null, context = {}) {
    console.error(`[ERROR] ${message}`, { error, ...context });
    logtail.error(message, { error: error?.toString(), stack: error?.stack, ...context });
  }

  static debug(message, context = {}) {
    console.debug(`[DEBUG] ${message}`, context);
    logtail.debug(message, context);
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
    logtail.info(`User action: ${action}`, logData);
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
    logtail.info(`Performance metric: ${metric}`, logData);
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
    logtail.info(`Application event: ${eventName}`, logData);
  }

  // Ensure logs are sent before page unload
  static flush() {
    return logtail.flush();
  }
}

// Automatically flush logs when the page is about to unload
window.addEventListener('beforeunload', () => {
  Logger.flush();
});

export default Logger;
