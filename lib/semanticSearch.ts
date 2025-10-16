import { Project, Language } from '../types';

export interface SearchResult {
  project: Project;
  score: number;
  matchedFields: string[];
}

export class SemanticSearchEngine {
  private static stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'o', 'a', 'e', 'de', 'do', 'da', 'em', 'para', 'com', 'por', 'um', 'uma', 'os', 'as',
    'el', 'la', 'y', 'o', 'en', 'con', 'por', 'para', 'de', 'del', 'un', 'una', 'los', 'las'
  ]);

  static searchProjects(projects: Project[], query: string, language: Language): SearchResult[] {
    if (!query.trim()) return projects.map(p => ({ project: p, score: 1, matchedFields: [] }));

    const normalizedQuery = this.normalizeText(query);
    const queryTerms = this.extractTerms(normalizedQuery);
    
    const results: SearchResult[] = [];

    for (const project of projects) {
      const score = this.calculateProjectScore(project, queryTerms);
      if (score > 0) {
        results.push({
          project,
          score,
          matchedFields: this.getMatchedFields(project, queryTerms)
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private static calculateProjectScore(project: Project, queryTerms: string[]): number {
    let score = 0;
    
    // Project name matching (highest weight)
    const nameTerms = this.extractTerms(this.normalizeText(project.name));
    score += this.calculateTermsMatch(nameTerms, queryTerms) * 10;
    
    // File content matching
    const allContent = Object.values(project.fileTree).join(' ');
    const contentTerms = this.extractTerms(this.normalizeText(allContent));
    score += this.calculateTermsMatch(contentTerms, queryTerms) * 3;
    
    // File names matching
    const fileNames = Object.keys(project.fileTree).join(' ');
    const fileNameTerms = this.extractTerms(this.normalizeText(fileNames));
    score += this.calculateTermsMatch(fileNameTerms, queryTerms) * 5;
    
    // Technology detection
    score += this.detectTechnologies(project, queryTerms) * 7;
    
    // Project type detection
    score += this.detectProjectType(project, queryTerms) * 6;
    
    return score;
  }

  private static calculateTermsMatch(terms: string[], queryTerms: string[]): number {
    if (terms.length === 0 || queryTerms.length === 0) return 0;
    
    let matches = 0;
    for (const queryTerm of queryTerms) {
      for (const term of terms) {
        if (term.includes(queryTerm) || queryTerm.includes(term)) {
          matches++;
        }
      }
    }
    
    return matches / Math.max(terms.length, queryTerms.length);
  }

  private static detectTechnologies(project: Project, queryTerms: string[]): number {
    const techKeywords = {
      'react': ['react', 'jsx', 'component', 'hook'],
      'vue': ['vue', 'vuejs', 'template'],
      'angular': ['angular', 'typescript', 'component'],
      'javascript': ['javascript', 'js', 'script', 'function'],
      'css': ['css', 'style', 'stylesheet', 'flexbox', 'grid'],
      'html': ['html', 'markup', 'semantic'],
      'bootstrap': ['bootstrap', 'bs', 'responsive'],
      'tailwind': ['tailwind', 'utility', 'classes'],
      'api': ['api', 'fetch', 'ajax', 'rest', 'graphql'],
      'database': ['database', 'db', 'sql', 'mongodb', 'firebase']
    };

    let score = 0;
    const allContent = Object.values(project.fileTree).join(' ').toLowerCase();
    
    for (const queryTerm of queryTerms) {
      for (const [tech, keywords] of Object.entries(techKeywords)) {
        if (keywords.includes(queryTerm.toLowerCase())) {
          // Check if the project actually uses this technology
          if (keywords.some(keyword => allContent.includes(keyword))) {
            score += 1;
          }
        }
      }
    }
    
    return score;
  }

  private static detectProjectType(project: Project, queryTerms: string[]): number {
    const projectTypes = {
      'portfolio': ['portfolio', 'resume', 'cv', 'personal', 'showcase'],
      'blog': ['blog', 'article', 'post', 'news', 'content'],
      'ecommerce': ['shop', 'store', 'cart', 'product', 'buy', 'sell'],
      'dashboard': ['dashboard', 'admin', 'analytics', 'chart', 'data'],
      'landing': ['landing', 'marketing', 'promo', 'campaign'],
      'app': ['app', 'application', 'tool', 'utility'],
      'game': ['game', 'play', 'score', 'level'],
      'social': ['social', 'chat', 'message', 'friend', 'follow']
    };

    let score = 0;
    const allContent = Object.values(project.fileTree).join(' ').toLowerCase();
    const projectName = project.name.toLowerCase();
    
    for (const queryTerm of queryTerms) {
      for (const [type, keywords] of Object.entries(projectTypes)) {
        if (keywords.includes(queryTerm.toLowerCase())) {
          // Check if the project matches this type
          if (keywords.some(keyword => 
            projectName.includes(keyword) || allContent.includes(keyword)
          )) {
            score += 1;
          }
        }
      }
    }
    
    return score;
  }

  private static getMatchedFields(project: Project, queryTerms: string[]): string[] {
    const matched: string[] = [];
    
    // Check project name
    const nameTerms = this.extractTerms(this.normalizeText(project.name));
    if (this.calculateTermsMatch(nameTerms, queryTerms) > 0) {
      matched.push('name');
    }
    
    // Check file content
    const allContent = Object.values(project.fileTree).join(' ');
    const contentTerms = this.extractTerms(this.normalizeText(allContent));
    if (this.calculateTermsMatch(contentTerms, queryTerms) > 0) {
      matched.push('content');
    }
    
    // Check file names
    const fileNames = Object.keys(project.fileTree).join(' ');
    const fileNameTerms = this.extractTerms(this.normalizeText(fileNames));
    if (this.calculateTermsMatch(fileNameTerms, queryTerms) > 0) {
      matched.push('files');
    }
    
    return matched;
  }

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static extractTerms(text: string): string[] {
    return text
      .split(' ')
      .filter(term => term.length > 2 && !this.stopWords.has(term))
      .filter(Boolean);
  }

  static generateSearchSuggestions(projects: Project[]): string[] {
    const suggestions = new Set<string>();
    
    // Add common project types
    suggestions.add('portfolio');
    suggestions.add('blog');
    suggestions.add('dashboard');
    suggestions.add('landing page');
    suggestions.add('e-commerce');
    suggestions.add('game');
    
    // Add technologies found in projects
    const allContent = projects
      .flatMap(p => Object.values(p.fileTree))
      .join(' ')
      .toLowerCase();
    
    const techTerms = ['react', 'vue', 'angular', 'javascript', 'css', 'html', 'api', 'responsive'];
    techTerms.forEach(term => {
      if (allContent.includes(term)) {
        suggestions.add(term);
      }
    });
    
    // Add project names (first 3 words)
    projects.forEach(project => {
      const words = project.name.split(' ').slice(0, 3);
      words.forEach(word => {
        if (word.length > 3) {
          suggestions.add(word.toLowerCase());
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 10);
  }
}