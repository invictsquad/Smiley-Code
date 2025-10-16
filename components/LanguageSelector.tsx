
import { Language } from '../types';
import { t } from '../lib/i18n';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={e => onLanguageChange(e.target.value as Language)}
        className="font-body font-bold appearance-none bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg py-2 pl-4 pr-10 shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
        aria-label={t('settings.language', language)}
      >
        <option value="pt">PT</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700 dark:text-slate-300">
        <Globe size={18} />
      </div>
    </div>
  );
};

export default LanguageSelector;