"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { submitContactForm } from "@/app/actions/contact";
import { logContactSubmitClientEvent } from "@/lib/contact-submit-logger.client";
import type { ContactFormContentDTO } from "@/types/content";
import {
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIconSolid,
  EnvelopeIconSolid,
  SparklesIcon,
  UserIconSolid,
  UsersIcon,
} from "./icons";

interface ContactFormProps {
  content: ContactFormContentDTO;
}

const initialState = {
  name: "",
  email: "",
  eventDate: "",
  invitees: "",
  eventType: "",
  message: "",
};

const SUCCESS_MESSAGE_DURATION_MS = 5000;

export default function ContactForm({ content }: ContactFormProps) {
  const { sectionTitle, submissionSuccessMessage, formPlaceholders } = content;
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isSubmitted) return;
    const id = window.setTimeout(
      () => setIsSubmitted(false),
      SUCCESS_MESSAGE_DURATION_MS,
    );
    return () => window.clearTimeout(id);
  }, [isSubmitted]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitted(false);

    startTransition(async () => {
      try {
        const result = await submitContactForm({
          name: formData.name,
          email: formData.email,
          eventDate: formData.eventDate,
          invitees: formData.invitees,
          eventType: formData.eventType,
          message: formData.message,
        });

        if (result.ok) {
          setFormData(initialState);
          setIsSubmitted(true);
          router.refresh();
          return;
        }

        logContactSubmitClientEvent({
          event: "contact_submit_failed",
          reason: "server_action_returned_error",
          serverError: result.error,
        });
        setErrorMessage(result.error);
      } catch (error) {
        logContactSubmitClientEvent({
          event: "contact_submit_exception",
          reason: "unexpected_client_or_action_throw",
          error,
        });
        setErrorMessage(
          "Ocorreu um erro inesperado ao enviar. Tente novamente em instantes.",
        );
      }
    });
  };

  return (
    <section
      id="contato"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] text-center mb-14 md:mb-16">
          {sectionTitle}
        </h2>
        {isSubmitted && (
          <div
            className="mb-6 p-4 text-center bg-green-100 border border-green-400 text-green-700 rounded-md animate-fadeIn"
            role="status"
          >
            {submissionSuccessMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="mb-6 p-4 text-center bg-red-50 border border-red-300 text-red-800 rounded-md animate-fadeIn"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#0c3008] mb-1"
            >
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIconSolid className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isPending}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a6b3d] focus:border-[#4a6b3d] sm:text-sm bg-white text-[#0c3008] disabled:opacity-60"
                placeholder={formPlaceholders.name}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0c3008] mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIconSolid className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isPending}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a6b3d] focus:border-[#4a6b3d] sm:text-sm bg-white text-[#0c3008] disabled:opacity-60"
                placeholder={formPlaceholders.email}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-[#0c3008] mb-1"
            >
              Data do Evento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="eventDate"
                id="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                disabled={isPending}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a6b3d] focus:border-[#4a6b3d] sm:text-sm bg-white text-[#0c3008] disabled:opacity-60"
                placeholder={formPlaceholders.eventDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="invitees"
                className="block text-sm font-medium text-[#0c3008] mb-1"
              >
                Número de Convidados (aprox.)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="invitees"
                  id="invitees"
                  value={formData.invitees}
                  onChange={handleChange}
                  min={1}
                  disabled={isPending}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a6b3d] focus:border-[#4a6b3d] sm:text-sm bg-white text-[#0c3008] disabled:opacity-60"
                  placeholder={formPlaceholders.invitees}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-[#0c3008] mb-1"
              >
                Tipo de Evento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SparklesIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="eventType"
                  id="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  disabled={isPending}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a6b3d] focus:border-[#4a6b3d] sm:text-sm bg-white text-[#0c3008] disabled:opacity-60"
                  placeholder={formPlaceholders.eventType}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[#0c3008] mb-1"
            >
              Detalhes Adicionais / Sua Mensagem
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 top-3 pl-3 flex items-start pointer-events-none">
                <ChatBubbleLeftEllipsisIconSolid className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isPending}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a6b3d] focus:border-[#4a6b3d] sm:text-sm bg-white text-[#0c3008] disabled:opacity-60"
                placeholder={formPlaceholders.message}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-[#f8f9fa] bg-[#4a6b3d] hover:bg-[#3b572f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a6b3d] transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Enviando…" : "Enviar Mensagem"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
