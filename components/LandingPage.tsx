import { useState, useRef } from 'react';
import { Bot, Code, Zap, Globe, LayoutTemplate, Edit, Eye, GitFork, Trash2, GitBranch, Share2, Lock, Unlock, ImageUp, Briefcase, NotebookText, Rocket, LayoutDashboard, Wand2, LoaderCircle, Search, X } from 'lucide-react';
import { Language, Project, FileTree } from '../types';
import { t } from '../lib/i18n';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SemanticSearchEngine, SearchResult } from '../lib/semanticSearch';
import { ProjectCategorizer, projectCategories } from '../lib/projectCategories';
import TrustedByCarousel from './TrustedByCarousel';

interface LandingPageProps {
  onStartCreating: (prompt: string, images?: { data: string; mimeType: string; }[]) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userProjects: Project[];
  onLoadProject: (project: Project) => void;
  onRemixProject: (project: Project) => void;
  onTogglePublic: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  user: any;
  onOpenAuth: () => void;
}

const mockCommunityProjects: Project[] = [
  { id: 'comm-1', name: 'Interactive Portfolio', fileTree: {'index.html': '<h1>Portfolio</h1>'}, isPublic: true, updatedAt: new Date('2024-07-20T10:00:00Z') },
  { id: 'comm-2', name: 'Weather App', fileTree: {'index.html': '<h1>Weather</h1>'}, isPublic: true, updatedAt: new Date('2024-07-19T14:30:00Z') },
  { id: 'comm-3', name: 'Recipe Finder', fileTree: {'index.html': '<h1>Recipes</h1>'}, isPublic: true, updatedAt: new Date('2024-07-18T09:15:00Z') },
];

const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Template Types and Data
interface Template {
  id: string;
  name: (lang: Language) => string;
  description: (lang: Language) => string;
  prompt: (lang: Language) => string;
  icon: React.ElementType;
}

const templates: Template[] = [
  { id: 'template-1', name: (l) => t('templates.portfolio.name', l), description: (l) => t('templates.portfolio.desc', l), prompt: (l) => t('templates.portfolio.prompt', l), icon: Briefcase },
  { id: 'template-2', name: (l) => t('templates.blog.name', l), description: (l) => t('templates.blog.desc', l), prompt: (l) => t('templates.blog.prompt', l), icon: NotebookText },
  { id: 'template-3', name: (l) => t('templates.product.name', l), description: (l) => t('templates.product.desc', l), prompt: (l) => t('templates.product.prompt', l), icon: Rocket },
  { id: 'template-4', name: (l) => t('templates.dashboard.name', l), description: (l) => t('templates.dashboard.desc', l), prompt: (l) => t('templates.dashboard.prompt', l), icon: LayoutDashboard },
];


const TemplateCard = ({ template, language, onSelect }: {
  template: Template;
  language: Language;
  onSelect: (prompt: string) => void;
}) => {
  const Icon = template.icon;
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-4 md:p-5 shadow-comic dark:shadow-comic-dark flex flex-col h-full transition-transform duration-300 ease-out-back hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1e293b] dark:hover:shadow-[6px_6px_0px_#e2e8f0]">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-brand-green p-2 border-2 border-slate-800 dark:border-dark-border rounded-lg">
            <Icon size={20} className="text-slate-800" />
          </div>
          <h3 className="font-display text-lg md:text-xl text-slate-800 dark:text-dark-text">{template.name(language)}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">{template.description(language)}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          console.log('🎯 Template clicked:', template.name(language));
          const prompt = template.prompt(language);
          console.log('🎯 Template prompt:', prompt);
          onSelect(prompt);
        }}
        className="w-full mt-auto text-sm font-bold flex items-center justify-center gap-2 bg-brand-yellow border-2 border-slate-800 rounded-lg px-3 py-2 shadow-comic-sm hover:bg-brand-yellow/80 transition-colors"
      >
        {t('templates.useButton', language)}
      </motion.button>
    </motion.div>
  );
};

