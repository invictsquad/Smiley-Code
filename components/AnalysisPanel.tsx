import { useState, useEffect } from 'react';
import { FileTree, Language } from '../types';
import { AnalysisResult, OptimizationSuggestion, AIAnalysisEngine } from '../lib/aiAnalysis';
import { 
  Zap, 
  Eye, 
  Search, 
  Palette, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Loader, 
  Wand2,
  X
} from 'lucide-react';
import { t } from '../lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisPanelProps {
  fileTree: FileTree;
  language: Language;
  onApplyOptimization: (fileChanges: Record<string, string>) => void;
  onClose: () => void;
}

const ScoreCircle = ({ score, label, color }: { score: number; label: string; color: string }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-800 dark:text-dark-text">{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2">{label}</span>
    </div>
  );
};

const OptimizationCard = ({ suggestion, onApply, language }: { 
  suggestion: OptimizationSuggestion; 
  onApply: () => void;
  language: Language;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const typeIcons = {
    performance: <Zap size={16} />,
    accessibility: <Eye size={16} />,
    seo: <Search size={16} />,
    design: <Palette size={16} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-lg p-4 shadow-comic-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-teal rounded-lg border-2 border-slate-800 dark:border-dark-border">
            {typeIcons[suggestion.type]}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-dark-text">{suggestion.title}</h4>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[suggestion.priority]}`}>
              {suggestion.priority.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{suggestion.description}</p>
      
      <AnimatePresence>
        {isExpanded && suggestion.code && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-3"
          >
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-xs overflow-x-auto border-2 border-slate-800/20 dark:border-dark-border">
              <code>{suggestion.code}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
      
      {suggestion.fileChanges && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onApply}
          className="w-full bg-brand-yellow border-2 border-slate-800 dark:border-dark-border rounded-lg px-4 py-2 font-bold text-slate-800 shadow-comic-sm hover:bg-brand-coral transition-colors"
        >
          <Wand2 size={16} className="inline mr-2" />
          Apply Optimization
        </motion.button>
      )}
    </motion.div>
  );
};

const AnalysisPanel = ({ 
  fileTree, 
  language, 
  onApplyOptimization, 
  onClose 
}: AnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingOptimizations, setIsGeneratingOptimizations] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'optimizations'>('overview');

  useEffect(() => {
    analyzeProject();
  }, [fileTree]);

  const analyzeProject = async () => {
    if (!import.meta.env.GEMINI_API_KEY) return;
    
    setIsAnalyzing(true);
    try {
      const engine = new AIAnalysisEngine(import.meta.env.GEMINI_API_KEY);
      const result = await engine.analyzeProject(fileTree, language);
      setAnalysis(result);
      
      // Generate optimizations
      setIsGeneratingOptimizations(true);
      const suggestions = await engine.generateOptimizations(fileTree, result, language);
      setOptimizations(suggestions);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingOptimizations(false);
    }
  };

  const handleApplyOptimization = (suggestion: OptimizationSuggestion) => {
    if (suggestion.fileChanges) {
      onApplyOptimization(suggestion.fileChanges);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#a8e6cf'; // brand-green
    if (score >= 60) return '#ffd93d'; // brand-yellow
    return '#ff6b6b'; // brand-coral
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-xl shadow-comic dark:shadow-comic-dark w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-800 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-teal rounded-lg border-2 border-slate-800 dark:border-dark-border">
              <TrendingUp size={24} className="text-slate-800" />
            </div>
            <h2 className="font-display text-2xl text-slate-800 dark:text-dark-text">
              Project Analysis
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-slate-800 dark:border-dark-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-brand-yellow text-slate-800 border-b-2 border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('optimizations')}
            className={`px-6 py-3 font-bold transition-colors ${
              activeTab === 'optimizations'
                ? 'bg-brand-yellow text-slate-800 border-b-2 border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Optimizations ({optimizations.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin mr-3" size={24} />
                  <span className="text-slate-600 dark:text-slate-300">Analyzing your project...</span>
                </div>
              ) : analysis ? (
                <div>
                  {/* Score Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <ScoreCircle 
                      score={analysis.performance.score} 
                      label="Performance" 
                      color={getScoreColor(analysis.performance.score)} 
                    />
                    <ScoreCircle 
                      score={analysis.accessibility.score} 
                      label="Accessibility" 
                      color={getScoreColor(analysis.accessibility.score)} 
                    />
                    <ScoreCircle 
                      score={analysis.seo.score} 
                      label="SEO" 
                      color={getScoreColor(analysis.seo.score)} 
                    />
                    <ScoreCircle 
                      score={analysis.design.score} 
                      label="Design" 
                      color={getScoreColor(analysis.design.score)} 
                    />
                  </div>

                  {/* Issues and Suggestions */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(analysis).map(([category, data]) => (
                      <div key={category} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border-2 border-slate-800/20 dark:border-dark-border">
                        <h3 className="font-bold text-lg mb-3 capitalize text-slate-800 dark:text-dark-text">
                          {category}
                        </h3>
                        
                        {data.issues && data.issues.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                              <AlertTriangle size={16} />
                              Issues
                            </h4>
                            <ul className="space-y-1">
                              {data.issues.map((issue, index) => (
                                <li key={index} className="text-sm text-slate-600 dark:text-slate-300">
                                  • {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {data.suggestions && data.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                              <CheckCircle size={16} />
                              Suggestions
                            </h4>
                            <ul className="space-y-1">
                              {data.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-slate-600 dark:text-slate-300">
                                  • {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-300">No analysis available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'optimizations' && (
            <div>
              {isGeneratingOptimizations ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin mr-3" size={24} />
                  <span className="text-slate-600 dark:text-slate-300">Generating optimizations...</span>
                </div>
              ) : optimizations.length > 0 ? (
                <div className="space-y-4">
                  {optimizations.map((suggestion, index) => (
                    <OptimizationCard
                      key={index}
                      suggestion={suggestion}
                      onApply={() => handleApplyOptimization(suggestion)}
                      language={language}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Great! No optimizations needed at the moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisPanel;