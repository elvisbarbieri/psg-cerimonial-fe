"use client";

import { useCallback, useEffect, useState } from "react";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { DigitalSolutionsSectionDTO } from "@/types/content";
import { ContentTransition } from "./ContentTransition";
import { IconFromKey } from "./icons";

const QR_CHECKIN_ID = "qr-checkin";

interface DigitalSolutionsSectionProps {
  content: DigitalSolutionsSectionDTO;
}

export default function DigitalSolutionsSection({
  content,
}: DigitalSolutionsSectionProps) {
  const { sectionTitle, solutions, videoUrl } = content;
  const demoVideoUrl = videoUrl?.trim() || undefined;
  const hasDemoVideo = Boolean(demoVideoUrl);

  const [selectedId, setSelectedId] = useState<string>(
    solutions[0]?.id ?? "",
  );
  const [videoFailed, setVideoFailed] = useState(false);
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false);

  const selected = solutions.find((s) => s.id === selectedId) ?? solutions[0];
  const showVideoInPanel =
    selectedId === QR_CHECKIN_ID && hasDemoVideo && !videoFailed;

  useEffect(() => {
    setVideoFailed(false);
  }, [demoVideoUrl, selectedId]);

  useEffect(() => {
    if (!showVideoInPanel) {
      setShouldRenderVideo(false);
      return;
    }
    setShouldRenderVideo(true);
  }, [showVideoInPanel]);

  const advanceToNext = useCallback(() => {
    setSelectedId((prev) => {
      const idx = solutions.findIndex((s) => s.id === prev);
      const next = idx < 0 ? 0 : (idx + 1) % solutions.length;
      return solutions[next]?.id ?? prev;
    });
  }, [solutions]);

  useAutoAdvance(solutions.length, advanceToNext, selectedId);

  return (
    <section
      id="tecnologia-inovacao"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] text-center mb-14 md:mb-20">
          {sectionTitle}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 max-w-6xl mx-auto items-stretch">
          <div className="flex flex-col gap-4 md:gap-5 w-full lg:w-72 xl:w-80 flex-shrink-0">
            {solutions.map((solution) => {
              const isActive = selectedId === solution.id;
              return (
                <button
                  key={solution.id}
                  type="button"
                  onClick={() => setSelectedId(solution.id)}
                  className={`flex items-center gap-4 w-full min-h-[100px] md:min-h-[112px] px-6 py-5 rounded-2xl shadow-lg cursor-pointer rect-state-transition transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#c9f0b7] focus:ring-[#4a6b3d] ${
                    isActive
                      ? "bg-[#4a6b3d] text-white scale-[1.02] shadow-xl ring-2 ring-[#4a6b3d]/40"
                      : "bg-[#f0f9eb] hover:bg-[#e0f0d7] text-[#0c3008] hover:shadow-xl"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Selecionar solução: ${solution.title}`}
                >
                  <div
                    className={`p-3 rounded-full shadow-md flex-shrink-0 rect-state-transition ${
                      isActive ? "bg-white/20" : "bg-[#c9f0b7]"
                    }`}
                  >
                    <IconFromKey
                      iconKey={solution.iconKey}
                      className={`w-8 h-8 md:w-9 md:h-9 rect-state-transition ${
                        isActive ? "text-white" : "text-[#4a6b3d]"
                      }`}
                    />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-left leading-snug">
                    {solution.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="flex-1 min-h-[420px] md:min-h-[520px] lg:min-h-[560px] bg-[#f8f9fa]/95 p-8 md:p-12 lg:p-14 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
              {hasDemoVideo && (
                <div
                  className={`w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl bg-[#0c3008]/90 rect-state-transition ${
                    showVideoInPanel
                      ? "max-h-[400px] md:max-h-[420px] opacity-100 mb-8"
                      : "max-h-0 opacity-0 mb-0 pointer-events-none"
                  }`}
                >
                  <div className="relative w-full aspect-[9/16] sm:aspect-video max-h-[320px] md:max-h-[380px]">
                    {shouldRenderVideo && showVideoInPanel && demoVideoUrl && (
                      <video
                        className="absolute inset-0 w-full h-full object-contain"
                        src={demoVideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label="Demonstração do check-in com QR Code"
                        onError={() => setVideoFailed(true)}
                      >
                        Seu navegador não suporta vídeos.
                      </video>
                    )}
                  </div>
                </div>
              )}

              <ContentTransition panelKey={selected.id} direction="right">
                <div className="flex flex-col items-center text-center flex-1 justify-center">
                  <div className="mb-6 p-5 bg-[#c9f0b7] rounded-full shadow-lg">
                    <IconFromKey
                      iconKey={selected.iconKey}
                      className="w-14 h-14 md:w-16 md:h-16 text-[#4a6b3d]"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0c3008] mb-4 md:mb-6">
                    {selected.title}
                  </h3>
                  <p className="text-[#4a6b3d] text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
                    {selected.description}
                  </p>
                </div>
              </ContentTransition>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
