"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { ServicesSectionDTO } from "@/types/content";
import { CONTENT_SLIDE_TRACK_CLASS } from "./ContentTransition";
import { IconFromKey } from "./icons";

interface ServicesSectionProps {
  content: ServicesSectionDTO;
}

export default function ServicesSection({ content }: ServicesSectionProps) {
  const { sectionTitle, services } = content;
  const corporativosIndex = services.findIndex((s) => s.id === "corporativos");
  const [currentIndex, setCurrentIndex] = useState(
    corporativosIndex >= 0 ? corporativosIndex : 0,
  );

  const total = services.length;
  const current = services[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrentIndex(((index % total) + total) % total);
    },
    [total],
  );

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
  };

  const advanceToNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  useAutoAdvance(total, advanceToNext, currentIndex);

  return (
    <section
      id="servicos"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] text-center mb-14 md:mb-20">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => {
            const isActive = currentIndex === index;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleCardClick(index)}
                className={`group relative rounded-3xl overflow-hidden shadow-xl flex flex-col text-left cursor-pointer rect-state-transition transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#c9f0b7] focus:ring-[#4a6b3d] ${
                  isActive
                    ? "ring-4 ring-[#4a6b3d] scale-[1.03] shadow-2xl"
                    : "hover:shadow-2xl hover:scale-[1.02]"
                }`}
                aria-pressed={isActive}
                aria-label={`Ver detalhes do serviço: ${service.title}`}
              >
                <div className="relative w-full aspect-[5/4] min-h-[240px] bg-[#0c3008]">
                  {service.imageUrl && (
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={`object-cover rect-state-transition ${
                        isActive ? "scale-105" : "group-hover:scale-105"
                      }`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c3008]/85 via-[#0c3008]/30 to-transparent" />
                  <div
                    className={`absolute top-4 left-4 p-3 rounded-full shadow-lg rect-state-transition ${
                      isActive ? "bg-[#4a6b3d]" : "bg-white/90"
                    }`}
                  >
                    <IconFromKey
                      iconKey={service.iconKey}
                      className={`w-7 h-7 rect-state-transition ${
                        isActive ? "text-white" : "text-[#4a6b3d]"
                      }`}
                    />
                  </div>
                </div>
                <div
                  className={`p-6 md:p-8 rect-state-transition ${
                    isActive
                      ? "bg-[#4a6b3d] text-white"
                      : "bg-[#f0f9eb] text-[#0c3008]"
                  }`}
                >
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {service.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {total > 0 && current && (
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-[#f8f9fa]/95">
              <div
                className={`flex ${CONTENT_SLIDE_TRACK_CLASS}`}
                style={{
                  transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
                }}
                aria-live="polite"
              >
                {services.map((service) => (
                  <article
                    key={`detail-${service.id}`}
                    className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2"
                    role="region"
                    aria-labelledby={`service-title-${service.id}`}
                  >
                    {service.imageUrl && (
                      <div className="relative w-full h-64 lg:h-auto lg:min-h-[380px]">
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left p-8 md:p-12 lg:p-14 justify-center">
                      <div className="mb-6 p-4 bg-[#c9f0b7] rounded-full inline-block shadow-lg">
                        <IconFromKey
                          iconKey={service.iconKey}
                          className="w-14 h-14 md:w-16 md:h-16 text-[#4a6b3d]"
                        />
                      </div>
                      <h3
                        id={`service-title-${service.id}`}
                        className="text-2xl md:text-4xl font-bold text-[#0c3008] mb-4 md:mb-6"
                      >
                        {service.title}
                      </h3>
                      <p className="text-[#4a6b3d] text-base md:text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {total > 1 && (
              <div
                className="flex justify-center gap-2 mt-6"
                role="tablist"
                aria-label="Navegação dos serviços"
              >
                {services.map((service, index) => (
                  <button
                    key={`dot-${service.id}`}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-3 rounded-full rect-state-transition ${
                      index === currentIndex
                        ? "w-8 bg-[#4a6b3d]"
                        : "w-3 bg-[#4a6b3d]/30 hover:bg-[#4a6b3d]/60"
                    }`}
                    aria-label={`Ir para ${service.title}`}
                    aria-selected={index === currentIndex}
                    role="tab"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
