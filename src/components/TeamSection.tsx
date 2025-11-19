import { TeamCard } from "./TeamCard";

const teamMembers = [
  {
    id: 1,
    name: "Nishtha",
    role: "Project Lead & AI Research",
    initials: "N",
    email: "???@knu.ac.kr",
    isLeader: true
  },
  {
    id: 2,
    name: "Malysheva Anastasia",
    role: "Frontend Developer",
    initials: "MA",
    email: "1803nastiama2003@gmail.com",
    isLeader: false
  },
  {
    id: 3,
    name: "Suzi",
    role: "UX/UI Designer",
    initials: "S",
    email: "suzannadzhanazyan@yahoo.com ",
    isLeader: false
  },
  {
    id: 4,
    name: "Rakshita",
    role: "Backend Developer",
    initials: "RN",
    email: "rakshu20303@gmail.com",
    isLeader: false
  },
  {
    id: 5,
    name: "Tootsy",
    role: "Backend Developer",
    initials: "T",
    email: "tootsydeshmukh@gmail.com",
    isLeader: false
  }
];

export function TeamSection() {
  return (
    <section id="team" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#C8102E]/10 rounded-full mb-4">
            <span className="text-[#C8102E]">Our Team</span>
          </div>
          <h2 className="text-[#C8102E]">Meet the Team</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A dedicated group of researchers, developers, and designers working together 
            to create an intelligent assistant for the KNU community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}