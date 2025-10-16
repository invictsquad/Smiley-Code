import { useState } from 'react';
import { Message, Language } from '../types';
import { User, Bot, Clipboard, ThumbsUp, ThumbsDown, Check, FolderGit2, ListChecks, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnimatedText } from './hooks/useAnimatedText';
import { t } from '../lib/i18n';

interface ChatMessageProps {
  message: Message;
  language: Language;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, language }) => {
  const isUser = message.role === 'user';
  const animatedText = useAnimatedText(message.text, '');
  const displayText = isUser ? message.text : animatedText;

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (feedback === type) {
      setFeedback(null); // Allow toggling off
    } else {
      setFeedback(type);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-11 h-11 bg-brand-teal border-2 border-slate-800 dark:border-dark-border rounded-full flex items-center justify-center shadow-comic-sm">
          <Bot size={24} className="text-slate-800" />
        </div>
      )}
      
      <div className={`max-w-xl p-4 border-2 border-slate-800 dark:border-dark-border rounded-xl relative ${isUser ? 'bg-brand-green shadow-comic dark:shadow-comic-dark' : 'bg-white dark:bg-dark-surface shadow-comic dark:shadow-comic-dark'}`}>
        
        {message.images && message.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {message.images.map((image, index) => (
                <img key={index} src={`data:${image.mimeType};base64,${image.data}`} alt={`User upload ${index + 1}`} className="rounded-md border-2 border-slate-800 dark:border-dark-border w-full h-full object-cover" />
            ))}
          </div>
        )}

        {message.text && <div className="prose prose-lg dark:prose-invert prose-p:my-2 prose-headings:my-3 whitespace-pre-wrap">{displayText}</div>}
        
        {!isUser && message.plan && message.plan.length > 0 && (
          <div className={`mt-4 ${message.text ? 'pt-4 border-t border-slate-800/10 dark:border-dark-border' : ''}`}>
            <h4 className="font-display text-md mb-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <ListChecks size={18} className="text-brand-coral" />
              {t('chatMessage.developmentPlan', language)}
            </h4>
            <ul className="space-y-1.5 text-sm list-none pl-2">
              {message.plan.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isUser && message.fileChanges && message.fileChanges.length > 0 && (
          <div className={`mt-4 ${message.text || (message.plan && message.plan.length > 0) ? 'pt-4 border-t border-slate-800/10 dark:border-dark-border' : ''}`}>
            <h4 className="font-display text-md mb-2 text-slate-700 dark:text-slate-300">{t('chatMessage.filesUpdated', language)}</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto -mr-2 pr-2 text-sm">
              {message.fileChanges.map((path, index) => (
                <li key={index} className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-md border-2 border-slate-800/20 dark:border-dark-border">
                  <FolderGit2 size={16} className="text-brand-teal flex-shrink-0" />
                  <span className="font-mono truncate text-slate-600 dark:text-slate-300">{path}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isUser && (
          <div className="flex items-center gap-1 mt-2 -ml-1 pt-1 border-t border-slate-800/10 dark:border-dark-border">
            {message.text && (
              <motion.button
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors rounded-md"
                title={copied ? t('chatMessage.copied', language) : t('chatMessage.copy', language)}
              >
                {copied ? <Check size={16} className="text-brand-green" /> : <Clipboard size={16} />}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleFeedback('like')}
              className={`p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-md ${feedback === 'like' ? 'text-blue-500 dark:text-blue-400 bg-blue-500/10' : ''}`}
              title={t('chatMessage.goodResponse', language)}
            >
              <ThumbsUp size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleFeedback('dislike')}
              className={`p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors rounded-md ${feedback === 'dislike' ? 'text-red-500 dark:text-red-400 bg-red-500/10' : ''}`}
              title={t('chatMessage.badResponse', language)}
            >
              <ThumbsDown size={16} />
            </motion.button>
          </div>
        )}
        
        {isUser && message.text && (
            <div className="flex items-center justify-end -mb-2 -mr-2 pt-1 border-t border-slate-800/10 dark:border-dark-border">
                <motion.button
                  whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors rounded-md"
                  title={copied ? t('chatMessage.copied', language) : t('chatMessage.copy', language)}
                >
                {copied ? <Check size={16} className="text-brand-green" /> : <Clipboard size={16} />}
                </motion.button>
            </div>
        )}
      </div>

        {isUser && (
        <div className="flex-shrink-0 w-11 h-11 bg-brand-yellow border-2 border-slate-800 dark:border-dark-border rounded-full flex items-center justify-center shadow-comic-sm">
          <User size={24} className="text-slate-800" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;