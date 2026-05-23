"use server";

import { revalidatePath } from "next/cache";
import { logContactSubmitEvent } from "@/lib/contact-submit-logger";

export interface ContactFormPayload {
  name: string;
  email: string;
  eventDate: string;
  invitees: string;
  eventType: string;
  message: string;
}

export type SubmitContactResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<SubmitContactResult> {
  logContactSubmitEvent("info", {
    event: "contact_submit_started",
    reason: "user_clicked_enviar_mensagem",
  });

  const baseUrl = process.env.CONTACT_API_URL;
  const code = process.env.CONTACT_API_CODE;

  if (!baseUrl || !code) {
    logContactSubmitEvent("error", {
      event: "contact_submit_config_error",
      reason: "missing_contact_api_env",
      apiDetail: !baseUrl ? "CONTACT_API_URL" : "CONTACT_API_CODE",
    });
    return {
      ok: false,
      error: "Configuração do servidor incompleta. Tente novamente mais tarde.",
    };
  }

  const url = `${baseUrl}?code=${encodeURIComponent(code)}`;

  const body = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    eventDate: payload.eventDate,
    invitees: payload.invitees.trim(),
    eventType: payload.eventType.trim(),
    message: payload.message.trim(),
  };

  if (!body.name || !body.email || !body.message) {
    logContactSubmitEvent("warn", {
      event: "contact_submit_validation_failed",
      reason: "required_fields_missing",
      apiDetail: [
        !body.name && "name",
        !body.email && "email",
        !body.message && "message",
      ]
        .filter(Boolean)
        .join(","),
    });
    return {
      ok: false,
      error: "Preencha nome, e-mail e mensagem antes de enviar.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const errJson = (await res.json()) as { message?: string };
        detail = errJson.message ?? "";
      } catch {
        detail = await res.text().catch(() => "");
      }

      logContactSubmitEvent("error", {
        event: "contact_submit_api_http_error",
        reason: "contact_api_non_ok_response",
        httpStatus: res.status,
        apiDetail: detail.slice(0, 500) || undefined,
      });

      return {
        ok: false,
        error:
          detail ||
          `Não foi possível enviar sua mensagem (${res.status}). Tente novamente.`,
      };
    }

    let success = true;
    try {
      const data = (await res.json()) as { success?: boolean };
      success = data.success !== false;
    } catch (parseError) {
      logContactSubmitEvent("warn", {
        event: "contact_submit_api_parse_warning",
        reason: "contact_api_empty_or_non_json_2xx",
        error: parseError,
      });
    }

    if (!success) {
      logContactSubmitEvent("error", {
        event: "contact_submit_api_rejected",
        reason: "contact_api_success_false",
        httpStatus: res.status,
      });
      return {
        ok: false,
        error: "Não foi possível enviar sua mensagem. Tente novamente.",
      };
    }

    logContactSubmitEvent("info", {
      event: "contact_submit_succeeded",
      reason: "contact_api_ok",
      httpStatus: res.status,
    });

    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    logContactSubmitEvent("error", {
      event: "contact_submit_exception",
      reason: "fetch_or_network_failed",
      error,
    });
    return {
      ok: false,
      error:
        "Erro de conexão ao enviar. Verifique sua internet e tente novamente.",
    };
  }
}
