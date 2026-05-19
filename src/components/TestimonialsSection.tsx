import Image from "next/image";
import type { TestimonialsSectionDTO } from "@/types/content";

interface TestimonialsSectionProps {
  content: TestimonialsSectionDTO;
}

export default function TestimonialsSection({
  content,
}: TestimonialsSectionProps) {
  const { sectionTitle, testimonials } = content;

  return (
    <section
      id="depoimentos"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] text-center mb-14 md:mb-20">
          {sectionTitle}
        </h2>
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-[#f8f9fa]/90 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-10 transform rect-state-transition hover:scale-[1.02] hover:shadow-2xl"
              aria-label={`Depoimento de ${testimonial.name}`}
            >
              <div
                className={`flex-shrink-0 ${index % 2 !== 0 ? "md:order-2" : "md:order-1"}`}
              >
                {testimonial.avatarUrl ? (
                  <Image
                    src={testimonial.avatarUrl}
                    alt={`Foto de ${testimonial.name}`}
                    width={96}
                    height={96}
                    sizes="96px"
                    loading="lazy"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-md border-2 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                    Sem foto
                  </div>
                )}
              </div>

              <div
                className={`flex-1 text-center ${
                  index % 2 !== 0
                    ? "md:order-1 md:text-left"
                    : "md:order-2 md:text-left"
                }`}
              >
                <p className="text-[#2c3e50] italic mb-4 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  &ldquo;{testimonial.feedback.trim()}&rdquo;
                </p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#0c3008]">
                  {testimonial.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
