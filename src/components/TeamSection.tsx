import Image from "next/image";
import type { TeamMemberDTO, TeamSectionDTO } from "@/types/content";
import { LinkedInIcon, UserCircleIcon } from "./icons";

function TeamMemberCard({ member }: { member: TeamMemberDTO }) {
  return (
    <div className="bg-[#f8f9fa]/90 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl rect-state-transition flex flex-col items-center text-center h-full">
      {member.avatarUrl ? (
        <Image
          src={member.avatarUrl}
          alt={`Foto de ${member.name}`}
          width={96}
          height={96}
          sizes="96px"
          loading="lazy"
          className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg border-2 border-white"
        />
      ) : (
        <UserCircleIcon className="w-24 h-24 text-[#4a6b3d] mb-4" />
      )}
      <h3
        className={`text-xl font-semibold mb-1 ${
          member.isLead ? "text-[#9bc48a]" : "text-[#0c3008]"
        }`}
      >
        {member.name}
      </h3>
      <p
        className={`text-md flex-grow ${
          member.isLead ? "text-[#4a6b3d] font-medium" : "text-[#2c3e50]"
        }`}
      >
        {member.role}
      </p>
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${member.name}`}
          className="mt-4 text-[#4a6b3d] hover:text-[#0c3008] transition-colors duration-300"
        >
          <LinkedInIcon className="w-7 h-7" />
        </a>
      )}
    </div>
  );
}

interface TeamSectionProps {
  content: TeamSectionDTO;
}

export default function TeamSection({ content }: TeamSectionProps) {
  const { sectionTitle, members } = content;
  const lead = members.find((m) => m.isLead);
  const others = members.filter((m) => !m.isLead);

  return (
    <section
      id="equipe"
      className="py-20 md:py-28 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl my-16 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="container mx-auto px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#0c3008] mb-14 md:mb-20">
          {sectionTitle}
        </h2>

        {lead && (
          <div className="mb-12 md:mb-16 max-w-md mx-auto">
            <TeamMemberCard member={lead} />
          </div>
        )}

        {others.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              others.length === 1 ? "max-w-sm mx-auto" : "lg:grid-cols-2"
            } gap-8 md:gap-10`}
          >
            {others.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
