"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { GalleryItemDTO, GallerySectionDTO } from "@/types/content";
import { CONTENT_SLIDE_TRACK_CLASS } from "./ContentTransition";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "./icons";

interface GallerySectionProps {
  content: GallerySectionDTO;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function PlayBadge() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
      aria-hidden="true"
    >
      <span className="rounded-full bg-white/90 text-[#0c3008] w-14 h-14 flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 translate-x-0.5"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
  );
}

function SlideMedia({
  item,
  active,
}: {
  item: GalleryItemDTO;
  active: boolean;
}) {
  const video = isVideoUrl(item.imageUrl);
  if (video) {
    return (
      <>
        <video
          className="w-full h-full object-cover"
          src={item.imageUrl}
          muted
          playsInline
          preload="none"
          controls={false}
          aria-label={item.altText}
          poster=""
        />
        <PlayBadge />
      </>
    );
  }
  return (
    <Image
      src={item.imageUrl}
      alt={item.altText}
      fill
      sizes="(min-width: 1024px) 1024px, 100vw"
      className="object-cover"
      priority={active}
      loading={active ? "eager" : "lazy"}
    />
  );
}

function ThumbMedia({ item }: { item: GalleryItemDTO }) {
  const video = isVideoUrl(item.imageUrl);
  if (video) {
    return (
      <div className="w-full h-full relative bg-[#0c3008]">
        <PlayBadge />
      </div>
    );
  }
  return (
    <Image
      src={item.imageUrl}
      alt={`Miniatura: ${item.altText}`}
      fill
      sizes="(min-width: 1280px) 96px, (min-width: 1024px) 80px, (min-width: 768px) 88px, 72px"
      className="object-cover"
      loading="lazy"
    />
  );
}

export default function GallerySection({ content }: GallerySectionProps) {
  const { sectionTitle, items } = content;
  const totalSlides = items.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItemDTO | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      totalSlides === 0 ? 0 : (prev + 1) % totalSlides,
    );
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      totalSlides === 0 ? 0 : (prev - 1 + totalSlides) % totalSlides,
    );
  }, [totalSlides]);

  const openModal = (item: GalleryItemDTO) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    openModal(items[index]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen) {
        if (event.key === "Escape") closeModal();
      } else {
        if (event.key === "ArrowRight") nextSlide();
        else if (event.key === "ArrowLeft") prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, nextSlide, prevSlide, closeModal]);

  useAutoAdvance(totalSlides, nextSlide, currentIndex, {
    enabled: !isModalOpen,
  });

  if (totalSlides === 0) return null;

  const isWithinWindow = (index: number) => {
    if (totalSlides <= 3) return true;
    const distance = Math.min(
      Math.abs(index - currentIndex),
      totalSlides - Math.abs(index - currentIndex),
    );
    return distance <= 1;
  };

  return (
    <section
      id="galeria"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] mb-14 md:mb-16">
          {sectionTitle}
        </h2>

        <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-2xl">
          <div
            className={`flex ${CONTENT_SLIDE_TRACK_CLASS}`}
            style={{
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            }}
            role="listbox"
            aria-live="polite"
          >
            {items.map((item, index) => {
              const active = index === currentIndex;
              const inWindow = isWithinWindow(index);
              return (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0"
                  role="option"
                  aria-selected={active}
                >
                  <figure
                    className="aspect-video relative group cursor-pointer bg-[#0c3008]"
                    onClick={() => openModal(item)}
                  >
                    {inWindow ? (
                      <SlideMedia item={item} active={active} />
                    ) : null}
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </figcaption>
                  </figure>
                </div>
              );
            })}
          </div>

          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-[#4a6b3d]/70 hover:bg-[#4a6b3d] text-white p-2 rounded-full shadow-md transition-colors duration-300 z-10"
                aria-label="Slide anterior"
              >
                <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-[#4a6b3d]/70 hover:bg-[#4a6b3d] text-white p-2 rounded-full shadow-md transition-colors duration-300 z-10"
                aria-label="Próximo slide"
              >
                <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </>
          )}
        </div>

        {totalSlides > 1 && (
          <div
            className="flex justify-center mt-6 space-x-2 flex-wrap gap-y-2"
            role="tablist"
            aria-label="Navegação dos slides"
          >
            {items.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full rect-state-transition ${
                  currentIndex === index
                    ? "w-8 bg-[#4a6b3d]"
                    : "w-3 bg-[#4a6b3d]/30 hover:bg-[#4a6b3d]/60"
                }`}
                aria-label={`Ir para o slide ${index + 1}`}
                aria-selected={currentIndex === index}
                role="tab"
              />
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10 gap-2 md:gap-3 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <button
              key={`wall-${item.id}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#4a6b3d] focus:ring-offset-2 rect-state-transition relative ${
                currentIndex === index
                  ? "ring-2 ring-[#4a6b3d] ring-offset-2 opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Ver em tamanho maior: ${item.description}`}
              aria-pressed={currentIndex === index}
            >
              <ThumbMedia item={item} />
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-image-description"
        >
          <div
            className="bg-white p-4 rounded-lg shadow-xl max-w-3xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 bg-white/50 hover:bg-white/80 rounded-full p-1 transition-colors duration-200 z-10"
              aria-label="Fechar modal"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>
            {isVideoUrl(selectedItem.imageUrl) ? (
              <video
                className="max-w-full max-h-[80vh] object-contain rounded"
                src={selectedItem.imageUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={selectedItem.altText}
              />
            ) : (
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.altText}
                width={1280}
                height={853}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded"
              />
            )}
            <p
              id="modal-image-description"
              className="text-center text-[#0c3008] mt-3 text-lg"
            >
              {selectedItem.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
