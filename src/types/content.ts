export type ServiceIconKey = "heart" | "briefcase" | "camera";

export type HowItWorksIconKey =
  | "clipboardDocumentCheck"
  | "users"
  | "sparkles"
  | "chartPie";

export type DigitalSolutionIconKey = "qrCode" | "gift" | "cursorArrowRays";

export type IconKey =
  | ServiceIconKey
  | HowItWorksIconKey
  | DigitalSolutionIconKey
  | string;

export interface SocialLinks {
  instagramUrl?: string;
  linkedinUrl?: string;
  whatsapp?: {
    number: string;
    displayText: string;
  };
}

export interface HeaderContent {
  logoUrl: string;
  videoSources: string[];
  title: string;
  tagline: string;
  socialLinks: SocialLinks;
}

export interface ServiceItemDTO {
  id: string;
  title: string;
  iconKey: IconKey;
  description: string;
  imageUrl?: string;
}

export interface ServicesSectionDTO {
  sectionTitle: string;
  services: ServiceItemDTO[];
}

export interface HowItWorksStepDTO {
  id: string;
  title: string;
  iconKey: IconKey;
  description: string;
}

export interface HowItWorksSectionDTO {
  sectionTitle: string;
  steps: HowItWorksStepDTO[];
}

export interface DigitalSolutionDTO {
  id: string;
  title: string;
  iconKey: IconKey;
  description: string;
}

export interface DigitalSolutionsSectionDTO {
  sectionTitle: string;
  videoUrl?: string;
  solutions: DigitalSolutionDTO[];
}

export interface GalleryItemDTO {
  id: string;
  imageUrl: string;
  description: string;
  altText: string;
}

export interface GallerySectionDTO {
  sectionTitle: string;
  items: GalleryItemDTO[];
}

export interface TestimonialDTO {
  id: string;
  name: string;
  feedback: string;
  avatarUrl?: string;
}

export interface TestimonialsSectionDTO {
  sectionTitle: string;
  testimonials: TestimonialDTO[];
}

export interface TeamMemberDTO {
  id: string;
  name: string;
  role: string;
  isLead?: boolean;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface TeamSectionDTO {
  sectionTitle: string;
  members: TeamMemberDTO[];
}

export interface ContactFormContentDTO {
  sectionTitle: string;
  submissionSuccessMessage: string;
  formPlaceholders: {
    name: string;
    email: string;
    eventDate: string;
    invitees: string;
    eventType: string;
    message: string;
  };
}

export interface FooterContentDTO {
  title: string;
  copyrightText: string;
  tagline: string;
}

export interface SiteContent {
  header: HeaderContent;
  servicesSection: ServicesSectionDTO;
  howItWorksSection: HowItWorksSectionDTO;
  digitalSolutionsSection: DigitalSolutionsSectionDTO;
  gallerySection: GallerySectionDTO;
  testimonialsSection: TestimonialsSectionDTO;
  teamSection: TeamSectionDTO;
  contactFormContent: ContactFormContentDTO;
  footer: FooterContentDTO;
}
