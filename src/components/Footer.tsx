import type { FooterContentDTO, SocialLinks } from "@/types/content";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./icons";

interface FooterProps {
  content: FooterContentDTO;
  socialLinks?: SocialLinks;
}

export default function Footer({ content, socialLinks }: FooterProps) {
  const whatsapp = socialLinks?.whatsapp;

  return (
    <footer className="w-full bg-[#4a6b3d] text-[#f8f9fa] py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-4">{content.title}</h3>
        <div className="flex justify-center space-x-5 md:space-x-6 mb-6">
          {socialLinks?.instagramUrl && (
            <a
              href={socialLinks.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#f8f9fa] hover:text-[#c9f0b7] transition-colors duration-300"
            >
              <InstagramIcon className="w-8 h-8" />
            </a>
          )}
          {socialLinks?.linkedinUrl && (
            <a
              href={socialLinks.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#f8f9fa] hover:text-[#c9f0b7] transition-colors duration-300"
            >
              <LinkedInIcon className="w-8 h-8" />
            </a>
          )}
          {whatsapp?.number && (
            <a
              href={`https://wa.me/${whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp${whatsapp.displayText ? `: ${whatsapp.displayText}` : ""}`}
              className="text-[#f8f9fa] hover:text-[#c9f0b7] transition-colors duration-300"
            >
              <WhatsAppIcon className="w-8 h-8" />
            </a>
          )}
        </div>
        <p
          className="text-sm text-[#c9f0b7]"
          dangerouslySetInnerHTML={{ __html: content.copyrightText }}
        />
        <p className="text-xs text-[#c9f0b7] mt-1">{content.tagline}</p>
      </div>
    </footer>
  );
}
