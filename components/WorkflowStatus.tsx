import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X as XCircle, RefreshCw as Clock, Bot as MessageSquare, Zap, Zap as Lightbulb } from 'lucide-react';
import { WorkflowMode } from '../lib/workflowSystem';
import { Language } from '../types';
import { t } from '../lib/i18n';

interface WorkflowStatusProps {
  mode: WorkflowMode;
  language: Language;
  showPlanApproval?: boolean;
  pendingPlan?: string[] | null;
  onApprovePlan?: () => void;
  onRejectPlan?: () => void;
  isDiscussionModeForced?: boolean;
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  mode,
  language,
  showPlanApproval,
  pendingPlan,
  onApprovePlan,
  onRejectPlan,
  isDiscussionModeForced = false
}) => {
  const getModeIcon = () => {
    switch (mode) {
      case 'PLAN':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'ACTION':
        return <Zap className="w-5 h-5 text-green-500" />;
      case 'DISCUSSION':
      default:
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
  };

  const getModeText = () => {
    if (isDiscussionModeForced) {
      return language === 'pt' ? 'Modo Discussão (Ativo)' : language === 'es' ? 'Modo Discusión (Activo)' : 'Discussion Mode (Active)';
    }
    
    switch (mode) {
      case 'PLAN':
        return language === 'pt' ? 'Modo Planejamento' : language === 'es' ? 'Modo Planificación' : 'Planning Mode';
      case 'ACTION':
        return language === 'pt' ? 'Modo Desenvolvimento' : language === 'es' ? 'Modo Desarrollo' : 'Development Mode';
      case 'DISCUSSION':
      default:
        return language === 'pt' ? 'Modo Discussão' : language === 'es' ? 'Modo Discusión' : 'Discussion Mode';
    }
  };

  const getModeDescription = () => {
    if (isDiscussionModeForced) {
      return language === 'pt'
        ? 'Modo discussão ativado - apenas conversando, sem gerar código'
        : language === 'es'
        ? 'Modo discusión activado - solo conversando, sin generar código'
        : 'Discussion mode active - only talking, not generating code';
    }
    
    switch (mode) {
      case 'PLAN':
        return language === 'pt' 
          ? 'Criando plano detalhado para sua solicitação'
          : language === 'es'
          ? 'Creando plan detallado para su solicitud'
          : 'Creating detailed plan for your request';
      case 'ACTION':
        return language === 'pt'
          ? 'Criando e modificando código da aplicação'
          : language === 'es'
          ? 'Creando y modificando código de la aplicación'
          : 'Creating and modifying application code';
      case 'DISCUSSION':
      default:
        return language === 'pt'
          ? 'Conversando e explicando conceitos'
          : language === 'es'
          ? 'Conversando y explicando conceptos'
          : 'Discussing and explaining concepts';
    }
  };

  return (
    <div className="border-b border-slate-200 dark:border-dark-border">
      {/* Status do Workflow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800"
      >
        {getModeIcon()}
        <div className="flex-1">
          <div className="font-medium text-sm text-slate-800 dark:text-slate-200">
            {getModeText()}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {getModeDescription()}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            mode === 'PLAN' ? 'bg-yellow-500' :
            mode === 'ACTION' ? 'bg-green-500' : 'bg-blue-500'
          }`} />
        </div>
      </motion.div>

      {/* Aprovação de Plano */}
      {showPlanApproval && pendingPlan && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-start gap-3 mb-3">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                {language === 'pt' ? 'Plano Criado - Aprovação Necessária' :
                 language === 'es' ? 'Plan Creado - Aprobación Necesaria' :
                 'Plan Created - Approval Required'}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                {language === 'pt' ? 'Revise o plano abaixo e aprove para continuar com a implementação:' :
                 language === 'es' ? 'Revise el plan a continuación y apruebe para continuar con la implementación:' :
                 'Review the plan below and approve to continue with implementation:'}
              </p>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3 border border-yellow-200 dark:border-yellow-800">
                <ul className="space-y-1 text-sm">
                  {pendingPlan.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        {index + 1}.
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApprovePlan}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {language === 'pt' ? 'Aprovar Plano' :
               language === 'es' ? 'Aprobar Plan' :
               'Approve Plan'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRejectPlan}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <XCircle className="w-4 h-4" />
              {language === 'pt' ? 'Rejeitar' :
               language === 'es' ? 'Rechazar' :
               'Reject'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkflowStatus;