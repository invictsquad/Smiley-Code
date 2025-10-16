import { useState } from 'react';
import { Language, FileTree } from '../types';
import { t } from '../lib/i18n';
import { X, LoaderCircle, CheckCircle, Copy, Link, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VercelDeployService, DeploymentResult } from '../lib/vercelDeploy';

interface PublishModalProps {
  onClose: () => void;
  projectName: string;
  fileTree: FileTree;
  language: Language;
}

const PublishModal: React.FC<PublishModalProps> = ({ onClose, projectName, fileTree, language }) => {
  const [publishState, setPublishState] = useState<'idle' | 'publishing' | 'published' | 'error'>('idle');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');

  const handlePublish = async () => {
    setPublishState('publishing');
    setDeploymentError('');
    
    try {
      const result: DeploymentResult = await VercelDeployService.deployProject(
        projectName,
        fileTree
      );
      
      if (result.success && result.url) {
        setPublishedUrl(result.url);
        setPublishState('published');
      } else {
        setDeploymentError(result.error || 'Unknown deployment error');
        setPublishState('error');
      }
    } catch (error) {
      setDeploymentError(error instanceof Error ? error.message : 'Deployment failed');
      setPublishState('error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
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
            <Upload size={28} className="text-brand-coral" />
            <h2 className="font-display text-3xl text-slate-800 dark:text-dark-text">{t('publishModal.title', language)}</h2>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-white dark:bg-dark-surface hover:bg-red-400 active:shadow-none transition-all ease-out-back active:translate-y-0.5">
            <X size={20} />
          </button>
        </header>
        
        <main className="p-6">
          <AnimatePresence mode="wait">
            {publishState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mb-6 text-center text-slate-600 dark:text-slate-300">
                  Deploy your app to Vercel with a free subdomain. Your app will be live in seconds!
                </p>
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-slate-800/20 dark:border-dark-border">
                  <h4 className="font-bold text-slate-800 dark:text-dark-text mb-2">What happens next:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Your files will be deployed to Vercel</li>
                    <li>• You'll get a free .vercel.app subdomain</li>
                    <li>• Your app will be live and accessible worldwide</li>
                    <li>• HTTPS enabled by default</li>
                  </ul>
                </div>
                <button onClick={handlePublish} className="w-full font-display text-xl bg-brand-coral text-slate-800 border-2 border-slate-800 rounded-lg px-6 py-3 shadow-comic transform transition-all duration-300 ease-out-back hover:bg-brand-yellow hover:-translate-y-1 active:translate-y-0.5 active:shadow-none">
                  Deploy to Vercel
                </button>
              </motion.div>
            )}

            {publishState === 'publishing' && (
              <motion.div key="publishing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-48">
                <LoaderCircle className="animate-spin text-brand-teal" size={48} />
                <p className="mt-4 font-bold text-lg dark:text-gray-200">Deploying to Vercel...</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This usually takes 30-60 seconds</p>
              </motion.div>
            )}

            {publishState === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[12rem] text-center">
                <X className="text-red-500" size={48} />
                <h3 className="mt-4 font-display text-2xl text-red-600 dark:text-red-400">Deployment Failed</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{deploymentError}</p>
                <button 
                  onClick={() => setPublishState('idle')} 
                  className="mt-4 px-6 py-2 bg-brand-yellow border-2 border-slate-800 dark:border-dark-border rounded-lg font-bold text-slate-800 shadow-comic-sm hover:bg-brand-coral transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {publishState === 'published' && (
              <motion.div key="published" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[12rem] text-center">
                <CheckCircle className="text-brand-green" size={48} />
                <h3 className="mt-4 font-display text-2xl dark:text-white">🎉 App Deployed!</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Your app is now live on Vercel</p>
                <div className="mt-4 w-full flex items-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-800 dark:border-dark-border rounded-md p-2">
                  <Link size={16} className="mr-2 text-slate-500"/>
                  <input
                    type="text"
                    readOnly
                    value={publishedUrl}
                    className="flex-grow bg-transparent outline-none font-mono text-sm dark:text-gray-200"
                  />
                  <button onClick={handleCopy} className="ml-2 px-3 py-1 text-sm font-bold border-2 border-slate-800 dark:border-dark-border rounded-md shadow-comic-sm bg-brand-teal text-slate-800 hover:bg-brand-yellow active:shadow-none transition-all ease-out-back active:translate-y-0.5">
                    {copied ? <Copy size={14} /> : 'Copy'}
                  </button>
                </div>
                <div className="mt-4 flex gap-3 w-full">
                  <button 
                    onClick={() => window.open(publishedUrl, '_blank')} 
                    className="flex-1 px-4 py-2 bg-brand-coral border-2 border-slate-800 dark:border-dark-border rounded-lg font-bold text-slate-800 shadow-comic-sm hover:bg-brand-yellow transition-colors"
                  >
                    Visit Site
                  </button>
                  <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 border-2 border-slate-800 dark:border-dark-border rounded-lg font-bold shadow-comic-sm hover:bg-slate-300 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-slate-600 transition-colors">
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default PublishModal;