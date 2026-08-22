import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";

const teamMembers = [
  {
    name: "Alami Er'haidi",
    image: "/images/team/alam.jpg",
    role: "Co-fondateur",
    linkedin: "https://www.linkedin.com/in/alami-er-haidi-a7287193/",
  },
  {
    name: "Ludovic Barbry",
    image: "/images/team/ludo-portrait-super.jpg",
    role: "Co-fondateur",
    linkedin: "https://www.linkedin.com/in/ludovic-barbry/",
  },
  {
    name: "Garcia Juan",
    image: "/images/team/technique.jpg",
    role: "Webmaster",
  },
];

const Team = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-balance text-center font-medium text-3xl tracking-[-0.04em] sm:text-4xl md:text-[2.75rem]">
        Notre équipe
      </h2>
      <p className="mt-3 text-balance text-center text-lg text-muted-foreground tracking-[-0.01em] md:text-2xl">
        Les personnes derrière Superentreprise
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-8 sm:mt-16 sm:gap-16">
        {teamMembers.map((member) => (
          <div className="flex flex-col items-center py-8" key={member.name}>
            <div className="mx-auto aspect-square w-48 overflow-hidden rounded-full bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={member.name}
                src={member.image}
                className="size-full object-cover"
              />
            </div>
            <p className="mt-4 text-center font-medium text-lg">
              {member.name}
            </p>
            <p className="mt-0.5 text-center text-muted-foreground">
              {member.role}
            </p>
            {member.linkedin && (
              <Link
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Profil LinkedIn de ${member.name}`}
                className="mt-3"
              >
                <FaLinkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
