import { useState, useRef, useEffect } from 'react';
import { Message, Version, FileTree, Language } from '../types';
import ChatMessage from './ChatMessage';
import { Send, BrainCircuit, Plus, LoaderCircle, History, Home, Github, Undo2, Redo2 } from 'lucide-react';
import SettingsDropdown from './SettingsDropdown';
import VersionHistoryModal from './VersionHistoryModal';
import ChatInputActions from './ChatInputActions';
import { t } from '../lib/i18n';
import { motion } from 'framer-motion';

interface ChatSidebarProps {
  messages: Message[];
  onSendMessage: (message: Message, isSeniorMode: boolean) => void;
  onNewChat: () => void;
  onSaveAndExit: () => void;
  isLoading: boolean;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  versionHistory: Version[];
  onVersionRestore: (fileTree: FileTree) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onInitiateGitHubDeploy: () => void;
  onSaveVersion: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenAnalysis: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  onSendMessage,
  onNewChat,
  onSaveAndExit,
  isLoading,
  projectName,
  onProjectNameChange,
  theme,
  onThemeChange,
  versionHistory,
  onVersionRestore,
  language,
  onLanguageChange,
  onInitiateGitHubDeploy,
  onSaveVersion,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenAnalysis,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSeniorMode, setIsSeniorMode] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const MAX_IMAGES = 10;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > MAX_IMAGES) {
        alert(t('editor.maxImagesError', language, { max: MAX_IMAGES.toString() }));
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
      // FIX: Add explicit type `File` to the `file` parameter to resolve type inference issues.
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({ data: base64String, mimeType: file.type });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // The button's disabled state (`canSubmit`) already prevents submissions
    // without text or while loading. This check is a final safeguard.
    if (!inputText.trim() || isLoading) {
      return;
    }

    let imagePayloads: { data: string; mimeType: string; }[] | undefined = undefined;
    if (imageFiles.length > 0) {
      imagePayloads = await Promise.all(imageFiles.map(file => fileToBase64(file)));
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      images: imagePayloads,
    };

    onSendMessage(newMessage, isSeniorMode);
    setInputText('');
    setImageFiles([]);
    setImagePreviews([]);
  };
  
  // A message can only be submitted if there is text and the AI is not currently processing.
  const canSubmit = inputText.trim().length > 0 && !isLoading;
  
  const IconButton: React.FC<{onClick: () => void, title: string, disabled?: boolean, children: React.ReactNode}> = ({onClick, title, disabled, children}) => (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        title={title}
        disabled={disabled}
        className="p-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-white dark:bg-dark-surface hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        {children}
      </motion.button>
  );

  return (
    <>
    <div className="w-full h-full flex flex-col bg-white dark:bg-dark-surface border-r-2 md:border-r-2 border-b-2 md:border-b-0 border-slate-800 dark:border-dark-border p-3 md:p-4 text-slate-800 dark:text-dark-text">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800 dark:border-dark-border mb-3 gap-2">
          <h1 className="font-display text-4xl text-slate-800 dark:text-dark-text truncate">
          {projectName}
        </h1>
        <div className="flex items-center flex-wrap justify-end gap-2">
            <IconButton onClick={onUndo} title={t('sidebar.undo', language)} disabled={!canUndo}>
                <Undo2 size={20} />
            </IconButton>
            <IconButton onClick={onRedo} title={t('sidebar.redo', language)} disabled={!canRedo}>
                <Redo2 size={20} />
            </IconButton>
            <IconButton onClick={onSaveAndExit} title={t('editor.saveAndExit', language)}>
              <Home size={20} />
            </IconButton>
            <IconButton onClick={onNewChat} title={t('sidebar.newChat', language)}>
              <Plus size={20} />
            </IconButton>
            <IconButton onClick={() => setIsVersionHistoryOpen(true)} title={t('sidebar.versionHistory', language)} disabled={versionHistory.length === 0}>
              <History size={20} />
            </IconButton>
            <IconButton onClick={onInitiateGitHubDeploy} title={t('sidebar.githubDeploy', language)}>
              <Github size={20} />
            </IconButton>
            <IconButton onClick={onOpenAnalysis} title="AI Analysis & Optimization">
              <BrainCircuit size={20} />
            </IconButton>
            <SettingsDropdown
              projectName={projectName}
              onProjectNameChange={onProjectNameChange}
              theme={theme}
              onThemeChange={onThemeChange}
              language={language}
              onLanguageChange={onLanguageChange}
              onSaveVersion={onSaveVersion}
            />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto mb-4 -mr-4 pr-4 space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} language={language} />
        ))}
        {isLoading && (
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 bg-brand-teal border-2 border-slate-800 rounded-full flex items-center justify-center">
                <LoaderCircle className="animate-spin" size={24} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 italic text-lg">{t('sidebar.thinking', language)}</p>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto">
        {imagePreviews.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-16 h-16">
                <img src={preview} alt="upload preview" className="w-full h-full object-cover rounded-md border-2 border-slate-800 dark:border-dark-border"/>
                <button onClick={() => removeImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center border-2 border-slate-800 dark:border-dark-text font-bold">X</button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t('sidebar.placeholder', language)}
            className="w-full p-4 pr-14 text-base bg-slate-100 dark:bg-slate-800 border-2 border-slate-800 dark:border-dark-border rounded-lg resize-none focus:outline-none focus:ring-4 ring-offset-2 ring-offset-white dark:ring-offset-dark-surface focus:ring-brand-yellow dark:placeholder-slate-400"
            rows={3}
          />
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} type="submit" className="absolute bottom-4 right-4 text-slate-500 dark:text-slate-400 hover:text-brand-coral disabled:text-slate-300 dark:disabled:text-slate-600 transition-colors" disabled={!canSubmit}>
            <Send size={24} />
          </motion.button>
        </form>
        <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
                <ChatInputActions onImageSelect={handleImageUpload} messages={messages} language={language} />
                
                <label className="flex items-center gap-2.5 text-sm font-bold cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isSeniorMode}
                      onChange={() => setIsSeniorMode(!isSeniorMode)}
                      className="hidden"
                    />
                    <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out border-2 border-slate-800 dark:border-dark-border ${isSeniorMode ? 'bg-brand-coral' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isSeniorMode ? 'translate-x-5' : ''}`}></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit size={18} className={`${isSeniorMode ? 'text-brand-coral' : 'text-slate-600 dark:text-slate-300'} transition-colors`}/>
                      <span className={`${isSeniorMode ? 'text-slate-800 dark:text-dark-text' : 'text-slate-600 dark:text-slate-300'} transition-colors`}>{t('sidebar.seniorMode', language)}</span>
                    </div>
                </label>
            </div>
        </div>
      </div>
    </div>
    {isVersionHistoryOpen && (
      <VersionHistoryModal 
        versions={versionHistory}
        onClose={() => setIsVersionHistoryOpen(false)}
        onRestore={fileTree => {
          onVersionRestore(fileTree);
          setIsVersionHistoryOpen(false);
        }}
        language={language}
      />
    )}
    </>
  );
};

export default ChatSidebar;