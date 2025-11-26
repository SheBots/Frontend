import { GraduationCap } from "lucide-react";

export function Header() {
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
              <h1 className="text-[#C8102E] tracking-tight text-lg font-semibold">KNU ChatBot Project</h1>
              <p className="text-gray-600 text-xs mt-0.5">Kyungpook National University</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#about" 
              className="text-gray-700 hover:text-[#C8102E] transition-colors"
            >
              About
            </a>
            <a 
              href="#team" 
              className="text-gray-700 hover:text-[#C8102E] transition-colors"
            >
              Team
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
