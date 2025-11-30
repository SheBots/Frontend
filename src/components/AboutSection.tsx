import { MessageSquare, Search, Calendar, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect, useContext } from "react";
import { LanguageContext } from '../App';

export function AboutSection() {
  const { lang } = useContext(LanguageContext);
  const [showMore, setShowMore] = useState(false);
  const projectDetailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMore && projectDetailsRef.current) {
      setTimeout(() => {
        // Scroll to show buttons and project details section
        const element = projectDetailsRef.current;
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const offset = 155; // Offset to show the buttons above the project details
          window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
        }
      }, 100);
    } else if (!showMore) {
      // Scroll to the top of the page when closing
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showMore]);

  const scrollToTeam = () => {
    // Find and click the Team button in the header
    const teamButton = document.querySelector('a[href="#team"]') as HTMLAnchorElement;
    if (teamButton) {
      teamButton.click();
    }
  };

  return (
    <section id="about" className="pt-4 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Text Content */}
          <div className="space-y-3">
            <div className="inline-block px-4 py-2 bg-[#C8102E]/10 rounded-full">
              <span className="text-[#C8102E]">{lang === 'ko' ? '프로젝트 소개' : 'About the Project'}</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-[#C8102E]">{lang === 'ko' ? '지능형 컴퓨터학부 안내 챗봇' : 'Intelligent CS Department Assistant'}</h2>
              
              <p className="text-gray-700 leading-relaxed">
                {lang === 'ko'
                  ? 'SheBots는 경북대학교 컴퓨터학부 학생, 지원자, 신입생, 그리고 외국인 유학생이 필요한 정보를 쉽고 빠르게 찾을 수 있도록 도와주는 AI 기반 챗봇입니다. 학부 공지사항, 강의 정보, 시간표, 자주 묻는 질문(FAQ), 서류 및 가이드 등 다양한 학부 정보를 효율적으로 안내하여, 복잡한 웹페이지 탐색 없이도 정확하고 즉각적인 답변을 제공합니다.'
                  : 'This chatbot helps Computer Science students, prospective applicants, and international students quickly find essential information from the KNU Computer Science Department, including announcements, course details, schedules, FAQs, documents, and more. Designed with advanced AI technology, SheBots provides clear, accurate, and instant responses—making it easier for users to navigate departmental information without searching through multiple webpages.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">{lang === 'ko' ? '빠른 검색' : 'Quick Search'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{lang === 'ko' ? '공지·강의·사무실 등 학부 정보를 즉시 검색' : 'Instantly find announcements, course details, office info, and department resources.'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">{lang === 'ko' ? '학사 일정 확인' : 'Schedules'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{lang === 'ko' ? '학사 캘린더 및 컴퓨터학부 시간표 손쉽게 확인' : 'Easily access academic calendars and CS department schedules.'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">{lang === 'ko' ? '문서 다운로드' : 'Documents'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{lang === 'ko' ? '서류·양식·가이드 등 학부 문서 빠르게 확인 및 다운로드' : 'Quickly locate and download forms, guides, and academic documents.'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#C8102E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="text-gray-900">{lang === 'ko' ? '24/7 지원' : '24/7 Support'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{lang === 'ko' ? '학생·신입생·유학생에게 언제든지 즉시 응답' : 'Always available to help students, newcomers, and international visitors.'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <Button 
                className="bg-[#C8102E] hover:bg-[#AA0E23] text-white rounded-lg shadow-sm"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (lang === 'ko' ? '접기' : 'Show Less') : (lang === 'ko' ? '사용자 가이드' : 'User Guide')}
              </Button>
              <Button 
                variant="outline" 
                className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E]/5 rounded-lg"
                onClick={scrollToTeam}
              >
                {lang === 'ko' ? '문의하기' : 'Contact Us'}
              </Button>
            </div>
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

        {/* Additional Information - Separate Section */}
        {showMore && (
          <div ref={projectDetailsRef} className="mt-8 p-8 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 text-gray-700">
              {/* User Guidelines */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900">{lang === 'ko' ? '사용자 안내' : 'User Guidelines'}</h4>
                
                <ul className="list-disc list-inside space-y-1 ml-4 text-base">
                  {lang === 'ko' ? (
                    <>
                      <li><strong>챗봇 열기:</strong> 화면 오른쪽 아래의 챗봇 아이콘을 클릭합니다.</li>
                      <li><strong>질문 선택 또는 직접 입력:</strong> 추천 질문을 선택하거나 한국어 또는 영어로 직접 질문을 입력할 수 있습니다.</li>
                      <li><strong>즉시 답변 확인:</strong> 공지사항, 시간표, 문서, 졸업 요건 등 학부 정보를 빠르고 명확하게 안내합니다.</li>
                      <li><strong>언어 전환 가능:</strong> 상단의 Kor/Eng 버튼을 눌러 언제든지 언어를 변경할 수 있습니다.</li>
                      <li><strong>PC·모바일 모두 지원:</strong> 노트북, 태블릿, 휴대폰 어디서든 편리하게 이용 가능합니다.</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Open the Chatbot:</strong> Click the chatbot icon at the bottom-right corner of the screen.</li>
                      <li><strong>Choose or Type a Question:</strong> Select a suggested question, or type your own question in English or Korean.</li>
                      <li><strong>Receive Instant Answers:</strong> SheBots provides clear and fast information about announcements, schedules, documents, graduation requirements, and more.</li>
                      <li><strong>Switch Language Anytime:</strong> Use the Kor/Eng toggle to change the website language.</li>
                      <li><strong>Mobile & PC Friendly:</strong> You can access the chatbot easily from laptops, tablets, or mobile devices.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Humble Request Section */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900">{lang === 'ko' ? '사용자 여러분께 드리는 부탁' : 'Humble Request to Our Users'}</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-base leading-relaxed">
                  {lang === 'ko' ? (
                    <>
                      <li>본 챗봇은 현재 <strong>베타 버전</strong>으로, 일부 정보가 완전히 구축되지 않았을 수 있습니다.</li>
                      <li>정확한 CS 학부 정보를 제공하기 위해 노력하고 있으나, <strong>일부 답변이 완전하게 정확하지 않을 수 있습니다.</strong> 너그러운 양해 부탁드립니다.</li>
                      <li>SheBots는 <strong>GPT-4.1 API</strong>를 사용하고 있으며, 테스트 환경에서 리소스가 제한되어 있습니다.</li>
                      <li>모든 사용자가 안정적으로 이용할 수 있도록, <strong>적절한 이용량을 지켜주시면</strong> 감사하겠습니다.</li>
                      <li className="italic">여러분의 피드백과 이해는 더 나은 챗봇을 만드는 데 큰 도움이 됩니다.</li>
                    </>
                  ) : (
                    <>
                      <li>This chatbot is currently in its <strong>beta testing phase</strong>, and some information may still be incomplete.</li>
                      <li>Although we try our best to provide correct CS department information, <strong>some answers may not always be fully accurate.</strong> We kindly ask for your understanding.</li>
                      <li>The chatbot uses the <strong>GPT-4.1 API</strong>, and our testing environment has limited resources.</li>
                      <li>To ensure stable operation for all users, please <strong>use the chatbot in an appropriate amount.</strong></li>
                      <li className="italic">Your feedback and patience help us improve SheBots for future students.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
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