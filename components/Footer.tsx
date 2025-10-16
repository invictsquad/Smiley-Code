
import { Github, Twitter, Heart } from 'lucide-react';
import { Language } from '../types';
import { t } from '../lib/i18n';

interface FooterProps {
  language: Language;
  onNavigate?: (page: 'privacy' | 'terms' | 'pricing') => void;
}

const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  return (
    <footer className="bg-white/50 dark:bg-dark-surface/50 border-t-2 border-slate-800 dark:border-dark-border p-8 mt-10">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand and Socials */}
          <div>
            <h3 className="font-display text-4xl text-slate-800 dark:text-dark-text tracking-tighter">
              {t('landing.title', language)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xs mx-auto md:mx-0">
              {t('landing.subtitle', language)}
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="https://github.com/luizmendonca/smiley-code" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-500 hover:text-brand-teal"><Github size={24} /></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-xl mb-3 text-slate-800 dark:text-white">{t('footer.navigation', language)}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-coral transition-colors">{t('footer.home', language)}</a></li>
              <li><a href="#my-projects" className="hover:text-brand-coral transition-colors">{t('footer.myProjects', language)}</a></li>
              <li><a href="#community-showcase" className="hover:text-brand-coral transition-colors">{t('footer.community', language)}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
              <h4 className="font-display text-xl mb-3 text-slate-800 dark:text-white">{t('footer.legal', language)}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => onNavigate?.('privacy')} 
                    className="hover:text-brand-coral transition-colors text-left"
                  >
                    {t('footer.privacy', language)}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('terms')} 
                    className="hover:text-brand-coral transition-colors text-left"
                  >
                    {t('footer.terms', language)}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('pricing')} 
                    className="hover:text-brand-coral transition-colors text-left"
                  >
                    Preços
                  </button>
                </li>
              </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-800/20 dark:border-dark-border text-center text-sm text-slate-600 dark:text-slate-400">
          <p className="flex items-center justify-center gap-1.5 mb-2">
            {t('footer.madeWith', language)} <Heart size={14} className="text-brand-coral" /> | {t('landing.footerRights', language)}
          </p>
          <p className="text-xs">
            Criado por <strong>Luiz Antônio De Lima Mendonça</strong> em Resende, RJ - Brasil
          </p>
          <p className="text-xs mt-1">
            🔗 Repositório oficial: <a href="https://github.com/luizmendonca/smiley-code" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">github.com/luizmendonca/smiley-code</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;