import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, ChevronDown, Cog, Globe, GitBranch } from 'lucide-react';
import { Language } from '../types';
import { t } from '../lib/i18n';

interface SettingsDropdownProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSaveVersion: (name: string) => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  projectName,
  onProjectNameChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onSaveVersion,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [versionName, setVersionName] = useState('');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleSaveVersionClick = () => {
    onSaveVersion(versionName);
    setVersionName('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-white dark:bg-dark-surface hover:bg-slate-100 dark:hover:bg-slate-600 active:shadow-none transition-all ease-out-back active:translate-y-0.5"
      >
        <Cog size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic dark:shadow-comic-dark z-10"
          >
            <div className="p-2">
              {/* Settings Section */}
              <div>
                <button
                  onClick={() => toggleSection('settings')}
                  className="w-full flex justify-between items-center p-2 font-display text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Settings size={18} />
                    <span>{t('settings.title', language)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${activeSection === 'settings' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeSection === 'settings' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3">
                        <label htmlFor="projectName" className="block text-sm font-bold mb-1">
                          {t('settings.projectName', language)}
                        </label>
                        <input
                          type="text"
                          id="projectName"
                          value={projectName}
                          onChange={e => onProjectNameChange(e.target.value)}
                          className="w-full p-2 text-base bg-slate-100 border-2 border-slate-800 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Version Control Section */}
              <div>
                <button
                  onClick={() => toggleSection('version')}
                  className="w-full flex justify-between items-center p-2 font-display text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <div className="flex items-center gap-2">
                    <GitBranch size={18} />
                    <span>{t('settings.versionControl', language)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${activeSection === 'version' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeSection === 'version' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-2">
                        <label htmlFor="versionName" className="block text-sm font-bold">
                            {t('settings.saveVersion', language)}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="versionName"
                            placeholder={t('settings.versionPlaceholder', language)}
                            value={versionName}
                            onChange={e => setVersionName(e.target.value)}
                            className="flex-grow p-2 text-sm bg-slate-100 border-2 border-slate-800 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:bg-slate-800 dark:text-white"
                          />
                          <button 
                            onClick={handleSaveVersionClick}
                            disabled={!versionName.trim()}
                            className="px-3 py-1 font-bold text-sm border-2 border-slate-800 dark:border-dark-border rounded-md shadow-comic-sm bg-brand-green hover:bg-brand-yellow active:shadow-none disabled:bg-slate-300 disabled:cursor-not-allowed transition-all ease-out-back active:translate-y-0.5"
                          >
                            {t('settings.save', language)}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Themes Section */}
              <div>
                <button
                  onClick={() => toggleSection('themes')}
                  className="w-full flex justify-between items-center p-2 font-display text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Palette size={18} />
                    <span>{t('settings.themes', language)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${activeSection === 'themes' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeSection === 'themes' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 flex gap-2">
                        <button onClick={() => onThemeChange('light')} className={`w-1/2 p-2 border-2 border-slate-800 rounded-md font-bold ${theme === 'light' ? 'bg-brand-yellow' : 'bg-slate-100'}`}>
                          {t('settings.light', language)}
                        </button>
                        <button onClick={() => onThemeChange('dark')} className={`w-1/2 p-2 border-2 text-white border-slate-800 dark:border-dark-border rounded-md font-bold ${theme === 'dark' ? 'bg-brand-coral' : 'bg-slate-700'}`}>
                          {t('settings.dark', language)}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                {/* Language Section */}
                <div>
                <button
                  onClick={() => toggleSection('language')}
                  className="w-full flex justify-between items-center p-2 font-display text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={18} />
                    <span>{t('settings.language', language)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${activeSection === 'language' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeSection === 'language' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 flex flex-col gap-2">
                          <button onClick={() => onLanguageChange('pt')} className={`p-2 border-2 border-slate-800 rounded-md font-bold ${language === 'pt' ? 'bg-brand-yellow' : 'bg-slate-100 dark:bg-slate-700'}`}>Português</button>
                          <button onClick={() => onLanguageChange('en')} className={`p-2 border-2 border-slate-800 rounded-md font-bold ${language === 'en' ? 'bg-brand-yellow' : 'bg-slate-100 dark:bg-slate-700'}`}>English</button>
                          <button onClick={() => onLanguageChange('es')} className={`p-2 border-2 border-slate-800 rounded-md font-bold ${language === 'es' ? 'bg-brand-yellow' : 'bg-slate-100 dark:bg-slate-700'}`}>Español</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsDropdown;