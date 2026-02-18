type LogLevel = 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: any;
}

class Logger {
  private redact(meta?: LogMeta) {
    // Redact sensitive fields
    if (!meta) return meta;
    const redacted = { ...meta };
    const sensitive = ['password', 'token', 'key', 'secret'];
    for (const field of sensitive) {
      if (redacted[field]) redacted[field] = '[REDACTED]';
    }
    return redacted;
  }

  info(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== 'production') {
      // Only log in non-prod or to external service in prod
      // eslint-disable-next-line no-console
      console.info(JSON.stringify({ level: 'info', message, ...this.redact(meta) }));
    }
    // TODO: Integrate with external log service in prod
  }

  warn(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(JSON.stringify({ level: 'warn', message, ...this.redact(meta) }));
    }
    // TODO: Integrate with external log service in prod
  }

  error(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify({ level: 'error', message, ...this.redact(meta) }));
    }
    // TODO: Integrate with external log service in prod
  }
}

export const logger = new Logger();
