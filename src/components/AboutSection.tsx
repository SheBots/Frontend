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
                {showMore ? (lang === 'ko' ? '접기' : 'Show Less') : (lang === 'ko' ? '더 알아보기' : 'Learn More')}
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
            <h3 className="text-2xl font-semibold text-[#C8102E] mb-6">{lang === 'ko' ? '프로젝트 상세 정보' : 'Project Details'}</h3>
            <div className="grid md:grid-cols-2 gap-8 text-gray-700">
              <div className="space-y-4">
                <p className="text-base leading-relaxed">
                  {lang === 'ko' ? (
                    <>
                      <strong className="text-lg">미션:</strong> 경북대학교 컴퓨터학부 웹사이트에 AI 챗봇을 통합하여, 학생들이 학부 관련 정보를 쉽고 빠르게 얻을 수 있도록 돕고, 학부 사무실의 반복적인 문의를 줄이며 신입생·유학생의 학부 생활 적응을 지원하는 것을 목표로 합니다.
                    </>
                  ) : (
                    <>
                      <strong className="text-lg">Mission:</strong> To develop an AI-powered chatbot integrated with the KNU Computer Science Department website, enabling students to easily access department-related information, reduce repetitive inquiries to the department office, and support freshmen and international students in adapting to academic life.
                    </>
                  )}
                </p>
                <p className="text-base leading-relaxed">
                  {lang === 'ko' ? (
                    <>
                      <strong className="text-lg">대상 사용자:</strong> 컴퓨터학부 재학생, 입학 예정자 및 지원자, 외국인 유학생, 웹사이트 사용에 익숙하지 않은 신입생, 학부 정보를 빠르게 확인하려는 교수·직원.
                    </>
                  ) : (
                    <>
                      <strong className="text-lg">Target Users:</strong> Current CS students; Prospective students and applicants; International students; Freshmen unfamiliar with the department webpage; Faculty and department staff looking for quick reference information.
                    </>
                  )}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-3">
                    <strong className="text-lg">{lang === 'ko' ? '주요 특징' : 'Features'}</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-base">
                    {lang === 'ko' ? (
                      <>
                        <li>컴퓨터학부 공지사항 실시간 조회</li>
                        <li>FAQ 기반 자동 응답 시스템</li>
                        <li>강의 정보·시간표 안내</li>
                        <li>학부 서류 및 가이드 문서 검색 기능</li>
                        <li>한국어/영어 다국어 지원</li>
                        <li>모바일·PC 모두 이용 가능한 직관적 UI</li>
                        <li>웹사이트 전체를 탐색할 필요 없이 즉각적인 정보 제공</li>
                      </>
                    ) : (
                      <>
                        <li>Real-time access to department announcements</li>
                        <li>FAQ-based response system for common questions</li>
                        <li>Course and timetable information retrieval</li>
                        <li>Document search (forms, guidelines, academic docs)</li>
                        <li>Multilingual support (Korean & English)</li>
                        <li>Simple, intuitive, mobile-friendly UI</li>
                        <li>Instant answers without navigating the full website</li>
                      </>
                    )}
                  </ul>
                </div>
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