const ProjectCard = ({ project, isUserProject, language, onEdit, onView, onRemix, onTogglePublic, onDelete }: {
  project: Project;
  isUserProject: boolean;
  language: Language;
  onEdit?: (project: Project) => void;
  onView?: (fileTree: FileTree) => void;
  onRemix?: (project: Project) => void;
  onTogglePublic?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-xl p-6 shadow-comic dark:shadow-comic-dark flex flex-col h-full transition-transform duration-300 ease-out-back hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1e293b] dark:hover:shadow-[8px_8px_0px_#e2e8f0]">
      <div className="flex-grow">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-brand-teal p-3 border-2 border-slate-800 dark:border-dark-border rounded-lg">
            <LayoutTemplate size={20} className="text-slate-800" />
          </div>
          <h3 className="font-display text-2xl text-slate-800 dark:text-dark-text truncate">{project.name}</h3>
        </div>
        
        {project.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-800/20 dark:border-dark-border"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-full border border-slate-800/20 dark:border-dark-border">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-6">
          <span>{t('projectCard.updated', language)} {timeAgo(project.updatedAt)}</span>
            {isUserProject && (
              <span className={`flex items-center gap-1 font-bold px-3 py-1 rounded-full text-xs ${project.isPublic ? 'bg-green-200 text-green-800' : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200'}`}>
                {project.isPublic ? <Unlock size={12} /> : <Lock size={12} />}
                {project.isPublic ? t('projectCard.public', language) : t('projectCard.private', language)}
              </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-auto">
        {isUserProject ? (
          <>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onEdit?.(project)} className="flex-1 text-md font-bold flex items-center justify-center gap-2 bg-brand-yellow border-2 border-slate-800 rounded-lg px-4 py-2.5 shadow-comic-sm hover:bg-brand-yellow/80 transition-colors"><Edit size={16}/> {t('projectCard.edit', language)}</motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onTogglePublic?.(project.id)} className="text-sm flex items-center justify-center gap-2 bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg p-2.5 shadow-comic-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title={project.isPublic ? t('projectCard.makePrivate', language) : t('projectCard.makePublic', language)}>
              {project.isPublic ? <Lock size={16}/> : <Unlock size={16} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete?.(project.id)} className="text-sm flex items-center justify-center gap-2 bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg p-2.5 shadow-comic-sm hover:bg-brand-coral hover:text-white dark:hover:bg-brand-coral transition-colors" title={t('projectCard.delete', language)}><Trash2 size={16}/></motion.button>
          </>
        ) : (
            <>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onView?.(project.fileTree)} className="flex-1 text-md font-bold flex items-center justify-center gap-2 bg-brand-teal text-slate-800 border-2 border-slate-800 rounded-lg px-4 py-2.5 shadow-comic-sm hover:bg-brand-teal/80 transition-colors"><Eye size={16}/> {t('projectCard.view', language)}</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onRemix?.(project)} className="flex-1 text-md font-bold flex items-center justify-center gap-2 bg-brand-yellow border-2 border-slate-800 rounded-lg px-4 py-2.5 shadow-comic-sm hover:bg-brand-yellow/80 transition-colors"><GitFork size={16}/> {t('projectCard.remix', language)}</motion.button>
            </>
        )}
      </div>
    </motion.div>
  );
};


