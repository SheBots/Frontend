import { GraduationCap } from "lucide-react";
import { useContext } from 'react';
import { LanguageContext } from '../App';

export function Header() {
  const { lang, setLang } = useContext(LanguageContext);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const headerOffset = 70; // Approximate header height
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C8102E] rounded-full flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-[#C8102E] tracking-tight text-2xl font-semibold">SheBots</h1>
              <p className="text-gray-600 text-xs mt-0.5">Kyungpook National University</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#about"
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="text-gray-700 hover:text-[#C8102E] transition-colors"
            >
              {lang === 'ko' ? '소개' : 'About'}
            </a>
            <a 
              href="#team"
              onClick={(e) => handleSmoothScroll(e, 'team')}
              className="text-gray-700 hover:text-[#C8102E] transition-colors"
            >
              {lang === 'ko' ? '팀' : 'Team'}
            </a>
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
              className="ml-2 px-3 py-1.5 rounded-full border text-sm font-medium text-gray-700 hover:bg-gray-100"
              aria-label="Toggle language"
            >
              {lang === 'ko' ? 'Eng' : 'Kor'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
