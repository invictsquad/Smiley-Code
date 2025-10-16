import { useState } from 'react';
import { X, Lock, User, Eye } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { Language } from '../types';
import { t } from '../lib/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

type AuthMode = 'signin' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signin') {
      const result = await signIn(email, password);
      if (result.success) {
        onClose();
        resetForm();
      }
    } else {
      const result = await signUp(email, password, displayName);
      if (result.success) {
        onClose();
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-comic dark:shadow-comic-dark border-2 border-slate-800 dark:border-dark-border max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-800 dark:border-dark-border">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-text">
            {mode === 'signin' ? t('auth.signIn', language) : t('auth.signUp', language)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-dark-text mb-2">
                {t('auth.displayName', language)}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-800 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white dark:bg-dark-bg text-slate-800 dark:text-dark-text"
                  placeholder={t('auth.displayNamePlaceholder', language)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-dark-text mb-2">
              {t('auth.email', language)}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-800 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white dark:bg-dark-bg text-slate-800 dark:text-dark-text"
                placeholder={t('auth.emailPlaceholder', language)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-dark-text mb-2">
              {t('auth.password', language)}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 border-2 border-slate-800 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white dark:bg-dark-bg text-slate-800 dark:text-dark-text"
                placeholder={t('auth.passwordPlaceholder', language)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <span>👁️</span> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-coral hover:bg-brand-yellow text-slate-800 font-bold rounded-lg border-2 border-slate-800 shadow-comic transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? t('auth.loading', language)
              : mode === 'signin' 
                ? t('auth.signIn', language) 
                : t('auth.signUp', language)
            }
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline"
            >
              {mode === 'signin' 
                ? t('auth.needAccount', language)
                : t('auth.haveAccount', language)
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;