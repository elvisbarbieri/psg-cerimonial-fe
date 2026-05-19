"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeaderContent } from "@/types/content";
import HeaderNav from "./HeaderNav";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./icons";

interface HeaderProps {
  content: HeaderContent;
}

function getPlayableVideoSources(sources: string[] | undefined): string[] {
  if (!sources?.length) return [];
  return sources
    .map((source) => source.trim())
    .filter(
      (source) =>
        source.length > 0 &&
        (source.startsWith("http://") || source.startsWith("https://")),
    );
}

export default function Header({ content }: HeaderProps) {
  const { logoUrl, videoSources, title, socialLinks } = content;
  const playableVideoSources = getPlayableVideoSources(videoSources);
  const hasVideos = playableVideoSources.length > 0;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false);
  const [videoFallbackActive, setVideoFallbackActive] = useState(!hasVideos);

  useEffect(() => {
    setVideoFallbackActive(!hasVideos);
    setCurrentVideoIndex(0);
    setShouldRenderVideo(false);
  }, [hasVideos, playableVideoSources.join("|")]);

  useEffect(() => {
    if (!hasVideos) return;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const conn = nav.connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g/i.test(conn.effectiveType)) return;

    const el = sectionRef.current;
    if (!el) return;

    let cancelled = false;

    const scheduleMount = () => {
      const w = window as typeof window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(
          () => {
            if (!cancelled) setShouldRenderVideo(true);
          },
          { timeout: 4000 },
        );
      } else {
        setTimeout(() => {
          if (!cancelled) setShouldRenderVideo(true);
        }, 2000);
      }
    };

    if (typeof IntersectionObserver !== "function") {
      scheduleMount();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            scheduleMount();
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [hasVideos]);

  const handleVideoEnded = () => {
    if (!hasVideos) return;
    setCurrentVideoIndex((prev) => (prev + 1) % playableVideoSources.length);
  };

  const handleVideoError = () => {
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < playableVideoSources.length) {
      setCurrentVideoIndex(nextIndex);
      return;
    }
    setShouldRenderVideo(false);
    setVideoFallbackActive(true);
  };

  const currentVideoSrc = playableVideoSources[currentVideoIndex];
  const showVideo = hasVideos && shouldRenderVideo && !videoFallbackActive;
  const showLogoBackdrop =
    videoFallbackActive && Boolean(logoUrl?.trim());

  const whatsappNumber = socialLinks?.whatsapp?.number;
  const whatsappDisplay = socialLinks?.whatsapp?.displayText;

  return (
    <header
      ref={sectionRef}
      id="inicio"
      className="w-full min-h-[85vh] py-12 md:py-16 flex flex-col items-center justify-center text-center text-[#0c3008] relative overflow-hidden bg-gradient-to-br from-[#c9f0b7] via-[#a0d889] to-[#4a6b3d] scroll-mt-20 md:scroll-mt-24"
      role="banner"
      aria-label={`${title} - Organização de Eventos`}
    >
      {showLogoBackdrop && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none relative"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <Image
            src={logoUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover scale-150 blur-3xl opacity-25"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9f0b7]/90 via-[#a0d889]/85 to-[#4a6b3d]/90" />
        </div>
      )}

      {showVideo && currentVideoSrc && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <video
            key={currentVideoSrc}
            className="absolute inset-0 w-full h-full object-cover opacity-0 [animation:fadeIn_0.6s_ease-out_forwards]"
            src={currentVideoSrc}
            title="Background video of events"
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          >
            Seu navegador não suporta vídeos.
          </video>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <Image
          src={logoUrl}
          alt={`${title} Logo - Organização de Eventos`}
          width={192}
          height={192}
          sizes="(min-width: 768px) 192px, 160px"
          priority
          fetchPriority="high"
          className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/60 shadow-lg opacity-95 transform hover:scale-105 transition-transform duration-300"
        />
        <div className="mt-8 flex space-x-5">
          {socialLinks?.instagramUrl && (
            <a
              href={socialLinks.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-3 bg-[#4a6b3d] text-white rounded-full shadow-md hover:bg-[#3b572f] transition-colors duration-300 transform hover:scale-110"
              aria-label={`Instagram de ${title}`}
            >
              <InstagramIcon className="w-8 h-8" />
            </a>
          )}
          {socialLinks?.linkedinUrl && (
            <a
              href={socialLinks.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-3 bg-[#4a6b3d] text-white rounded-full shadow-md hover:bg-[#3b572f] transition-colors duration-300 transform hover:scale-110"
              aria-label={`LinkedIn de ${title}`}
            >
              <LinkedInIcon className="w-8 h-8" />
            </a>
          )}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-3 bg-[#4a6b3d] text-white rounded-full shadow-md hover:bg-[#3b572f] transition-colors duration-300 transform hover:scale-110"
              aria-label={`Contatar via WhatsApp${whatsappDisplay ? ` no número ${whatsappDisplay}` : ""}`}
            >
              <WhatsAppIcon className="w-8 h-8" />
            </a>
          )}
        </div>

        <HeaderNav />
      </div>
    </header>
  );
}
