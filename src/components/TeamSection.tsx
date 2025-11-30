import { TeamCard } from "./TeamCard";
import { useContext } from 'react';
import { LanguageContext } from '../App';

const teamMembers = [
  {
    id: 1,
    name: "Nishtha",
    role: "Project Leader, AI & Backend Developer",
    initials: "N",
    email: "lathnishtha775@knu.ac.kr",
    isLeader: true
  },
  {
    id: 2,
    name: "Malysheva Anastasia",
    role: "Frontend Developer & UI Designer",
    initials: "MA",
    email: "1803nastiama2003@gmail.com",
    isLeader: false
  },
  {
    id: 3,
    name: "Suzi",
    role: "UI Designer",
    initials: "S",
    email: "suzannadzhanazyan@yahoo.com ",
    isLeader: false
  },
  {
    id: 4,
    name: "Rakshitha Nagaraj",
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
  const { lang } = useContext(LanguageContext);
  return (
    <section id="team" className="pt-4 pb-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1.5 bg-[#C8102E]/10 rounded-full mb-3">
            <span className="text-[#C8102E]">{lang === 'ko' ? '우리 팀' : 'Our Team'}</span>
          </div>
          <h2 className="text-[#C8102E]">{lang === 'ko' ? '팀을 소개합니다' : 'Meet the Team'}</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {lang === 'ko' ? 'KNU 커뮤니티를 위한 지능형 도우미를 만들기 위해 연구자, 개발자, 디자이너가 함께 협력하고 있습니다.' : 'A dedicated group of researchers, developers, and designers working together to create an intelligent assistant for the KNU community.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}