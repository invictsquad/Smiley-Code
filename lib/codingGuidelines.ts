import { FileTree } from '../types';

// Sistema de Diretrizes de Codificação do Smiley Code
export class CodingGuidelines {
  
  // 1. Qualidade e Organização do Código
  static validateCodeQuality(fileTree: FileTree): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    Object.entries(fileTree).forEach(([path, content]) => {
      // Verificar tamanho dos componentes
      if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
        const lines = content.split('\n').length;
        if (lines > 50) {
          issues.push(`${path}: Componente muito grande (${lines} linhas). Recomendado: < 50 linhas`);
          score -= 5;
        }
      }

      // Verificar uso de TypeScript
      if (path.endsWith('.js') && !path.includes('config')) {
        suggestions.push(`${path}: Considere usar TypeScript (.ts/.tsx) para melhor segurança de tipos`);
        score -= 2;
      }

      // Verificar logs de console para depuração
      if (!content.includes('console.log') && !content.includes('console.error')) {
        if (path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.tsx')) {
          suggestions.push(`${path}: Adicione logs de console para melhor depuração`);
        }
      }

      // Verificar responsividade
      if (path.endsWith('.css') || path.endsWith('.html')) {
        if (!content.includes('@media') && !content.includes('responsive')) {
          issues.push(`${path}: Falta implementação responsiva`);
          score -= 10;
        }
      }
    });

    return { score: Math.max(score, 0), issues, suggestions };
  }

  // 2. Estrutura de Projeto
  static validateProjectStructure(fileTree: FileTree): {
    isValid: boolean;
    missingFiles: string[];
    recommendations: string[];
  } {
    const requiredFiles = ['index.html'];
    const recommendedFiles = ['styles/style.css', 'scripts/main.js', 'README.md'];
    const missingFiles: string[] = [];
    const recommendations: string[] = [];

    // Verificar arquivos obrigatórios
    requiredFiles.forEach(file => {
      if (!fileTree[file]) {
        missingFiles.push(file);
      }
    });

    // Verificar arquivos recomendados
    recommendedFiles.forEach(file => {
      if (!fileTree[file]) {
        recommendations.push(`Considere adicionar: ${file}`);
      }
    });

    // Verificar organização por pastas
    const hasStyles = Object.keys(fileTree).some(path => path.startsWith('styles/'));
    const hasScripts = Object.keys(fileTree).some(path => path.startsWith('scripts/'));
    const hasAssets = Object.keys(fileTree).some(path => path.startsWith('assets/'));

    if (!hasStyles) recommendations.push('Organize CSS em pasta styles/');
    if (!hasScripts) recommendations.push('Organize JavaScript em pasta scripts/');
    if (!hasAssets) recommendations.push('Organize imagens e recursos em pasta assets/');

    return {
      isValid: missingFiles.length === 0,
      missingFiles,
      recommendations
    };
  }

  // 3. Gerenciamento de Estado
  static analyzeStateManagement(fileTree: FileTree): {
    patterns: string[];
    issues: string[];
    recommendations: string[];
  } {
    const patterns: string[] = [];
    const issues: string[] = [];
    const recommendations: string[] = [];

    Object.entries(fileTree).forEach(([path, content]) => {
      if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
        // Verificar uso de React Query
        if (content.includes('useQuery') || content.includes('useMutation')) {
          patterns.push(`${path}: Usa React Query para estado do servidor`);
        }

        // Verificar useState
        if (content.includes('useState')) {
          patterns.push(`${path}: Usa useState para estado local`);
        }

        // Verificar prop drilling
        const propMatches = content.match(/props\.\w+/g);
        if (propMatches && propMatches.length > 5) {
          issues.push(`${path}: Possível prop drilling (${propMatches.length} props)`);
          recommendations.push(`${path}: Considere usar Context API ou Redux`);
        }

        // Verificar useContext
        if (content.includes('useContext')) {
          patterns.push(`${path}: Usa Context API`);
        }
      }
    });

    return { patterns, issues, recommendations };
  }

  // 4. Tratamento de Erros
  static validateErrorHandling(fileTree: FileTree): {
    hasErrorBoundaries: boolean;
    hasToastNotifications: boolean;
    hasLogging: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let hasErrorBoundaries = false;
    let hasToastNotifications = false;
    let hasLogging = false;

    Object.entries(fileTree).forEach(([path, content]) => {
      // Verificar Error Boundaries
      if (content.includes('ErrorBoundary') || content.includes('componentDidCatch')) {
        hasErrorBoundaries = true;
      }

      // Verificar notificações toast
      if (content.includes('toast') || content.includes('notification')) {
        hasToastNotifications = true;
      }

      // Verificar logging
      if (content.includes('console.error') || content.includes('console.warn')) {
        hasLogging = true;
      }
    });

    if (!hasErrorBoundaries) {
      recommendations.push('Implemente Error Boundaries para capturar erros de componentes');
    }

    if (!hasToastNotifications) {
      recommendations.push('Adicione sistema de notificações toast para feedback ao usuário');
    }

    if (!hasLogging) {
      recommendations.push('Implemente logging adequado para depuração');
    }

    return {
      hasErrorBoundaries,
      hasToastNotifications,
      hasLogging,
      recommendations
    };
  }

  // 5. Desempenho
  static analyzePerformance(fileTree: FileTree): {
    score: number;
    optimizations: string[];
    criticalIssues: string[];
  } {
    const optimizations: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    Object.entries(fileTree).forEach(([path, content]) => {
      // Verificar lazy loading de imagens
      if (path.endsWith('.html')) {
        const imgTags = content.match(/<img[^>]*>/g) || [];
        const lazyImages = content.match(/loading=["']lazy["']/g) || [];
        
        if (imgTags.length > 0 && lazyImages.length === 0) {
          optimizations.push('Implemente lazy loading para imagens');
          score -= 10;
        }
      }

      // Verificar code splitting
      if (path.endsWith('.js') || path.endsWith('.ts')) {
        if (content.length > 10000 && !content.includes('import(')) {
          optimizations.push(`${path}: Arquivo grande, considere code splitting`);
          score -= 5;
        }
      }

      // Verificar otimização de CSS
      if (path.endsWith('.css')) {
        if (content.includes('!important')) {
          criticalIssues.push(`${path}: Evite usar !important`);
          score -= 3;
        }

        // Verificar CSS não utilizado (básico)
        const selectors = content.match(/\.[a-zA-Z][a-zA-Z0-9_-]*/g) || [];
        if (selectors.length > 50) {
          optimizations.push(`${path}: Muitos seletores, verifique CSS não utilizado`);
        }
      }

      // Verificar re-renderizações desnecessárias
      if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
        if (content.includes('useEffect') && !content.includes('useMemo') && !content.includes('useCallback')) {
          optimizations.push(`${path}: Considere usar useMemo/useCallback para otimizar re-renderizações`);
        }
      }
    });

    return {
      score: Math.max(score, 0),
      optimizations,
      criticalIssues
    };
  }

  // 6. Segurança
  static validateSecurity(fileTree: FileTree): {
    vulnerabilities: string[];
    recommendations: string[];
    securityScore: number;
  } {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    let securityScore = 100;

    Object.entries(fileTree).forEach(([path, content]) => {
      // Verificar validação de entrada
      if (content.includes('input') || content.includes('form')) {
        if (!content.includes('validate') && !content.includes('sanitize')) {
          vulnerabilities.push(`${path}: Falta validação de entrada do usuário`);
          securityScore -= 15;
        }
      }

      // Verificar innerHTML sem sanitização
      if (content.includes('innerHTML') && !content.includes('sanitize')) {
        vulnerabilities.push(`${path}: Uso de innerHTML sem sanitização`);
        securityScore -= 20;
      }

      // Verificar eval() (muito perigoso)
      if (content.includes('eval(')) {
        vulnerabilities.push(`${path}: Uso de eval() é extremamente perigoso`);
        securityScore -= 30;
      }

      // Verificar autenticação
      if (content.includes('password') || content.includes('login')) {
        if (!content.includes('hash') && !content.includes('bcrypt')) {
          recommendations.push(`${path}: Implemente hash seguro para senhas`);
        }
      }

      // Verificar HTTPS
      if (content.includes('http://') && !content.includes('localhost')) {
        vulnerabilities.push(`${path}: Use HTTPS em produção`);
        securityScore -= 10;
      }
    });

    // Recomendações gerais
    recommendations.push('Implemente Content Security Policy (CSP)');
    recommendations.push('Use HTTPS em todas as comunicações');
    recommendations.push('Valide e sanitize todas as entradas do usuário');
    recommendations.push('Implemente rate limiting para APIs');

    return {
      vulnerabilities,
      recommendations,
      securityScore: Math.max(securityScore, 0)
    };
  }

  // 7. Acessibilidade
  static validateAccessibility(fileTree: FileTree): {
    issues: string[];
    improvements: string[];
    a11yScore: number;
  } {
    const issues: string[] = [];
    const improvements: string[] = [];
    let a11yScore = 100;

    Object.entries(fileTree).forEach(([path, content]) => {
      if (path.endsWith('.html')) {
        // Verificar alt em imagens
        const imgWithoutAlt = content.match(/<img(?![^>]*alt=)[^>]*>/g);
        if (imgWithoutAlt) {
          issues.push(`${path}: ${imgWithoutAlt.length} imagens sem atributo alt`);
          a11yScore -= imgWithoutAlt.length * 5;
        }

        // Verificar hierarquia de headings
        const headings = content.match(/<h[1-6][^>]*>/g) || [];
        if (headings.length === 0) {
          issues.push(`${path}: Falta estrutura de headings`);
          a11yScore -= 10;
        }

        // Verificar labels em inputs
        const inputsWithoutLabel = content.match(/<input(?![^>]*aria-label)(?![^>]*id="[^"]*")(?![^>]*<label[^>]*for="[^"]*")[^>]*>/g);
        if (inputsWithoutLabel) {
          issues.push(`${path}: Inputs sem labels adequados`);
          a11yScore -= 10;
        }

        // Verificar contraste (básico)
        if (!content.includes('aria-') && content.includes('button')) {
          improvements.push(`${path}: Adicione atributos ARIA para melhor acessibilidade`);
        }

        // Verificar navegação por teclado
        if (content.includes('onclick') && !content.includes('onkeydown')) {
          improvements.push(`${path}: Implemente navegação por teclado`);
        }
      }
    });

    return {
      issues,
      improvements,
      a11yScore: Math.max(a11yScore, 0)
    };
  }

  // 8. SEO
  static validateSEO(fileTree: FileTree): {
    seoScore: number;
    missingElements: string[];
    recommendations: string[];
  } {
    const missingElements: string[] = [];
    const recommendations: string[] = [];
    let seoScore = 100;

    const htmlContent = fileTree['index.html'] || '';

    if (htmlContent) {
      // Verificar title
      if (!htmlContent.includes('<title>')) {
        missingElements.push('Tag <title>');
        seoScore -= 20;
      }

      // Verificar meta description
      if (!htmlContent.includes('name="description"')) {
        missingElements.push('Meta description');
        seoScore -= 15;
      }

      // Verificar meta viewport
      if (!htmlContent.includes('name="viewport"')) {
        missingElements.push('Meta viewport');
        seoScore -= 10;
      }

      // Verificar Open Graph
      if (!htmlContent.includes('property="og:')) {
        recommendations.push('Adicione tags Open Graph para redes sociais');
        seoScore -= 5;
      }

      // Verificar structured data
      if (!htmlContent.includes('application/ld+json')) {
        recommendations.push('Considere adicionar dados estruturados (JSON-LD)');
      }

      // Verificar headings
      if (!htmlContent.includes('<h1>')) {
        missingElements.push('Tag H1 principal');
        seoScore -= 15;
      }
    }

    return {
      seoScore: Math.max(seoScore, 0),
      missingElements,
      recommendations
    };
  }

  // Análise completa do projeto
  static analyzeProject(fileTree: FileTree): {
    overallScore: number;
    codeQuality: ReturnType<typeof CodingGuidelines.validateCodeQuality>;
    projectStructure: ReturnType<typeof CodingGuidelines.validateProjectStructure>;
    stateManagement: ReturnType<typeof CodingGuidelines.analyzeStateManagement>;
    errorHandling: ReturnType<typeof CodingGuidelines.validateErrorHandling>;
    performance: ReturnType<typeof CodingGuidelines.analyzePerformance>;
    security: ReturnType<typeof CodingGuidelines.validateSecurity>;
    accessibility: ReturnType<typeof CodingGuidelines.validateAccessibility>;
    seo: ReturnType<typeof CodingGuidelines.validateSEO>;
    summary: string[];
  } {
    const codeQuality = this.validateCodeQuality(fileTree);
    const projectStructure = this.validateProjectStructure(fileTree);
    const stateManagement = this.analyzeStateManagement(fileTree);
    const errorHandling = this.validateErrorHandling(fileTree);
    const performance = this.analyzePerformance(fileTree);
    const security = this.validateSecurity(fileTree);
    const accessibility = this.validateAccessibility(fileTree);
    const seo = this.validateSEO(fileTree);

    // Calcular pontuação geral
    const scores = [
      codeQuality.score,
      projectStructure.isValid ? 100 : 70,
      performance.score,
      security.securityScore,
      accessibility.a11yScore,
      seo.seoScore
    ];

    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Gerar resumo
    const summary: string[] = [];
    
    if (overallScore >= 90) {
      summary.push('🎉 Excelente! Seu projeto segue as melhores práticas');
    } else if (overallScore >= 70) {
      summary.push('👍 Bom projeto! Algumas melhorias podem ser feitas');
    } else if (overallScore >= 50) {
      summary.push('⚠️ Projeto precisa de melhorias importantes');
    } else {
      summary.push('🚨 Projeto requer atenção urgente em várias áreas');
    }

    // Adicionar principais problemas
    if (security.vulnerabilities.length > 0) {
      summary.push(`🔒 ${security.vulnerabilities.length} vulnerabilidades de segurança encontradas`);
    }

    if (accessibility.issues.length > 0) {
      summary.push(`♿ ${accessibility.issues.length} problemas de acessibilidade`);
    }

    if (performance.criticalIssues.length > 0) {
      summary.push(`⚡ ${performance.criticalIssues.length} problemas críticos de performance`);
    }

    return {
      overallScore,
      codeQuality,
      projectStructure,
      stateManagement,
      errorHandling,
      performance,
      security,
      accessibility,
      seo,
      summary
    };
  }

  // Gerar relatório de melhorias
  static generateImprovementPlan(analysis: ReturnType<typeof CodingGuidelines.analyzeProject>): {
    priority: 'high' | 'medium' | 'low';
    category: string;
    issue: string;
    solution: string;
  }[] {
    const improvements: {
      priority: 'high' | 'medium' | 'low';
      category: string;
      issue: string;
      solution: string;
    }[] = [];

    // Segurança (alta prioridade)
    analysis.security.vulnerabilities.forEach(vuln => {
      improvements.push({
        priority: 'high',
        category: 'Segurança',
        issue: vuln,
        solution: 'Implemente validação e sanitização adequadas'
      });
    });

    // Acessibilidade (alta prioridade)
    analysis.accessibility.issues.forEach(issue => {
      improvements.push({
        priority: 'high',
        category: 'Acessibilidade',
        issue: issue,
        solution: 'Adicione atributos alt, labels e estrutura semântica adequada'
      });
    });

    // Performance crítica (alta prioridade)
    analysis.performance.criticalIssues.forEach(issue => {
      improvements.push({
        priority: 'high',
        category: 'Performance',
        issue: issue,
        solution: 'Otimize código e evite práticas que prejudicam performance'
      });
    });

    // Qualidade de código (média prioridade)
    analysis.codeQuality.issues.forEach(issue => {
      improvements.push({
        priority: 'medium',
        category: 'Qualidade de Código',
        issue: issue,
        solution: 'Refatore componentes grandes e melhore organização'
      });
    });

    // SEO (média prioridade)
    analysis.seo.missingElements.forEach(element => {
      improvements.push({
        priority: 'medium',
        category: 'SEO',
        issue: `Falta: ${element}`,
        solution: 'Adicione meta tags e estrutura semântica adequada'
      });
    });

    // Performance geral (baixa prioridade)
    analysis.performance.optimizations.forEach(opt => {
      improvements.push({
        priority: 'low',
        category: 'Otimização',
        issue: opt,
        solution: 'Implemente otimizações de performance'
      });
    });

    return improvements.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
}

// Utilitários para aplicar diretrizes automaticamente
export class AutoCodeImprovement {
  
  // Aplicar melhorias automáticas básicas
  static applyBasicImprovements(fileTree: FileTree): {
    improvedFileTree: FileTree;
    changesApplied: string[];
  } {
    const improvedFileTree = { ...fileTree };
    const changesApplied: string[] = [];

    Object.entries(improvedFileTree).forEach(([path, content]) => {
      let improvedContent = content;

      // Adicionar meta viewport se não existir
      if (path === 'index.html' && !content.includes('name="viewport"')) {
        improvedContent = content.replace(
          '<head>',
          '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        );
        changesApplied.push('Adicionado meta viewport');
      }

      // Adicionar lazy loading para imagens
      if (path.endsWith('.html')) {
        const imgRegex = /<img([^>]*?)(?<!loading=["'][^"']*["'])>/g;
        improvedContent = improvedContent.replace(imgRegex, '<img$1 loading="lazy">');
        if (improvedContent !== content) {
          changesApplied.push('Adicionado lazy loading para imagens');
        }
      }

      // Adicionar console.log básico para arquivos JS/TS
      if ((path.endsWith('.js') || path.endsWith('.ts')) && !content.includes('console.')) {
        improvedContent = `console.log('${path} loaded');\n\n${content}`;
        changesApplied.push(`Adicionado logging básico em ${path}`);
      }

      improvedFileTree[path] = improvedContent;
    });

    return { improvedFileTree, changesApplied };
  }

  // Gerar arquivos de configuração recomendados
  static generateRecommendedFiles(): Record<string, string> {
    return {
      'README.md': `# Projeto Smiley Code

## Descrição
Aplicação web criada com Smiley Code AI.

## Como executar
1. Abra o arquivo \`index.html\` em um navegador
2. Ou use um servidor local como Live Server

## Estrutura do projeto
- \`index.html\` - Página principal
- \`styles/\` - Arquivos CSS
- \`scripts/\` - Arquivos JavaScript
- \`assets/\` - Imagens e recursos

## Tecnologias utilizadas
- HTML5
- CSS3
- JavaScript ES6+

## Contribuição
Criado com ❤️ usando Smiley Code
`,

      '.gitignore': `# Dependencies
node_modules/
npm-debug.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db
`,

      'package.json': `{
  "name": "smiley-code-project",
  "version": "1.0.0",
  "description": "Projeto criado com Smiley Code AI",
  "main": "index.html",
  "scripts": {
    "start": "live-server",
    "build": "echo 'Build completed'",
    "test": "echo 'No tests specified'"
  },
  "keywords": ["smiley-code", "web-app"],
  "author": "Smiley Code User",
  "license": "MIT",
  "devDependencies": {
    "live-server": "^1.2.2"
  }
}`
    };
  }
}