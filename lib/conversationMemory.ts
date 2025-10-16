import { Message, FileTree, Project } from '../types';

// Sistema de Memória de Conversação do Smiley Code
export interface ConversationContext {
  projectId: string;
  messages: Message[];
  currentFileTree: FileTree;
  projectGoals: string[];
  userPreferences: {
    style?: string;
    colors?: string[];
    framework?: string;
    features?: string[];
  };
  conversationSummary: string;
  lastActivity: Date;
}

export class ConversationMemory {
  private static instance: ConversationMemory;
  private contexts: Map<string, ConversationContext> = new Map();
  private readonly STORAGE_KEY = 'smiley-code-conversations';
  private readonly MAX_CONTEXTS = 10; // Máximo de conversas na memória

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): ConversationMemory {
    if (!ConversationMemory.instance) {
      ConversationMemory.instance = new ConversationMemory();
    }
    return ConversationMemory.instance;
  }

  // Inicializar contexto para um projeto
  initializeContext(project: Project, initialMessages: Message[] = []): ConversationContext {
    const context: ConversationContext = {
      projectId: project.id,
      messages: initialMessages,
      currentFileTree: { ...project.fileTree },
      projectGoals: [],
      userPreferences: {},
      conversationSummary: '',
      lastActivity: new Date()
    };

    this.contexts.set(project.id, context);
    this.saveToStorage();
    return context;
  }

  // Obter contexto de um projeto
  getContext(projectId: string): ConversationContext | null {
    const context = this.contexts.get(projectId);
    if (context) {
      context.lastActivity = new Date();
      return context;
    }
    return null;
  }

  // Adicionar mensagem ao contexto
  addMessage(projectId: string, message: Message): void {
    const context = this.contexts.get(projectId);
    if (context) {
      context.messages.push(message);
      context.lastActivity = new Date();
      
      // Manter apenas as últimas 50 mensagens para performance
      if (context.messages.length > 50) {
        context.messages = context.messages.slice(-50);
      }

      // Atualizar resumo da conversa se necessário
      if (context.messages.length % 10 === 0) {
        this.updateConversationSummary(projectId);
      }

      this.saveToStorage();
    }
  }

  // Atualizar FileTree no contexto
  updateFileTree(projectId: string, newFileTree: FileTree): void {
    const context = this.contexts.get(projectId);
    if (context) {
      context.currentFileTree = { ...newFileTree };
      context.lastActivity = new Date();
      this.saveToStorage();
    }
  }

  // Adicionar objetivo do projeto
  addProjectGoal(projectId: string, goal: string): void {
    const context = this.contexts.get(projectId);
    if (context && !context.projectGoals.includes(goal)) {
      context.projectGoals.push(goal);
      context.lastActivity = new Date();
      this.saveToStorage();
    }
  }

  // Atualizar preferências do usuário
  updateUserPreferences(projectId: string, preferences: Partial<ConversationContext['userPreferences']>): void {
    const context = this.contexts.get(projectId);
    if (context) {
      context.userPreferences = { ...context.userPreferences, ...preferences };
      context.lastActivity = new Date();
      this.saveToStorage();
    }
  }

  // Obter contexto completo para a IA
  getContextForAI(projectId: string): string {
    const context = this.contexts.get(projectId);
    if (!context) return '';

    const recentMessages = context.messages.slice(-10); // Últimas 10 mensagens
    const messagesText = recentMessages.map(msg => 
      `${msg.role}: ${msg.text}`
    ).join('\n');

    const goalsText = context.projectGoals.length > 0 
      ? `\nObjetivos do projeto: ${context.projectGoals.join(', ')}`
      : '';

    const preferencesText = Object.keys(context.userPreferences).length > 0
      ? `\nPreferências do usuário: ${JSON.stringify(context.userPreferences)}`
      : '';

    const summaryText = context.conversationSummary
      ? `\nResumo da conversa anterior: ${context.conversationSummary}`
      : '';

    return `**CONTEXTO DA CONVERSA:**
${summaryText}${goalsText}${preferencesText}

**MENSAGENS RECENTES:**
${messagesText}`;
  }

  // Atualizar resumo da conversa usando IA
  private async updateConversationSummary(projectId: string): Promise<void> {
    const context = this.contexts.get(projectId);
    if (!context) return;

    try {
      // Criar resumo das últimas mensagens
      const recentMessages = context.messages.slice(-20);
      const messagesText = recentMessages.map(msg => 
        `${msg.role}: ${msg.text}`
      ).join('\n');

      // Aqui você poderia usar a IA para criar um resumo mais inteligente
      // Por enquanto, vamos criar um resumo simples
      const summary = this.createSimpleSummary(recentMessages);
      context.conversationSummary = summary;
      
    } catch (error) {
      console.error('Erro ao atualizar resumo da conversa:', error);
    }
  }

  // Criar resumo simples das mensagens
  private createSimpleSummary(messages: Message[]): string {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const topics = new Set<string>();

    userMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      
      // Detectar tópicos principais
      if (text.includes('criar') || text.includes('build') || text.includes('fazer')) {
        topics.add('criação de funcionalidades');
      }
      if (text.includes('cor') || text.includes('design') || text.includes('estilo')) {
        topics.add('design e estilo');
      }
      if (text.includes('bug') || text.includes('erro') || text.includes('problema')) {
        topics.add('correção de problemas');
      }
      if (text.includes('melhorar') || text.includes('otimizar')) {
        topics.add('otimizações');
      }
    });

    return `Conversa focada em: ${Array.from(topics).join(', ')}`;
  }

  // Limpar contextos antigos
  cleanupOldContexts(): void {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (const [projectId, context] of this.contexts.entries()) {
      if (context.lastActivity < oneWeekAgo) {
        this.contexts.delete(projectId);
      }
    }

    // Manter apenas os contextos mais recentes se exceder o limite
    if (this.contexts.size > this.MAX_CONTEXTS) {
      const sortedContexts = Array.from(this.contexts.entries())
        .sort(([,a], [,b]) => b.lastActivity.getTime() - a.lastActivity.getTime());
      
      this.contexts.clear();
      sortedContexts.slice(0, this.MAX_CONTEXTS).forEach(([id, context]) => {
        this.contexts.set(id, context);
      });
    }

    this.saveToStorage();
  }

  // Salvar no localStorage
  private saveToStorage(): void {
    try {
      const data = Array.from(this.contexts.entries()).map(([id, context]) => [
        id,
        {
          ...context,
          lastActivity: context.lastActivity.toISOString()
        }
      ]);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar contextos no localStorage:', error);
    }
  }

  // Carregar do localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        parsed.forEach(([id, context]: [string, any]) => {
          this.contexts.set(id, {
            ...context,
            lastActivity: new Date(context.lastActivity)
          });
        });
      }
    } catch (error) {
      console.error('Erro ao carregar contextos do localStorage:', error);
    }
  }

  // Resetar contexto de um projeto
  resetContext(projectId: string): void {
    this.contexts.delete(projectId);
    this.saveToStorage();
  }

  // Obter estatísticas da memória
  getMemoryStats(): {
    totalContexts: number;
    totalMessages: number;
    oldestContext: Date | null;
    newestContext: Date | null;
  } {
    const contexts = Array.from(this.contexts.values());
    const totalMessages = contexts.reduce((sum, ctx) => sum + ctx.messages.length, 0);
    
    const dates = contexts.map(ctx => ctx.lastActivity);
    const oldestContext = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
    const newestContext = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

    return {
      totalContexts: this.contexts.size,
      totalMessages,
      oldestContext,
      newestContext
    };
  }
}

// Instância singleton
export const conversationMemory = ConversationMemory.getInstance();