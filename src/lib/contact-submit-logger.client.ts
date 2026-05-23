/**
 * Client-side contact form logging (browser console + future telemetry hooks).
 * Never logs full message content or e-mail address.
 */

export interface ClientContactLogContext {
  event: string;
  reason: string;
  error?: unknown;
  serverError?: string;
}

function serializeError(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }
  if (error !== undefined && error !== null) {
    return { errorMessage: String(error) };
  }
  return {};
}

export function logContactSubmitClientEvent(
  context: ClientContactLogContext,
): void {
  const payload = {
    timestamp: new Date().toISOString(),
    scope: "contact_form",
    source: "client",
    ...context,
    ...serializeError(context.error),
  };

  console.error("[ContactForm]", payload);
}
