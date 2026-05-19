import "server-only";
import type { SiteContent } from "@/types/content";

const REVALIDATE_SECONDS = 300;

function isValidHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/** Returns a playable URL or `undefined` when missing/invalid (section renders without video). */
function resolveOptionalVideoUrl(
  primary?: string | null,
  fallbackEnv?: string | null,
): string | undefined {
  for (const candidate of [primary, fallbackEnv]) {
    const trimmed = candidate?.trim();
    if (!trimmed) continue;
    const sanitized = sanitizeUrl(trimmed);
    if (sanitized && isValidHttpUrl(sanitized)) return sanitized;
  }
  return undefined;
}

function sanitizeUrl(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    const segments = parsed.pathname.split("/").map((segment) => {
      try {
        const decoded = decodeURIComponent(segment);
        return encodeURIComponent(decoded);
      } catch {
        return encodeURIComponent(segment);
      }
    });
    parsed.pathname = segments.join("/");
    return parsed.toString();
  } catch {
    return raw;
  }
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    header: {
      ...content.header,
      logoUrl: sanitizeUrl(content.header.logoUrl),
      videoSources: (content.header.videoSources ?? [])
        .map((source) => sanitizeUrl(source?.trim()))
        .filter((url) => url.length > 0 && isValidHttpUrl(url)),
    },
    servicesSection: {
      ...content.servicesSection,
      services: content.servicesSection.services.map((s) => ({
        ...s,
        imageUrl: s.imageUrl ? sanitizeUrl(s.imageUrl) : s.imageUrl,
      })),
    },
    digitalSolutionsSection: {
      ...content.digitalSolutionsSection,
      videoUrl: resolveOptionalVideoUrl(
        content.digitalSolutionsSection.videoUrl,
        process.env.DIGITAL_SOLUTIONS_VIDEO_FALLBACK_URL,
      ),
    },
    gallerySection: {
      ...content.gallerySection,
      items: content.gallerySection.items.map((item) => ({
        ...item,
        imageUrl: sanitizeUrl(item.imageUrl),
      })),
    },
    testimonialsSection: {
      ...content.testimonialsSection,
      testimonials: content.testimonialsSection.testimonials.map((t) => ({
        ...t,
        avatarUrl: t.avatarUrl ? sanitizeUrl(t.avatarUrl) : t.avatarUrl,
      })),
    },
    teamSection: {
      ...content.teamSection,
      members: content.teamSection.members.map((m) => ({
        ...m,
        avatarUrl: m.avatarUrl ? sanitizeUrl(m.avatarUrl) : m.avatarUrl,
      })),
    },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const baseUrl = process.env.CONTENT_API_URL;
  const code = process.env.CONTENT_API_CODE;

  if (!baseUrl) {
    throw new Error("CONTENT_API_URL is not configured");
  }
  if (!code) {
    throw new Error("CONTENT_API_CODE is not configured");
  }

  const url = `${baseUrl}?code=${encodeURIComponent(code)}`;

  const res = await fetch(url, {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS, tags: ["site-content"] },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch site content (status ${res.status} ${res.statusText})`,
    );
  }

  const data = (await res.json()) as SiteContent;
  return normalizeContent(data);
}
