import { useState } from 'react';
import { Language, FileTree } from '../types';
import { t } from '../lib/i18n';
import { X, LoaderCircle, CheckCircle, ExternalLink, Github, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GitHubDeployModalProps {
  onClose: () => void;
  projectName: string;
  fileTree: FileTree | null;
  language: Language;
}

const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ onClose, projectName, fileTree, language }) => {
  const [deployState, setDeployState] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [pat, setPat] = useState('');
  const [repoName, setRepoName] = useState(projectName.toLowerCase().replace(/\s+/g, '-'));
  const [successUrl, setSuccessUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const generateReadme = (): FileTree => {
    const newFileTree = { ...(fileTree || {}) };
    if (!newFileTree['README.md']) {
      newFileTree['README.md'] = `# ${projectName}\n\nThis project was created with Friendly, the AI Web App Builder.\n\n## Running the Project\n\nSimply open the \`index.html\` file in your web browser to run the application.`;
    }
    return newFileTree;
  };

  const handleDeploy = () => {
    if (!pat.trim() || !repoName.trim()) {
      setErrorMessage(t('githubModal.errorMissingFields', language));
      setDeployState('error');
      return;
    }
    
    setDeployState('deploying');
    setErrorMessage('');
    
    // Simulate API call to GitHub
    setTimeout(() => {
      // Simulate common error
      if (pat === 'invalid-token') {
        setErrorMessage(t('githubModal.errorInvalidToken', language));
        setDeployState('error');
        return;
      }

      const allFiles = generateReadme();
      console.log('Deploying to GitHub with repo name:', repoName);
      console.log('Files to commit:', Object.keys(allFiles));

      // Simulate success
      const url = `https://github.com/your-username/${repoName}`;
      setSuccessUrl(url);
      setDeployState('success');
    }, 2500);
  };

  const resetAndClose = () => {
    if (deployState === 'deploying') return;
    onClose();
  };
  
  const resetAndRetry = () => {
    setDeployState('idle');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={resetAndClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-[95vw] max-w-lg bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-xl shadow-comic dark:shadow-comic-dark flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b-2 border-slate-800 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <Github size={28} className="text-brand-coral" />
            <h2 className="font-display text-3xl text-slate-800 dark:text-dark-text">{t('githubModal.title', language)}</h2>
          </div>
          <button onClick={resetAndClose} className="p-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-white dark:bg-dark-surface hover:bg-red-400 active:shadow-none transition-all ease-out-back active:translate-y-0.5">
            <X size={20} />
          </button>
        </header>
        
        <main className="p-6">
          <AnimatePresence mode="wait">
            {deployState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mb-4 text-center text-slate-600 dark:text-slate-300">{t('githubModal.description', language)}</p>
                <div className="mb-4 text-left">
                  <label htmlFor="github-pat" className="block text-sm font-bold mb-1 dark:text-gray-200">
                    {t('githubModal.tokenLabel', language)}
                  </label>
                  <input
                    type="password"
                    id="github-pat"
                    value={pat}
                    onChange={e => setPat(e.target.value)}
                    placeholder={t('githubModal.tokenPlaceholder', language)}
                    className="w-full p-2.5 text-base bg-slate-100 border-2 border-slate-800 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:bg-slate-800 dark:text-white"
                  />
                  <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-teal hover:underline">{t('githubModal.tokenLink', language)}</a>
                </div>
                <div className="mb-6 text-left">
                  <label htmlFor="repo-name" className="block text-sm font-bold mb-1 dark:text-gray-200">
                      {t('githubModal.repoLabel', language)}
                  </label>
                  <input
                    type="text"
                    id="repo-name"
                    value={repoName}
                    onChange={e => setRepoName(e.target.value)}
                    className="w-full p-2.5 text-base bg-slate-100 border-2 border-slate-800 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button onClick={handleDeploy} disabled={!fileTree} className="w-full font-display text-xl bg-brand-coral text-slate-800 border-2 border-slate-800 rounded-lg px-6 py-3 shadow-comic transform transition-all duration-300 ease-out-back hover:bg-brand-yellow hover:-translate-y-1 active:translate-y-0.5 active:shadow-none disabled:bg-slate-400 disabled:cursor-not-allowed">
                  {t('githubModal.deployButton', language)}
                </button>
              </motion.div>
            )}

            {deployState === 'deploying' && (
              <motion.div key="deploying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-48">
                <LoaderCircle className="animate-spin text-brand-teal" size={48} />
                <p className="mt-4 font-bold text-lg dark:text-gray-200">{t('githubModal.deploying', language)}</p>
              </motion.div>
            )}
            
            {deployState === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[12rem] text-center">
                <AlertTriangle className="text-red-500" size={48} />
                <h3 className="mt-4 font-display text-2xl dark:text-white">{t('githubModal.errorTitle', language)}</h3>
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                  <button onClick={resetAndRetry} className="mt-6 w-full font-display text-lg bg-slate-200 text-slate-800 border-2 border-slate-800 dark:border-dark-border rounded-lg px-6 py-2 shadow-comic-sm transform hover:bg-slate-300 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-slate-600">
                  Try Again
                </button>
              </motion.div>
            )}

            {deployState === 'success' && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[12rem] text-center">
                <CheckCircle className="text-brand-green" size={48} />
                <h3 className="mt-4 font-display text-2xl dark:text-white">{t('githubModal.successTitle', language)}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('githubModal.successMessage', language)}</p>
                <div className="mt-4 w-full flex items-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-800 dark:border-dark-border rounded-md p-2 gap-2">
                    <a href={successUrl} target="_blank" rel="noopener noreferrer" className="flex-grow bg-transparent outline-none font-mono text-sm dark:text-gray-200 truncate hover:underline">
                    {successUrl}
                    </a>
                  <a href={successUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 font-bold text-sm border-2 border-slate-800 dark:border-dark-border rounded-md shadow-comic-sm bg-brand-teal text-slate-800 hover:bg-brand-yellow active:shadow-none transition-all ease-out-back active:translate-y-0.5">
                    <ExternalLink size={14}/> {t('githubModal.viewRepo', language)}
                  </a>
                </div>
                  <button onClick={resetAndClose} className="mt-6 w-full font-display text-lg bg-slate-200 text-slate-800 border-2 border-slate-800 dark:border-dark-border rounded-lg px-6 py-2 shadow-comic-sm transform hover:bg-slate-300 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-slate-600">
                  {t('githubModal.done', language)}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default GitHubDeployModal;