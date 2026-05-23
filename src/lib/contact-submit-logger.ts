import "server-only";

export type ContactSubmitLogLevel = "error" | "warn" | "info";

export interface ContactSubmitLogContext {
  /** Stable event id, e.g. contact_submit_api_error */
  event: string;
  /** Short machine-readable reason */
  reason: string;
  httpStatus?: number;
  apiDetail?: string;
  error?: unknown;
}

function serializeError(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      ...(error.stack ? { stack: error.stack } : {}),
    };
  }
  if (error !== undefined && error !== null) {
    return { errorMessage: String(error) };
  }
  return {};
}

/**
 * Structured logs for contact form submission (visible in Azure Log stream / App Insights).
 * Does not log message body or e-mail — only metadata.
 */
export function logContactSubmitEvent(
  level: ContactSubmitLogLevel,
  context: ContactSubmitLogContext,
): void {
  const payload = {
    timestamp: new Date().toISOString(),
    scope: "contact_form",
    level,
    ...context,
    ...serializeError(context.error),
  };

  const line = JSON.stringify(payload);

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.info(line);
  }
}
