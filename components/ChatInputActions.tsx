import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Language } from '../types';
import { ChevronDown, ImageUp, MessageSquare, PlusCircle } from 'lucide-react';
import { t } from '../lib/i18n';

interface ChatInputActionsProps {
  messages: Message[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: Language;
}

const ChatInputActions: React.FC<ChatInputActionsProps> = ({ messages, onImageSelect, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };
  
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-teal rounded-full transition-colors"
        aria-label={t('chatActions.moreActions', language)}
      >
        <PlusCircle size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic dark:shadow-comic-dark z-10"
          >
            <div className="p-2">
              {/* Attach Image Section */}
              <div>
                <button
                  onClick={() => toggleSection('image')}
                  className="w-full flex justify-between items-center p-2 font-display text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <div className="flex items-center gap-2">
                    <ImageUp size={18} />
                    <span>{t('chatActions.attachImage', language)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${activeSection === 'image' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeSection === 'image' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3">
                        <button 
                          onClick={triggerImageUpload}
                          className="w-full p-2 font-bold border-2 border-slate-800 dark:border-dark-border rounded-md shadow-comic-sm bg-brand-teal hover:bg-brand-yellow active:shadow-none transition-all ease-out-back active:translate-y-0.5"
                        >
                          {t('chatActions.selectFile', language)}
                        </button>
                        <input type="file" ref={fileInputRef} onChange={onImageSelect} className="hidden" accept="image/*" multiple/>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Message History Section */}
              <div>
                <button
                  onClick={() => toggleSection('history')}
                  className="w-full flex justify-between items-center p-2 font-display text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <span>{t('chatActions.messageHistory', language)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${activeSection === 'history' ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeSection === 'history' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 max-h-48 overflow-y-auto space-y-2 text-sm bg-slate-50 dark:bg-slate-900/50 rounded border-2 border-slate-800/20 dark:border-dark-border">
                        {messages.map(msg => (
                            <div key={msg.id}>
                              <span className={`font-bold ${msg.role === 'user' ? 'text-brand-coral' : 'text-brand-teal'}`}>{msg.role === 'user' ? t('chatMessage.you', language) : t('chatMessage.friendly', language)}:</span>
                              <p className="text-slate-700 dark:text-slate-300 truncate">{msg.text}</p>
                            </div>
                        ))}
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

export default ChatInputActions;