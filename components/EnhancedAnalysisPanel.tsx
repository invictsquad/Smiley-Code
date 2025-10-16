import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  AlertTriangle as Info, 
  Zap, 
  Lock as Shield, 
  Eye, 
  Search,
  Code,
  Bot as BarChart3,
  Code as FileText,
  Code as Settings,
  Zap as Lightbulb
} from 'lucide-react';
import { FileTree, Language } from '../types';
import { CodingGuidelines, AutoCodeImprovement } from '../lib/codingGuidelines';
import { t } from '../lib/i18n';

interface EnhancedAnalysisPanelProps {
  fileTree: FileTree;
  language: Language;
  onApplyOptimization: (fileChanges: Record<string, string>) => void;
  onClose: () => void;
  analysis?: any;
}

const EnhancedAnalysisPanel: React.FC<EnhancedAnalysisPanelProps> = ({
  fileTree,
  language,
  onApplyOptimization,
  onClose,
  analysis: initialAnalysis
}) => {
  const [analysis, setAnalysis] = useState<any>(initialAnalysis);
  const [activeTab, setActiveTab] = useState<'overview' | 'quality' | 'security' | 'performance' | 'accessibility' | 'improvements'>('overview');
  const [isLoading, setIsLoading] = useState(!initialAnalysis);
  const [selectedImprovements, setSelectedImprovements] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!initialAnalysis) {
      performAnalysis();
    }
  }, []);

  const performAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = CodingGuidelines.analyzeProject(fileTree);
      setAnalysis(result);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyBasicImprovements = () => {
    const { improvedFileTree, changesApplied } = AutoCodeImprovement.applyBasicImprovements(fileTree);
    
    // Converter para o formato esperado
    const fileChanges: Record<string, string> = {};
    Object.entries(improvedFileTree).forEach(([path, content]) => {
      if (content !== fileTree[path]) {
        fileChanges[path] = content;
      }
    });

    if (Object.keys(fileChanges).length > 0) {
      onApplyOptimization(fileChanges);
    }
  };

  const generateRecommendedFiles = () => {
    const recommendedFiles = AutoCodeImprovement.generateRecommendedFiles();
    onApplyOptimization(recommendedFiles);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'quality', label: 'Qualidade', icon: Code },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'accessibility', label: 'Acessibilidade', icon: Eye },
    { id: 'improvements', label: 'Melhorias', icon: Lightbulb }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-dark-surface rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Analisando Código</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Executando análise completa do projeto...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-teal rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Análise de Código IA</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Análise completa da qualidade e otimizações
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar com Tabs */}
          <div className="w-64 border-r border-slate-200 dark:border-dark-border p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-brand-teal text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pontuação Geral</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.overallScore)}`}>
                          <div className="text-2xl font-bold mb-1">
                            <span className={getScoreColor(analysis.overallScore)}>
                              {analysis.overallScore}
                            </span>
                            <span className="text-slate-500">/100</span>
                          </div>
                          <div className="text-sm font-medium">Pontuação Geral</div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.security.securityScore)}`}>
                          <div className="text-2xl font-bold mb-1">
                            <span className={getScoreColor(analysis.security.securityScore)}>
                              {analysis.security.securityScore}
                            </span>
                            <span className="text-slate-500">/100</span>
                          </div>
                          <div className="text-sm font-medium">Segurança</div>
                        </div>

                        <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.performance.score)}`}>
                          <div className="text-2xl font-bold mb-1">
                            <span className={getScoreColor(analysis.performance.score)}>
                              {analysis.performance.score}
                            </span>
                            <span className="text-slate-500">/100</span>
                          </div>
                          <div className="text-sm font-medium">Performance</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Resumo</h3>
                      <div className="space-y-2">
                        {analysis.summary.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'quality' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Qualidade do Código</h3>
                      <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.codeQuality.score)} mb-4`}>
                        <div className="text-2xl font-bold mb-1">
                          <span className={getScoreColor(analysis.codeQuality.score)}>
                            {analysis.codeQuality.score}
                          </span>
                          <span className="text-slate-500">/100</span>
                        </div>
                        <div className="text-sm font-medium">Pontuação de Qualidade</div>
                      </div>
                    </div>

                    {analysis.codeQuality.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          Problemas Encontrados
                        </h4>
                        <div className="space-y-2">
                          {analysis.codeQuality.issues.map((issue: string, index: number) => (
                            <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.codeQuality.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-500" />
                          Sugestões
                        </h4>
                        <div className="space-y-2">
                          {analysis.codeQuality.suggestions.map((suggestion: string, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Análise de Segurança</h3>
                      <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.security.securityScore)} mb-4`}>
                        <div className="text-2xl font-bold mb-1">
                          <span className={getScoreColor(analysis.security.securityScore)}>
                            {analysis.security.securityScore}
                          </span>
                          <span className="text-slate-500">/100</span>
                        </div>
                        <div className="text-sm font-medium">Pontuação de Segurança</div>
                      </div>
                    </div>

                    {analysis.security.vulnerabilities.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Vulnerabilidades Críticas
                        </h4>
                        <div className="space-y-2">
                          {analysis.security.vulnerabilities.map((vuln: string, index: number) => (
                            <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <span className="text-sm font-medium text-red-800 dark:text-red-200">{vuln}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        Recomendações de Segurança
                      </h4>
                      <div className="space-y-2">
                        {analysis.security.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Análise de Performance</h3>
                      <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.performance.score)} mb-4`}>
                        <div className="text-2xl font-bold mb-1">
                          <span className={getScoreColor(analysis.performance.score)}>
                            {analysis.performance.score}
                          </span>
                          <span className="text-slate-500">/100</span>
                        </div>
                        <div className="text-sm font-medium">Pontuação de Performance</div>
                      </div>
                    </div>

                    {analysis.performance.criticalIssues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Problemas Críticos
                        </h4>
                        <div className="space-y-2">
                          {analysis.performance.criticalIssues.map((issue: string, index: number) => (
                            <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Otimizações Recomendadas
                      </h4>
                      <div className="space-y-2">
                        {analysis.performance.optimizations.map((opt: string, index: number) => (
                          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <span className="text-sm">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'accessibility' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Análise de Acessibilidade</h3>
                      <div className={`p-4 rounded-lg ${getScoreBgColor(analysis.accessibility.a11yScore)} mb-4`}>
                        <div className="text-2xl font-bold mb-1">
                          <span className={getScoreColor(analysis.accessibility.a11yScore)}>
                            {analysis.accessibility.a11yScore}
                          </span>
                          <span className="text-slate-500">/100</span>
                        </div>
                        <div className="text-sm font-medium">Pontuação de Acessibilidade</div>
                      </div>
                    </div>

                    {analysis.accessibility.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Problemas de Acessibilidade
                        </h4>
                        <div className="space-y-2">
                          {analysis.accessibility.issues.map((issue: string, index: number) => (
                            <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        Melhorias Sugeridas
                      </h4>
                      <div className="space-y-2">
                        {analysis.accessibility.improvements.map((improvement: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <span className="text-sm">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'improvements' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Melhorias Automáticas</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Aplique melhorias automáticas para otimizar seu código instantaneamente.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold mb-1">Melhorias Básicas</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Adiciona meta viewport, lazy loading para imagens, e logging básico
                            </p>
                          </div>
                          <button
                            onClick={applyBasicImprovements}
                            className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm"
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>

                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold mb-1">Arquivos Recomendados</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Adiciona README.md, .gitignore, e package.json
                            </p>
                          </div>
                          <button
                            onClick={generateRecommendedFiles}
                            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors text-sm"
                          >
                            Gerar
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Plano de Melhorias Prioritárias</h4>
                      <div className="space-y-3">
                        {CodingGuidelines.generateImprovementPlan(analysis).slice(0, 10).map((improvement, index) => (
                          <div key={index} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                improvement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                                improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                              }`}>
                                {improvement.priority === 'high' ? 'Alta' : improvement.priority === 'medium' ? 'Média' : 'Baixa'}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">{improvement.category}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{improvement.issue}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-500">{improvement.solution}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedAnalysisPanel;