import { Mail, Crown } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  initials: string;
  email: string;
  isLeader: boolean;
}

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#C8102E]/30 hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C8102E] to-[#AA0E23] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
            <span className="text-xl">{member.initials}</span>
          </div>
          {member.isLeader && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C8102E] rounded-full flex items-center justify-center shadow-md">
              <Crown className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Name and Role */}
        <div>
          <h3 className="text-gray-900 group-hover:text-[#C8102E] transition-colors">
            {member.name}
          </h3>
          <p className="text-gray-600 text-sm mt-2">{member.role}</p>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-gray-600 group-hover:text-[#C8102E] transition-colors">
          <Mail className="w-4 h-4" />
          <a 
            href={`mailto:${member.email}`}
            className="text-sm hover:underline"
          >
            {member.email}
          </a>
        </div>

        {/* Decorative line */}
        <div className="w-12 h-1 bg-[#C8102E]/20 rounded-full group-hover:w-full group-hover:bg-[#C8102E] transition-all duration-300"></div>
      </div>
    </div>
  );
}