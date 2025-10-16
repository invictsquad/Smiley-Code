import { useState } from 'react';
import { Language } from '../types';
import { t } from '../lib/i18n';
import LanguageSelector from './LanguageSelector';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/useAuth';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user?: any;
  onOpenAuth?: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, user, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const navLinks = [
    { href: '#my-projects', label: t('header.myProjects', language) },
    { href: '#community-showcase', label: t('header.community', language) },
  ];

  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b-2 border-slate-800 dark:border-dark-border">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        <a href="#" className="font-display text-4xl text-slate-800 dark:text-dark-text tracking-tighter">
          {t('landing.title', language)}
        </a>
        <nav className="hidden md:flex items-center gap-8 font-bold text-slate-700 dark:text-slate-200">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="hover:text-brand-teal transition-colors">{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
          
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg">
                <User size={16} />
                <span className="text-sm font-bold text-slate-800 dark:text-dark-text">
                  {user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 border-2 border-slate-800 rounded-lg transition-colors"
                title={t('auth.signOut', language)}
              >
                <LogOut size={16} />
                <span className="hidden lg:inline text-sm font-bold">{t('auth.signOut', language)}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:block font-display text-lg bg-brand-teal text-white border-2 border-slate-800 rounded-lg px-5 py-2 shadow-comic-sm transform transition-all duration-300 ease-out-back hover:bg-teal-600 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              {t('auth.signIn', language)}
            </button>
          )}
          
          <a
            href="#start-creating"
            className="hidden sm:block font-display text-lg bg-brand-coral text-slate-800 border-2 border-slate-800 rounded-lg px-5 py-2 shadow-comic-sm transform transition-all duration-300 ease-out-back hover:bg-brand-yellow hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            {t('header.startCreating', language)}
          </a>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2" aria-label="Open menu">
              <Menu size={28}/>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-brand-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm z-50"
        >
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 right-5 p-2" aria-label="Close menu">
            <X size={32}/>
          </button>
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, ease: "easeOut" }}
            className="h-full flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8 text-3xl font-display text-slate-800 dark:text-dark-text">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="hover:text-brand-teal transition-colors">{link.label}</a>
              ))}
                <a
                href="#start-creating"
                onClick={() => setIsMenuOpen(false)}
                className="sm:hidden mt-6 font-display text-2xl bg-brand-coral text-slate-800 border-2 border-slate-800 rounded-lg px-8 py-4 shadow-comic"
              >
                {t('header.startCreating', language)}
              </a>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Header;