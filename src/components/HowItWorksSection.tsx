"use client";

import { useCallback, useState } from "react";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { HowItWorksSectionDTO } from "@/types/content";
import { ContentTransition } from "./ContentTransition";
import { IconFromKey } from "./icons";

interface HowItWorksSectionProps {
  content: HowItWorksSectionDTO;
}

const CIRCLE_POSITIONS = [
  "top-0 left-1/2 -translate-x-1/2",
  "top-1/2 right-0 -translate-y-1/2",
  "bottom-0 left-1/2 -translate-x-1/2",
  "top-1/2 left-0 -translate-y-1/2",
];

export default function HowItWorksSection({ content }: HowItWorksSectionProps) {
  const { sectionTitle, steps } = content;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = steps[selectedIdx] ?? steps[0];
  const total = steps.length;
  const stepCount = Math.min(steps.length, 4);

  const advanceToNext = useCallback(() => {
    setSelectedIdx((prev) => (prev + 1) % stepCount);
  }, [stepCount]);

  useAutoAdvance(stepCount, advanceToNext, selectedIdx);

  return (
    <section
      id="como-funciona"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] text-center mb-14 md:mb-20">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-16 items-center">
          {/* Description panel (left) */}
          <div className="lg:col-span-2 bg-[#f8f9fa]/95 rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden min-h-[280px]">
            <ContentTransition
              panelKey={selected?.id ?? String(selectedIdx)}
              direction="left"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#4a6b3d] text-white text-sm font-semibold tracking-wide uppercase mb-6">
              Passo {selectedIdx + 1} de {total}
            </span>
            <div className="mb-6 p-4 bg-[#c9f0b7] rounded-full inline-block shadow-md">
              <IconFromKey
                iconKey={selected?.iconKey ?? "sparkles"}
                className="w-12 h-12 md:w-14 md:h-14 text-[#4a6b3d]"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#0c3008] mb-4 md:mb-5">
              {selected?.title}
            </h3>
            <p className="text-[#4a6b3d] text-base md:text-lg leading-relaxed">
              {selected?.description}
            </p>
            </ContentTransition>
          </div>

          {/* Lifecycle circle (right) */}
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] aspect-square">
              {/* SVG cyclic arrows in the background */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="howitworks-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a6b3d" />
                  </marker>
                </defs>
                {/* Top → Right */}
                <path
                  d="M 240 80 A 130 130 0 0 1 320 160"
                  stroke="#4a6b3d"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  markerEnd="url(#howitworks-arrow)"
                />
                {/* Right → Bottom */}
                <path
                  d="M 320 240 A 130 130 0 0 1 240 320"
                  stroke="#4a6b3d"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  markerEnd="url(#howitworks-arrow)"
                />
                {/* Bottom → Left */}
                <path
                  d="M 160 320 A 130 130 0 0 1 80 240"
                  stroke="#4a6b3d"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  markerEnd="url(#howitworks-arrow)"
                />
                {/* Left → Top */}
                <path
                  d="M 80 160 A 130 130 0 0 1 160 80"
                  stroke="#4a6b3d"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  markerEnd="url(#howitworks-arrow)"
                />
              </svg>

              {/* Center decoration */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#c9f0b7]/80 backdrop-blur-sm shadow-inner flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a6b3d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 md:w-12 md:h-12"
                >
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <polyline points="21 4 21 10 15 10" />
                </svg>
              </div>

              {/* 4 step circles positioned around */}
              {steps.slice(0, 4).map((step, idx) => {
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`absolute ${CIRCLE_POSITIONS[idx]} w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-xl cursor-pointer rect-state-transition transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#c9f0b7] focus:ring-[#4a6b3d] ${
                      isActive
                        ? "bg-[#4a6b3d] text-white scale-110 shadow-2xl ring-4 ring-[#4a6b3d]/30"
                        : "bg-[#f0f9eb] text-[#0c3008] hover:bg-[#e0f0d7] hover:scale-105"
                    }`}
                    aria-pressed={isActive}
                    aria-label={`Passo ${idx + 1}: ${step.title}`}
                  >
                    <span
                      className={`absolute -top-3 -left-3 w-9 h-9 rounded-full font-bold flex items-center justify-center shadow-md rect-state-transition ${
                        isActive
                          ? "bg-white text-[#4a6b3d]"
                          : "bg-[#4a6b3d] text-white"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <IconFromKey
                      iconKey={step.iconKey}
                      className={`w-8 h-8 md:w-10 md:h-10 mb-1 rect-state-transition ${
                        isActive ? "text-white" : "text-[#4a6b3d]"
                      }`}
                    />
                    <span className="text-xs md:text-sm font-semibold leading-tight px-1">
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile-friendly step indicator (visible on small screens) */}
        <div
          className="mt-10 flex justify-center gap-2 lg:hidden"
          role="tablist"
          aria-label="Navegação dos passos"
        >
          {steps.slice(0, 4).map((step, idx) => (
            <button
              key={`indicator-${step.id}`}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`h-3 rounded-full rect-state-transition ${
                idx === selectedIdx
                  ? "bg-[#4a6b3d] w-8"
                  : "w-3 bg-[#4a6b3d]/30 hover:bg-[#4a6b3d]/60"
              }`}
              aria-label={`Ir para o passo ${idx + 1}`}
              aria-selected={idx === selectedIdx}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
