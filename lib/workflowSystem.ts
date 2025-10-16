import { Message, FileTree, Language } from '../types';
import { smileyCodeAI } from './smileyCodeAI';
import { XMLToolsSystem } from './xmlTools';
import { conversationMemory } from './conversationMemory';

// Sistema de Fluxo de Trabalho do Smiley Code
export type WorkflowMode = 'PLAN' | 'ACTION' | 'DISCUSSION';

export interface WorkflowState {
  mode: WorkflowMode;
  currentPlan?: string[];
  planApproved?: boolean;
  executionStep?: number;
  context?: any;
}

export class WorkflowSystem {
  private state: WorkflowState;

  constructor() {
    this.state = {
      mode: 'DISCUSSION'
    };
  }

  // Analisar mensagem do usuário e determinar o modo apropriado
  analyzeUserIntent(message: string): {
    mode: WorkflowMode;
    requiresPlan: boolean;
    isComplex: boolean;
    confidence: number;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Palavras-chave que indicam necessidade de planejamento
    const planKeywords = [
      'criar', 'build', 'desenvolver', 'fazer', 'construir',
      'implementar', 'adicionar funcionalidade', 'novo projeto',
      'aplicação', 'sistema', 'plataforma', 'website', 'app'
    ];

    // Palavras-chave que indicam ação direta
    const actionKeywords = [
      'corrigir', 'fix', 'alterar', 'mudar', 'atualizar',
      'modificar', 'ajustar', 'trocar cor', 'mover', 'deletar'
    ];

    // Palavras-chave que indicam discussão
    const discussionKeywords = [
      'explicar', 'como', 'por que', 'o que é', 'diferença',
      'ajuda', 'dúvida', 'pergunta', 'entender'
    ];

    let planScore = 0;
    let actionScore = 0;
    let discussionScore = 0;

    // Calcular pontuações
    planKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) planScore++;
    });

    actionKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) actionScore++;
    });

    discussionKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) discussionScore++;
    });

    // Determinar complexidade
    const complexityIndicators = [
      'múltiplas páginas', 'banco de dados', 'autenticação',
      'api', 'integração', 'dashboard', 'sistema completo',
      'plataforma', 'e-commerce', 'blog', 'portfolio'
    ];

    const isComplex = complexityIndicators.some(indicator => 
      lowerMessage.includes(indicator)
    ) || message.length > 200;

    // Determinar modo - PADRÃO É SEMPRE ACTION (desenvolvimento)
    let mode: WorkflowMode = 'ACTION';
    let confidence = 0;

    // Só usar DISCUSSION se houver palavras-chave específicas de discussão
    if (discussionScore > 0 && discussionScore > planScore && discussionScore > actionScore) {
      mode = 'DISCUSSION';
      confidence = discussionScore / (planScore + actionScore + discussionScore);
    } 
    // Usar PLAN apenas para projetos muito complexos
    else if (planScore > 2 && isComplex) {
      mode = 'PLAN';
      confidence = planScore / (planScore + actionScore + discussionScore);
    } 
    // PADRÃO: sempre ACTION para desenvolvimento
    else {
      mode = 'ACTION';
      confidence = Math.max(0.8, actionScore / Math.max(1, planScore + actionScore + discussionScore));
    }

    return {
      mode,
      requiresPlan: planScore > 0 && isComplex,
      isComplex,
      confidence: Math.max(confidence, 0.3) // Mínimo de 30% de confiança
    };
  }

  // Processar mensagem no MODO DE PLANO
  async processPlanMode(
    message: Message,
    fileTree: FileTree,
    language: Language,
    projectId?: string
  ): Promise<{
    response: string;
    plan: string[];
    needsApproval: boolean;
    nextMode: WorkflowMode;
  }> {
    console.log('🎯 Entrando no MODO DE PLANO');

    try {
      // Gerar plano detalhado
      const planPrompt = `MODO DE PLANO ATIVO: Crie um plano detalhado para: "${message.text}"

Analise a solicitação e crie um plano de desenvolvimento estruturado com:
1. Análise dos requisitos
2. Estrutura de arquivos necessária
3. Funcionalidades principais
4. Tecnologias a serem utilizadas
5. Passos de implementação

Responda APENAS com o plano, sem implementar código ainda.`;

      const planMessage: Message = {
        ...message,
        text: planPrompt
      };

      const result = await smileyCodeAI.processMessage(
        planMessage,
        fileTree,
        language,
        false,
        false,
        projectId
      );

      // Extrair plano da resposta
      const plan = result.plan || this.extractPlanFromMessage(result.message);

      this.state = {
        mode: 'PLAN',
        currentPlan: plan,
        planApproved: false
      };

      return {
        response: result.message,
        plan,
        needsApproval: true,
        nextMode: 'ACTION'
      };

    } catch (error) {
      console.error('Erro no MODO DE PLANO:', error);
      return {
        response: 'Erro ao criar plano. Vamos tentar uma abordagem mais simples.',
        plan: ['Implementar solução básica', 'Testar funcionalidade', 'Refinar conforme necessário'],
        needsApproval: false,
        nextMode: 'ACTION'
      };
    }
  }

  // Processar mensagem no MODO DE AÇÃO
  async processActionMode(
    message: Message,
    fileTree: FileTree,
    language: Language,
    isSeniorMode: boolean = false,
    projectId?: string
  ): Promise<{
    response: string;
    fileChanges?: Record<string, string | null>;
    actions: string[];
    success: boolean;
  }> {
    console.log('⚡ Entrando no MODO DE AÇÃO');

    try {
      // Se há um plano aprovado, incluir no contexto
      let contextualMessage = message.text;
      if (this.state.currentPlan && this.state.planApproved) {
        contextualMessage = `PLANO APROVADO:
${this.state.currentPlan.map((step, i) => `${i + 1}. ${step}`).join('\n')}

IMPLEMENTAR: ${message.text}`;
      }

      const actionMessage: Message = {
        ...message,
        text: contextualMessage
      };

      const result = await smileyCodeAI.processMessage(
        actionMessage,
        fileTree,
        language,
        isSeniorMode,
        false,
        projectId
      );

      // Processar mudanças de arquivos se houver
      let fileChanges: Record<string, string | null> = {};
      let actions: string[] = [];

      if (result.fileChanges && Object.keys(result.fileChanges).length > 0) {
        // Simular aplicação das mudanças
        Object.keys(result.fileChanges).forEach(filePath => {
          actions.push(`Arquivo modificado: ${filePath}`);
        });
        fileChanges = result.fileChanges;
      }

      // Verificar se há XML tools na resposta
      if (result.message.includes('<') && result.message.includes('>')) {
        const xmlResult = XMLToolsSystem.processXMLTools(result.message, fileTree);
        if (xmlResult.success) {
          actions.push(...xmlResult.actions);
        }
      }

      this.state.mode = 'DISCUSSION'; // Voltar ao modo discussão após ação

      return {
        response: result.message,
        fileChanges,
        actions,
        success: result.success
      };

    } catch (error) {
      console.error('Erro no MODO DE AÇÃO:', error);
      return {
        response: 'Erro ao executar ação. Por favor, tente novamente.',
        actions: ['Erro na execução'],
        success: false
      };
    }
  }

  // Processar mensagem no MODO DE DISCUSSÃO
  async processDiscussionMode(
    message: Message,
    fileTree: FileTree,
    language: Language,
    projectId?: string
  ): Promise<{
    response: string;
    suggestions?: string[];
    nextSteps?: string[];
  }> {
    console.log('💬 Entrando no MODO DE DISCUSSÃO');

    try {
      const discussionPrompt = `MODO DE DISCUSSÃO: O usuário quer conversar sobre: "${message.text}"

Forneça uma resposta explicativa, educativa e útil. Se apropriado, sugira próximos passos ou ações que o usuário pode tomar.

Não implemente código a menos que seja especificamente solicitado.`;

      const discussionMessage: Message = {
        ...message,
        text: discussionPrompt
      };

      const result = await smileyCodeAI.processMessage(
        discussionMessage,
        fileTree,
        language,
        false,
        false,
        projectId
      );

      // Extrair sugestões se houver
      const suggestions = this.extractSuggestionsFromMessage(result.message);
      const nextSteps = this.extractNextStepsFromMessage(result.message);

      return {
        response: result.message,
        suggestions,
        nextSteps
      };

    } catch (error) {
      console.error('Erro no MODO DE DISCUSSÃO:', error);
      return {
        response: 'Posso ajudar você com desenvolvimento web, criação de aplicações, explicações técnicas e muito mais. O que gostaria de saber?'
      };
    }
  }

  // Método principal para processar mensagens
  async processMessage(
    message: Message,
    fileTree: FileTree,
    language: Language,
    isSeniorMode: boolean = false,
    projectId?: string,
    forceDiscussionMode: boolean = false
  ): Promise<{
    response: string;
    mode: WorkflowMode;
    plan?: string[];
    fileChanges?: Record<string, string | null>;
    actions?: string[];
    suggestions?: string[];
    nextSteps?: string[];
    needsApproval?: boolean;
    success: boolean;
  }> {
    // Se modo discussão foi forçado, usar sempre DISCUSSION
    let intent;
    if (forceDiscussionMode) {
      intent = {
        mode: 'DISCUSSION' as WorkflowMode,
        requiresPlan: false,
        isComplex: false,
        confidence: 1.0
      };
      console.log('💬 Modo Discussão FORÇADO pelo usuário');
    } else {
      // Analisar intenção do usuário normalmente
      intent = this.analyzeUserIntent(message.text);
      console.log('🔍 Análise de intenção:', {
        mode: intent.mode,
        requiresPlan: intent.requiresPlan,
        isComplex: intent.isComplex,
        confidence: intent.confidence
      });
    }

    // Processar baseado no modo determinado
    switch (intent.mode) {
      case 'PLAN':
        if (intent.requiresPlan && intent.isComplex) {
          const planResult = await this.processPlanMode(message, fileTree, language, projectId);
          return {
            response: planResult.response,
            mode: 'PLAN',
            plan: planResult.plan,
            needsApproval: planResult.needsApproval,
            success: true
          };
        } else {
          // Se não é complexo, ir direto para ação
          const actionResult = await this.processActionMode(message, fileTree, language, isSeniorMode);
          return {
            response: actionResult.response,
            mode: 'ACTION',
            fileChanges: actionResult.fileChanges,
            actions: actionResult.actions,
            success: actionResult.success
          };
        }

      case 'ACTION':
        const actionResult = await this.processActionMode(message, fileTree, language, isSeniorMode, projectId);
        return {
          response: actionResult.response,
          mode: 'ACTION',
          fileChanges: actionResult.fileChanges,
          actions: actionResult.actions,
          success: actionResult.success
        };

      case 'DISCUSSION':
      default:
        const discussionResult = await this.processDiscussionMode(message, fileTree, language, projectId);
        return {
          response: discussionResult.response,
          mode: 'DISCUSSION',
          suggestions: discussionResult.suggestions,
          nextSteps: discussionResult.nextSteps,
          success: true
        };
    }
  }

  // Aprovar plano e prosseguir para execução
  approvePlan(): void {
    if (this.state.mode === 'PLAN' && this.state.currentPlan) {
      this.state.planApproved = true;
      this.state.mode = 'ACTION';
      console.log('✅ Plano aprovado, mudando para MODO DE AÇÃO');
    }
  }

  // Rejeitar plano e voltar ao planejamento
  rejectPlan(): void {
    if (this.state.mode === 'PLAN') {
      this.state.currentPlan = undefined;
      this.state.planApproved = false;
      console.log('❌ Plano rejeitado, voltando ao planejamento');
    }
  }

  // Obter estado atual do workflow
  getState(): WorkflowState {
    return { ...this.state };
  }

  // Resetar workflow
  reset(): void {
    this.state = {
      mode: 'DISCUSSION'
    };
  }

  // Utilitários privados
  private extractPlanFromMessage(message: string): string[] {
    const lines = message.split('\n');
    const planLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.match(/^\d+\./) || trimmed.startsWith('- ') || trimmed.startsWith('* ');
    });

    return planLines.length > 0 ? planLines.map(line => line.trim()) : [
      'Analisar requisitos',
      'Criar estrutura básica',
      'Implementar funcionalidades',
      'Testar e refinar'
    ];
  }

  private extractSuggestionsFromMessage(message: string): string[] {
    const suggestions: string[] = [];
    const lines = message.split('\n');
    
    let inSuggestionSection = false;
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      
      if (trimmed.includes('sugest') || trimmed.includes('recomend') || trimmed.includes('dica')) {
        inSuggestionSection = true;
        continue;
      }
      
      if (inSuggestionSection && (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.match(/^\d+\./))) {
        suggestions.push(line.trim());
      }
    }
    
    return suggestions;
  }

  private extractNextStepsFromMessage(message: string): string[] {
    const nextSteps: string[] = [];
    const lines = message.split('\n');
    
    let inNextStepsSection = false;
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      
      if (trimmed.includes('próxim') || trimmed.includes('next') || trimmed.includes('passo')) {
        inNextStepsSection = true;
        continue;
      }
      
      if (inNextStepsSection && (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.match(/^\d+\./))) {
        nextSteps.push(line.trim());
      }
    }
    
    return nextSteps;
  }
}

// Instância singleton
export const workflowSystem = new WorkflowSystem();