const LandingPage = ({ onStartCreating, language, onLanguageChange, userProjects, onLoadProject, onRemixProject, onTogglePublic, onDeleteProject, user, onOpenAuth }: LandingPageProps) => {
  const [prompt, setPrompt] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 10;

  const handleViewProject = (fileTree: FileTree) => {
    const htmlContent = fileTree['index.html'] || '<html><body>Empty project</body></html>';
    // FIX: Use `window.Blob` to ensure the native browser Blob is used, avoiding potential type conflicts.
    const blob = new window.Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const triggerImageUpload = () => fileInputRef.current?.click();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > MAX_IMAGES) {
        alert(t('editor.maxImagesError', language, { max: MAX_IMAGES.toString() }));
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
      files.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const handleStart = async () => {
    console.log('🚀 handleStart called:', { 
      prompt: prompt.trim(), 
      imageFiles: imageFiles.length,
      hasApiKey: !!import.meta.env.GEMINI_API_KEY 
    });
    
    if (!prompt.trim() && imageFiles.length === 0) {
      alert(t('editor.promptWithImageError', language));
      return;
    }
    
    if (!import.meta.env.GEMINI_API_KEY) {
      alert(t('editor.apiKeyError', language));
      return;
    }
    
    let imagePayloads: { data: string; mimeType: string; }[] | undefined = undefined;
    if (imageFiles.length > 0) {
      imagePayloads = await Promise.all(imageFiles.map(file => fileToBase64(file)));
    }
    
    console.log('🚀 Calling onStartCreating with:', { prompt, imagePayloads: imagePayloads?.length });
    onStartCreating(prompt, imagePayloads);
  };
  
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || !import.meta.env.GEMINI_API_KEY) {
        if (!import.meta.env.GEMINI_API_KEY) {
            alert(t('editor.apiKeyError', language));
        }
        return;
    }

    setIsEnhancing(true);
    try {
        const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
        const systemInstruction = `You are a prompt engineering expert for an AI web developer. Your task is to take a user's rough idea and refine it into a clear, detailed, and actionable prompt. The enhanced prompt should be specific, mention key features, suggest a visual style, and provide a clear goal. IMPORTANT: Respond ONLY with the improved prompt text, without any additional explanation, formatting, or conversational text.`;
        
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 1024, // Enhanced prompts should be concise
                temperature: 0.4,
            }
        });
        const response = await result.response;
        const enhancedPrompt = response.text();
        if (enhancedPrompt) {
            setPrompt(enhancedPrompt.trim());
        }
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        alert("Sorry, I couldn't enhance the prompt right now. Please try again.");
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results = SemanticSearchEngine.searchProjects(userProjects, query, language);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const canStart = prompt.trim().length > 0 || imageFiles.length > 0;
  const displayedProjects = searchQuery ? searchResults.map(r => r.project) : userProjects;

  return (
    <div className="bg-brand-bg dark:bg-dark-bg bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_101%,#f8731e_0%,#f36ea5_30%,#418ce1_55%,#ffffff_75%)] dark:bg-[radial-gradient(125%_125%_at_50%_101%,#f8731e66_0%,#f36ea555_30%,#418ce144_55%,transparent_75%)]"></div>
      <Header language={language} onLanguageChange={onLanguageChange} user={user} onOpenAuth={onOpenAuth} />
      <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">
        <header className="text-center my-8 md:my-16">
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl text-white dark:text-dark-text tracking-tighter [text-shadow:4px_4px_0px_#1e293b] dark:[text-shadow:4px_4px_0px_rgba(0,0,0,0.3)]">
            {t('landing.title', language)}
          </h1>
          <p className="font-body text-lg md:text-xl mt-3 max-w-xl mx-auto text-white/90 dark:text-slate-300 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] px-4">{t('landing.subtitle', language)}</p>
        </header>
        
        <main>
          <div id="start-creating" className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-2 border-slate-800 dark:border-dark-border rounded-lg p-4 md:p-8 shadow-comic dark:shadow-comic-dark mb-8 md:mb-16 text-center scroll-mt-20">
            <h2 className="font-display text-2xl md:text-3xl mb-4 text-slate-800 dark:text-dark-text">{t('landing.mainTitle', language)}</h2>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={t('landing.promptPlaceholder', language)}
              className="w-full max-w-2xl mx-auto p-3 mb-3 text-sm md:text-base font-body bg-white/80 dark:bg-slate-800/80 border-2 border-slate-800 dark:border-dark-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:placeholder-slate-400 shadow-comic-inset"
              rows={3}
            />
            {imagePreviews.length > 0 && (
              <div className="mb-4 flex flex-wrap justify-center gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={preview} alt={`upload preview ${index+1}`} className="w-full h-full object-cover rounded-lg border-2 border-slate-800 dark:border-dark-border"/>
                    <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-brand-coral text-white rounded-full w-7 h-7 text-sm flex items-center justify-center border-2 border-slate-800 dark:border-dark-text font-bold">X</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={handleStart}
                    disabled={!canStart}
                    className="w-full sm:w-auto font-display text-lg md:text-xl bg-brand-coral text-slate-800 border-2 border-slate-800 rounded-lg px-6 py-3 shadow-comic hover:bg-brand-yellow transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {t('landing.startButton', language)}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={handleEnhancePrompt}
                    disabled={!prompt.trim() || isEnhancing}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold bg-white dark:bg-dark-surface text-slate-700 dark:text-dark-text border-2 border-slate-800 dark:border-dark-border rounded-lg px-4 py-2.5 shadow-comic-sm hover:bg-brand-teal/50 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {isEnhancing ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <Wand2 size={16} />
                    )}
                    <span>{isEnhancing ? t('landing.enhancing', language) : t('landing.enhancePrompt', language)}</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={triggerImageUpload}
                    className="flex items-center gap-2 text-md font-bold bg-white dark:bg-dark-surface text-slate-700 dark:text-dark-text border-2 border-slate-800 dark:border-dark-border rounded-lg px-5 py-3 shadow-comic-sm hover:bg-brand-green/50 transition-colors"
                >
                    <ImageUp size={20} />
                    <span>{t('landing.attachImage', language)}</span>
                </motion.button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple/>
            </div>
          </div>

          <section id="templates" className="mb-12 md:mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl md:text-4xl mb-6 flex items-center justify-center gap-3 text-white dark:text-dark-text [text-shadow:3px_3px_0px_#1e293b] dark:[text-shadow:2px_2px_0px_rgba(0,0,0,0.3)]"><LayoutTemplate size={32} className="md:w-10 md:h-10" /> {t('landing.templatesTitle', language)}</h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  language={language}
                  onSelect={(prompt) => onStartCreating(prompt, undefined)}
                />
              ))}
            </motion.div>
          </section>

          <section id="my-projects" className="mb-20 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="font-display text-5xl flex items-center gap-4 text-white dark:text-dark-text [text-shadow:3px_3px_0px_#1e293b] dark:[text-shadow:2px_2px_0px_rgba(0,0,0,0.3)]">
                <GitBranch/> {t('landing.myProjectsTitle', language)}
              </h2>
              
              {userProjects.length > 0 && (
                <div className="relative max-w-md w-full">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-10 py-3 bg-white/80 dark:bg-dark-surface/80 border-2 border-slate-800 dark:border-dark-border rounded-lg font-body text-slate-800 dark:text-dark-text placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-4 ring-offset-2 ring-offset-brand-bg dark:ring-offset-dark-bg focus:ring-brand-yellow shadow-comic-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  
                  {searchQuery && (
                    <div className="mt-2 text-sm text-white/80 dark:text-slate-300">
                      {searchResults.length > 0 
                        ? `Found ${searchResults.length} project${searchResults.length !== 1 ? 's' : ''}`
                        : 'No projects found'
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {userProjects.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchQuery}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{ 
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                  }} 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {displayedProjects.map(proj => (
                    <ProjectCard 
                      key={proj.id}
                      project={proj}
                      isUserProject={true}
                      language={language}
                      onEdit={onLoadProject}
                      onTogglePublic={onTogglePublic}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-16 px-6 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-2 border-dashed border-slate-800 dark:border-dark-border rounded-xl">
                <p className="text-slate-600 dark:text-slate-300 text-lg">{t('landing.noProjects', language)}</p>
              </div>
            )}
          </section>

          <section id="community-showcase" className="mb-20 scroll-mt-24">
            <h2 className="font-display text-5xl mb-8 flex items-center gap-4 text-white dark:text-dark-text [text-shadow:3px_3px_0px_#1e293b] dark:[text-shadow:2px_2px_0px_rgba(0,0,0,0.3)]"><Share2/> {t('landing.communityShowcaseTitle', language)}</h2>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockCommunityProjects.map(proj => (
                  <ProjectCard 
                    key={proj.id}
                    project={proj}
                    isUserProject={false}
                    language={language}
                    onView={handleViewProject}
                    onRemix={onRemixProject}
                  />
                ))}
              </motion.div>
          </section>
        </main>
      </div>
      
      {/* Carrossel de marcas que confiam */}
      <TrustedByCarousel language={language} />
    </div>
  );
};

export default LandingPage;