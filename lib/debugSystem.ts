// Sistema de Debug do Smiley Code
export class DebugSystem {
  private static isEnabled = import.meta.env.DEV || localStorage.getItem('smiley-debug') === 'true';

  static log(category: string, message: string, data?: any): void {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const prefix = `🐛 [${category}] ${timestamp}:`;
    
    if (data) {
      console.group(prefix, message);
      console.log(data);
      console.groupEnd();
    } else {
      console.log(prefix, message);
    }
  }

  static logAIRequest(prompt: string, fileTree: any): void {
    this.log('AI-REQUEST', 'Enviando prompt para IA', {
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 200) + '...',
      fileTreeSize: Object.keys(fileTree).length,
      files: Object.keys(fileTree)
    });
  }

  static logAIResponse(response: string, parsed?: any): void {
    this.log('AI-RESPONSE', 'Resposta da IA recebida', {
      responseLength: response.length,
      hasJson: response.includes('```json'),
      parsed: parsed ? {
        hasMessage: !!parsed.message,
        hasPlan: !!parsed.plan,
        hasFileChanges: !!parsed.file_changes,
        fileChangesCount: parsed.file_changes ? Object.keys(parsed.file_changes).length : 0
      } : null
    });
  }

  static logFileChanges(changes: Record<string, string | null>): void {
    this.log('FILE-CHANGES', 'Aplicando mudanças de arquivos', {
      totalChanges: Object.keys(changes).length,
      creates: Object.entries(changes).filter(([, content]) => content !== null).length,
      deletes: Object.entries(changes).filter(([, content]) => content === null).length,
      files: Object.keys(changes)
    });
  }

  static logWorkflowMode(mode: string, reason: string): void {
    this.log('WORKFLOW', `Modo selecionado: ${mode}`, { reason });
  }

  static logMemoryOperation(operation: string, projectId: string, data?: any): void {
    this.log('MEMORY', `${operation} para projeto ${projectId}`, data);
  }

  static logError(category: string, error: any, context?: any): void {
    this.log('ERROR', `Erro em ${category}`, {
      error: error.message || error,
      stack: error.stack,
      context
    });
  }

  static enable(): void {
    this.isEnabled = true;
    localStorage.setItem('smiley-debug', 'true');
    console.log('🐛 Debug do Smiley Code ATIVADO');
  }

  static disable(): void {
    this.isEnabled = false;
    localStorage.removeItem('smiley-debug');
    console.log('🐛 Debug do Smiley Code DESATIVADO');
  }

  static getStatus(): boolean {
    return this.isEnabled;
  }
}

// Adicionar ao window para acesso global em desenvolvimento
if (typeof window !== 'undefined') {
  (window as any).SmileyDebug = DebugSystem;
}