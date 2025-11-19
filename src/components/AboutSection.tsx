import { MessageSquare, Search, Calendar, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";

export function AboutSection() {
  const [showMore, setShowMore] = useState(false);
  const projectDetailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMore && projectDetailsRef.current) {
      setTimeout(() => {
        projectDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showMore]);

  const scrollToTeam = () => {
    const teamSection = document.getElementById('team');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-[#C8102E]/10 rounded-full">
              <span className="text-[#C8102E]">About the Project</span>
            </div>
            
            <h2 className="text-[#C8102E]">Intelligent University Assistant</h2>
            
            <p className="text-gray-700 leading-relaxed">
              This chatbot helps students, applicants, and staff quickly find information 
              on the university website, including schedules, departments, services, 
              documents, and more. Built with advanced AI technology to provide accurate 
              and instant responses to your queries.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">Quick Search</h3>
                  <p className="text-gray-600 text-sm mt-1">Find information instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">Schedules</h3>
                  <p className="text-gray-600 text-sm mt-1">Access academic calendar</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">Documents</h3>
                  <p className="text-gray-600 text-sm mt-1">Download forms & guides</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600 text-sm mt-1">Always available to help</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                className="bg-[#C8102E] hover:bg-[#AA0E23] text-white rounded-lg shadow-sm"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show Less' : 'Learn More'}
              </Button>
              <Button 
                variant="outline" 
                className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E]/5 rounded-lg"
                onClick={scrollToTeam}
              >
                Contact Us
              </Button>
            </div>

            {/* Additional Information */}
            {showMore && (
              <div ref={projectDetailsRef} className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-[#C8102E]">Project Details</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Mission:</strong> To develop an AI-powered chatbot that serves as a comprehensive 
                    information hub for Kyungpook National University, making campus resources and information 
                    easily accessible to all stakeholders.
                  </p>
                  <p>
                    <strong>Technology:</strong> Built using advanced Natural Language Processing (NLP) and 
                    machine learning algorithms, ensuring accurate understanding of queries and providing 
                    contextually relevant responses.
                  </p>
                  <p>
                    <strong>Features:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Real-time information retrieval from university databases</li>
                    <li>Multi-language support (Korean & English)</li>
                    <li>Integration with academic scheduling systems</li>
                    <li>Document search and recommendation</li>
                    <li>Personalized responses based on user context</li>
                  </ul>
                  <p>
                    <strong>Target Users:</strong> Students, prospective students, faculty members, 
                    administrative staff, and visitors seeking information about KNU services, 
                    facilities, and academic programs.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#C8102E]/5 to-[#AA0E23]/10 rounded-2xl p-12 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-[#C8102E]/20">
                  <MessageSquare className="w-32 h-32 text-[#C8102E]" />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#C8102E] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white">AI</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#C8102E]/30">
                  <GraduationCap className="w-10 h-10 text-[#C8102E]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}