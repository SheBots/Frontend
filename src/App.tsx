import { Header } from "./components/Header";
import { AboutSection } from "./components/AboutSection";
import { TeamSection } from "./components/TeamSection";
import { useState, createContext } from 'react';
import ChatBot from "./components/ChatBot";

export const LanguageContext = createContext<{ lang: 'en' | 'ko'; setLang: (l: 'en' | 'ko') => void }>({ lang: 'en', setLang: () => {} });

export default function App() {
  const [lang, setLang] = useState<'en' | 'ko'>('en');
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <AboutSection />
          <TeamSection />
        </main>
        <ChatBot />
        <footer className="bg-white border-t border-gray-200 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
            <p>© 2025 KNU ChatBot Project - Kyungpook National University</p>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}
