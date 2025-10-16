import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileTree, Message, Language } from '../types';
import { t } from './i18n';
import { conversationMemory } from './conversationMemory';
import { DebugSystem } from './debugSystem';

// Sistema de IA do Smiley Code - Implementação da Persona Completa
export class SmileyCodeAI {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!import.meta.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada');
    }
    this.genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: this.getSystemInstruction()
    });
  }

  private getSystemInstruction(): string {
    return `Você é Smiley Code, uma plataforma que cria e modifica aplicações web com inteligência artificial. Você ajuda os usuários conversando com eles e fazendo alterações em seu código em tempo real.

**REGRA FUNDAMENTAL: SEMPRE GERE CÓDIGO FUNCIONAL**
Quando o usuário pedir para criar uma aplicação, você DEVE SEMPRE gerar código HTML, CSS e JavaScript completo e funcional. Nunca responda apenas com explicações - SEMPRE inclua os arquivos de código.

**PERSONA E COMPORTAMENTO:**
- Você é amigável, prestativo e sempre busca fornecer explicações claras
- Você entende que os usuários podem ver uma pré-visualização ao vivo de sua aplicação
- SEMPRE gere código quando solicitado - nunca apenas explique
- Quando alterações de código são necessárias, você faz atualizações eficientes e eficazes

**ESTRUTURA OBRIGATÓRIA PARA NOVAS APLICAÇÕES:**
Toda nova aplicação DEVE ter no mínimo:
1. \`index.html\` - Página principal com estrutura HTML5 completa
2. \`styles/style.css\` - Estilos CSS responsivos e modernos  
3. \`scripts/main.js\` - JavaScript funcional com interatividade

**PRINCÍPIOS-CHAVE:**

1. **Qualidade e Organização do Código:**
   - Crie componentes pequenos e focados
   - Use HTML5 semântico
   - Implemente designs responsivos por padrão (mobile-first)
   - Escreva logs de console para depuração
   - Use CSS moderno (Grid, Flexbox, Custom Properties)

2. **Criação de Aplicações:**
   - SEMPRE crie arquivos funcionais completos
   - Use estrutura de pastas organizada (styles/, scripts/, assets/)
   - Implemente funcionalidades interativas com JavaScript
   - Garanta acessibilidade (ARIA, alt texts, semantic HTML)

3. **Design e UX:**
   - Design mobile-first responsivo
   - Cores e tipografia harmoniosas
   - Animações suaves e modernas
   - Interface intuitiva e amigável

4. **Funcionalidade:**
   - JavaScript funcional e interativo
   - Manipulação do DOM
   - Event listeners apropriados
   - Validação de formulários quando aplicável

**FORMATO DE RESPOSTA OBRIGATÓRIO:**
Você DEVE responder APENAS com um bloco de código markdown contendo um objeto JSON válido:

\`\`\`json
{
  "message": "Criei uma aplicação completa com [descrever funcionalidades]",
  "plan": [
    "Criar estrutura HTML5 semântica",
    "Implementar CSS responsivo moderno",
    "Adicionar JavaScript interativo"
  ],
  "file_changes": {
    "index.html": "<!DOCTYPE html>\\n<html lang=\\"pt-BR\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n  <title>Título da Aplicação</title>\\n  <link rel=\\"stylesheet\\" href=\\"styles/style.css\\">\\n</head>\\n<body>\\n  <!-- Conteúdo HTML completo -->\\n  <script src=\\"scripts/main.js\\"></script>\\n</body>\\n</html>",
    "styles/style.css": "/* CSS completo e responsivo */\\n* {\\n  margin: 0;\\n  padding: 0;\\n  box-sizing: border-box;\\n}\\n\\nbody {\\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\\n  line-height: 1.6;\\n}",
    "scripts/main.js": "// JavaScript funcional\\nconsole.log('Aplicação carregada com sucesso!');\\n\\n// Código JavaScript interativo aqui"
  }
}
\`\`\`

**REGRAS CRÍTICAS:**
- SEMPRE inclua file_changes com código completo
- NUNCA responda apenas com explicações - SEMPRE gere código
- Para DELETAR um arquivo, use \`null\` como valor
- Escape adequadamente caracteres especiais (\\n para quebras de linha, \\" para aspas)
- As três chaves são obrigatórias: message, plan, file_changes
- O HTML DEVE incluir meta viewport para responsividade
- O CSS DEVE ser mobile-first e responsivo
- O JavaScript DEVE ser funcional e interativo`;
  }

  async processMessage(
    message: Message,
    currentFileTree: FileTree,
    language: Language,
    isSeniorMode: boolean = false,
    isFirstMessage: boolean = false,
    projectId?: string
  ): Promise<{
    message: string;
    plan?: string[];
    fileChanges?: Record<string, string | null>;
    success: boolean;
  }> {
    try {
      // Obter contexto da conversa se projectId for fornecido
      let conversationContext = '';
      if (projectId) {
        conversationContext = conversationMemory.getContextForAI(projectId);
      }

      const systemInstruction = this.buildSystemInstruction(currentFileTree, language, isSeniorMode, conversationContext);
      
      // Debug: Log da requisição
      DebugSystem.logAIRequest(systemInstruction, currentFileTree);
      
      // Preparar partes da mensagem
      const parts: any[] = [{ text: message.text }];
      if (message.images) {
        message.images.forEach(img => {
          parts.push({ 
            inlineData: { 
              mimeType: img.mimeType, 
              data: img.data 
            } 
          });
        });
      }

      // Gerar resposta
      const result = await this.model.generateContent({
        contents: [{ parts }],
        generationConfig: {
          maxOutputTokens: 65536,
          temperature: 0.1,
        }
      });

      const response = await result.response;
      let text = response.text();

      if (!text) {
        throw new Error(t('editor.errorMissingMessage', language));
      }

      // Debug: Log da resposta
      DebugSystem.logAIResponse(text);

      // Processar resposta
      const result_parsed = this.parseAndValidateResponse(text, language, currentFileTree);
      
      // Salvar na memória se projectId for fornecido
      if (projectId && result_parsed.success) {
        conversationMemory.addMessage(projectId, message);
        
        if (result_parsed.fileChanges) {
          // Debug: Log das mudanças de arquivos
          DebugSystem.logFileChanges(result_parsed.fileChanges);
          
          // Aplicar mudanças ao fileTree e salvar na memória
          const newFileTree = { ...currentFileTree };
          Object.entries(result_parsed.fileChanges).forEach(([path, content]) => {
            if (content === null) {
              delete newFileTree[path];
            } else {
              newFileTree[path] = content;
            }
          });
          conversationMemory.updateFileTree(projectId, newFileTree);
          
          // Debug: Log da atualização da memória
          DebugSystem.logMemoryOperation('UPDATE_FILETREE', projectId, {
            totalFiles: Object.keys(newFileTree).length
          });
        }
        
        // Adicionar resposta da IA à memória
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          text: result_parsed.message
        };
        conversationMemory.addMessage(projectId, aiMessage);
      }

      return result_parsed;

    } catch (error) {
      DebugSystem.logError('PROCESS_MESSAGE', error, { projectId, messageText: message.text });
      return {
        message: t('editor.genericError', language),
        success: false
      };
    }
  }

  private buildSystemInstruction(
    currentFileTree: FileTree,
    language: Language,
    isSeniorMode: boolean,
    conversationContext: string = ''
  ): string {
    const baseInstruction = this.getSystemInstruction();
    
    const currentFiles = `**Arquivos Atuais do Projeto:**
${JSON.stringify(currentFileTree, null, 2)}`;

    const modeInstruction = isSeniorMode 
      ? '\n**MODO SÊNIOR ATIVO:** Forneça detalhes mais técnicos e respostas focadas em código. Seja conciso e direto.'
      : '';

    const languageInstruction = `\n**IDIOMA:** Responda em ${language === 'pt' ? 'português' : language === 'es' ? 'espanhol' : 'inglês'}.`;

    const contextInstruction = conversationContext 
      ? `\n${conversationContext}\n`
      : '';

    return `${baseInstruction}

${currentFiles}${contextInstruction}${modeInstruction}${languageInstruction}

**IMPORTANTE:** SEMPRE gere código funcional e completo. Quando o usuário pedir para criar uma aplicação, você DEVE criar todos os arquivos necessários (HTML, CSS, JS) com conteúdo completo e funcional.`;
  }

  private parseAndValidateResponse(
    aiResponseText: string,
    language: Language,
    currentFileTree: FileTree
  ): {
    message: string;
    plan?: string[];
    fileChanges?: Record<string, string | null>;
    success: boolean;
  } {
    // Extrair JSON da resposta
    const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      return { 
        message: aiResponseText, 
        success: true 
      };
    }

    try {
      let jsonString = jsonMatch[1].trim();

      // Tentar corrigir JSON truncado
      if (!jsonString.endsWith('}')) {
        console.warn('JSON parece estar truncado, tentando corrigir...');
        jsonString = this.attemptJSONRepair(jsonString);
      }

      const parsed = JSON.parse(jsonString);

      // Validar estrutura
      if (!parsed.message || typeof parsed.message !== 'string') {
        throw new Error('Mensagem inválida na resposta da IA');
      }

      const result = {
        message: parsed.message,
        plan: Array.isArray(parsed.plan) ? parsed.plan : undefined,
        fileChanges: undefined as Record<string, string | null> | undefined,
        success: true
      };

      // Processar mudanças de arquivos
      if (parsed.file_changes && typeof parsed.file_changes === 'object') {
        const fileChanges: Record<string, string | null> = {};
        let hasChanges = false;
        
        for (const [path, content] of Object.entries(parsed.file_changes)) {
          if (content === null || content === 'DELETE') {
            fileChanges[path] = null;
            hasChanges = true;
            console.log(`🗑️ Arquivo para deletar: ${path}`);
          } else if (typeof content === 'string' && content.trim().length > 0) {
            fileChanges[path] = content;
            hasChanges = true;
            console.log(`📄 Arquivo para criar/atualizar: ${path} (${content.length} chars)`);
          }
        }

        if (hasChanges) {
          result.fileChanges = fileChanges;
          console.log('✅ Mudanças de arquivos processadas:', Object.keys(fileChanges));
        } else {
          console.warn('⚠️ Nenhuma mudança de arquivo válida encontrada');
        }
      } else {
        console.warn('⚠️ Nenhum file_changes encontrado na resposta da IA');
      }

      return result;

    } catch (error) {
      console.error('Erro ao processar JSON da IA:', error);
      
      // Tentar extrair pelo menos a mensagem
      const messageMatch = jsonMatch[1].match(/"message"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
      const extractedMessage = messageMatch 
        ? messageMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
        : 'Erro ao processar resposta da IA. O JSON retornado está malformado.';

      return {
        message: extractedMessage,
        success: false
      };
    }
  }

  private attemptJSONRepair(jsonString: string): string {
    // Tentar encontrar a última estrutura de objeto completa
    let braceCount = 0;
    let lastValidIndex = -1;

    for (let i = 0; i < jsonString.length; i++) {
      if (jsonString[i] === '{') braceCount++;
      if (jsonString[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          lastValidIndex = i;
        }
      }
    }

    if (lastValidIndex > 0) {
      return jsonString.substring(0, lastValidIndex + 1);
    }

    return jsonString;
  }

  // Método para melhorar prompts automaticamente
  async enhancePrompt(originalPrompt: string, language: Language): Promise<string> {
    try {
      const enhancementInstruction = `Você é um especialista em UX/UI e desenvolvimento web. 
      Melhore o seguinte prompt para criar uma aplicação web mais detalhada e específica.
      
      Prompt original: "${originalPrompt}"
      
      Retorne apenas o prompt melhorado, sem explicações adicionais.
      Mantenha o idioma ${language === 'pt' ? 'português' : language === 'es' ? 'espanhol' : 'inglês'}.`;

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
      });

      const result = await model.generateContent(enhancementInstruction);
      const response = await result.response;
      const enhancedPrompt = response.text().trim();

      return enhancedPrompt || originalPrompt;
    } catch (error) {
      console.error('Erro ao melhorar prompt:', error);
      return originalPrompt;
    }
  }

  // Método para análise de código e sugestões de otimização
  async analyzeCode(
    fileTree: FileTree,
    language: Language
  ): Promise<{
    analysis: string;
    suggestions: string[];
    optimizations?: Record<string, string>;
  }> {
    try {
      const analysisInstruction = `Analise o seguinte código de uma aplicação web e forneça:
      1. Uma análise geral da qualidade do código
      2. Sugestões de melhorias
      3. Otimizações específicas (se necessário)

      Código da aplicação:
      ${JSON.stringify(fileTree, null, 2)}

      Responda em ${language === 'pt' ? 'português' : language === 'es' ? 'espanhol' : 'inglês'}.
      
      Formato de resposta:
      \`\`\`json
      {
        "analysis": "Análise detalhada do código",
        "suggestions": ["Sugestão 1", "Sugestão 2"],
        "optimizations": {
          "arquivo.js": "código otimizado"
        }
      }
      \`\`\``;

      const result = await this.model.generateContent(analysisInstruction);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        return {
          analysis: parsed.analysis || 'Análise não disponível',
          suggestions: parsed.suggestions || [],
          optimizations: parsed.optimizations
        };
      }

      return {
        analysis: text,
        suggestions: [],
      };

    } catch (error) {
      console.error('Erro ao analisar código:', error);
      return {
        analysis: 'Erro ao analisar o código',
        suggestions: [],
      };
    }
  }
}

// Instância singleton
export const smileyCodeAI = new SmileyCodeAI();