import { Header } from "./components/Header";
import { AboutSection } from "./components/AboutSection";
import { TeamSection } from "./components/TeamSection";
import ChatBot from "./components/ChatBot";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <AboutSection />
        <TeamSection />
      </main>
      <ChatBot />
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>© 2025 KNU ChatBot Project - Kyungpook National University</p>
        </div>
      </footer>
    </div>
  );
}
