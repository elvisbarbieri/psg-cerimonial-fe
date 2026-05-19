import ContactForm from "@/components/ContactForm";
import DigitalSolutionsSection from "@/components/DigitalSolutionsSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Header from "@/components/Header";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getSiteContent } from "@/lib/content";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col items-center antialiased flex-1 w-full">
      <Header content={content.header} />
      <main className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <ServicesSection content={content.servicesSection} />
        <HowItWorksSection content={content.howItWorksSection} />
        <DigitalSolutionsSection content={content.digitalSolutionsSection} />
        <GallerySection content={content.gallerySection} />
        <TestimonialsSection content={content.testimonialsSection} />
        <TeamSection content={content.teamSection} />
        <ContactForm content={content.contactFormContent} />
      </main>
      <Footer
        content={content.footer}
        socialLinks={content.header.socialLinks}
      />
    </div>
  );
}
