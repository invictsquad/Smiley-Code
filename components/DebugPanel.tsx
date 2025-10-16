import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle as Bug, X, RefreshCw, Trash2, Eye, Eye as EyeOff } from 'lucide-react';
import { DebugSystem } from '../lib/debugSystem';
import { conversationMemory } from '../lib/conversationMemory';

interface DebugPanelProps {
  projectId: string;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ projectId, onClose }) => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(DebugSystem.getStatus());
  const [memoryStats, setMemoryStats] = useState(conversationMemory.getMemoryStats());
  const [context, setContext] = useState(conversationMemory.getContext(projectId));

  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryStats(conversationMemory.getMemoryStats());
      setContext(conversationMemory.getContext(projectId));
    }, 1000);

    return () => clearInterval(interval);
  }, [projectId]);

  const toggleDebug = () => {
    if (isDebugEnabled) {
      DebugSystem.disable();
    } else {
      DebugSystem.enable();
    }
    setIsDebugEnabled(DebugSystem.getStatus());
  };

  const clearMemory = () => {
    if (confirm('Tem certeza que deseja limpar a memória de conversação?')) {
      conversationMemory.resetContext(projectId);
      setContext(null);
    }
  };

  const cleanupOldContexts = () => {
    conversationMemory.cleanupOldContexts();
    setMemoryStats(conversationMemory.getMemoryStats());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Bug className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Debug Panel</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sistema de debug e memória
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

        <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Debug Status */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Status do Debug
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-sm">Debug Console</span>
              <button
                onClick={toggleDebug}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isDebugEnabled
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                }`}
              >
                {isDebugEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {isDebugEnabled ? 'Ativo' : 'Inativo'}
              </button>
            </div>
            {isDebugEnabled && (
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                💡 Abra o Console do navegador (F12) para ver os logs detalhados
              </div>
            )}
          </div>

          {/* Memory Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Estatísticas da Memória
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {memoryStats.totalContexts}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Contextos Ativos
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {memoryStats.totalMessages}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total de Mensagens
                </div>
              </div>
            </div>
            <button
              onClick={cleanupOldContexts}
              className="w-full flex items-center justify-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar Contextos Antigos
            </button>
          </div>

          {/* Current Context */}
          <div className="space-y-3">
            <h3 className="font-semibold">Contexto Atual</h3>
            {context ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-sm font-medium mb-2">Projeto: {projectId}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Mensagens:</span>
                      <span className="ml-1 font-medium">{context.messages.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Arquivos:</span>
                      <span className="ml-1 font-medium">{Object.keys(context.currentFileTree).length}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Objetivos:</span>
                      <span className="ml-1 font-medium">{context.projectGoals.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Última atividade:</span>
                      <span className="ml-1 font-medium">
                        {new Date(context.lastActivity).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {context.projectGoals.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm font-medium mb-2">Objetivos do Projeto:</div>
                    <ul className="text-xs space-y-1">
                      {context.projectGoals.map((goal, index) => (
                        <li key={index} className="text-slate-600 dark:text-slate-400">
                          • {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {context.conversationSummary && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm font-medium mb-2">Resumo da Conversa:</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {context.conversationSummary}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearMemory}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Memória deste Projeto
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center text-sm text-slate-600 dark:text-slate-400">
                Nenhum contexto encontrado para este projeto
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold">Como usar o Debug</h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>• Ative o debug para ver logs detalhados no console</div>
              <div>• A memória armazena o contexto das conversas</div>
              <div>• Limpe a memória se a IA estiver confusa</div>
              <div>• Use o console do navegador (F12) para ver logs detalhados</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DebugPanel;