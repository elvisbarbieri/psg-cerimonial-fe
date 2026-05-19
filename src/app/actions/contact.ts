"use server";

import { revalidatePath } from "next/cache";

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
  const baseUrl = process.env.CONTACT_API_URL;
  const code = process.env.CONTACT_API_CODE;

  if (!baseUrl || !code) {
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
    } catch {
      /* empty or non-JSON 2xx */
    }

    if (!success) {
      return {
        ok: false,
        error: "Não foi possível enviar sua mensagem. Tente novamente.",
      };
    }

    revalidatePath("/");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        "Erro de conexão ao enviar. Verifique sua internet e tente novamente.",
    };
  }
}
