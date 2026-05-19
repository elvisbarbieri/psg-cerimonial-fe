"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("[cerimonial-psg] page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-1 items-center justify-center bg-[#c9f0b7] px-4 py-12">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-lg w-full p-8 md:p-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0c3008] mb-4">
          Não foi possível carregar o conteúdo
        </h1>
        <p className="text-[#4a6b3d] text-base md:text-lg leading-relaxed mb-6">
          Estamos com uma instabilidade temporária ao buscar as informações do
          site. Tente novamente em instantes.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#4a6b3d] text-white font-medium shadow-sm hover:bg-[#3b572f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a6b3d] transition-colors"
        >
          Tentar novamente
        </button>
        {process.env.NODE_ENV !== "production" && error?.message && (
          <p className="text-xs text-[#4a6b3d]/70 mt-6 break-words">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
