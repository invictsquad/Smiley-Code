import { Project, FileTree } from '../types';

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  keywords: string[];
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal websites and showcases',
    color: '#ff6b6b',
    icon: '👤',
    keywords: ['portfolio', 'personal', 'resume', 'cv', 'showcase', 'about', 'skills', 'experience']
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Corporate and business websites',
    color: '#4ecdc4',
    icon: '🏢',
    keywords: ['business', 'corporate', 'company', 'services', 'professional', 'agency']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online stores and shopping sites',
    color: '#ffd93d',
    icon: '🛒',
    keywords: ['shop', 'store', 'ecommerce', 'cart', 'product', 'buy', 'sell', 'payment']
  },
  {
    id: 'blog',
    name: 'Blog & Content',
    description: 'Blogs, news sites, and content platforms',
    color: '#a8e6cf',
    icon: '📝',
    keywords: ['blog', 'news', 'article', 'content', 'post', 'magazine', 'journal']
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Admin panels and data visualization',
    color: '#ff9ff3',
    icon: '📊',
    keywords: ['dashboard', 'admin', 'analytics', 'data', 'chart', 'graph', 'metrics']
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Marketing and promotional pages',
    color: '#54a0ff',
    icon: '🚀',
    keywords: ['landing', 'marketing', 'promo', 'campaign', 'conversion', 'lead']
  },
  {
    id: 'app',
    name: 'Web App',
    description: 'Interactive web applications',
    color: '#5f27cd',
    icon: '⚡',
    keywords: ['app', 'application', 'tool', 'utility', 'interactive', 'webapp']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Art, design, and creative showcases',
    color: '#ff6348',
    icon: '🎨',
    keywords: ['creative', 'art', 'design', 'gallery', 'photography', 'artist']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning platforms and educational content',
    color: '#2ed573',
    icon: '📚',
    keywords: ['education', 'learning', 'course', 'tutorial', 'school', 'university']
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous projects',
    color: '#747d8c',
    icon: '📁',
    keywords: []
  }
];

export class ProjectCategorizer {
  static categorizeProject(project: Project): string {
    const content = this.getProjectContent(project);
    const scores = new Map<string, number>();

    // Initialize scores
    projectCategories.forEach(category => {
      scores.set(category.id, 0);
    });

    // Score based on keywords
    projectCategories.forEach(category => {
      let score = 0;
      category.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = content.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      scores.set(category.id, score);
    });

    // Find the category with the highest score
    let bestCategory = 'other';
    let bestScore = 0;

    scores.forEach((score, categoryId) => {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = categoryId;
      }
    });

    return bestCategory;
  }

  static generateTags(project: Project): string[] {
    const content = this.getProjectContent(project);
    const tags = new Set<string>();

    // Technology tags
    const techPatterns = {
      'React': /react|jsx/gi,
      'Vue': /vue|vuejs/gi,
      'Angular': /angular/gi,
      'JavaScript': /javascript|js/gi,
      'TypeScript': /typescript|ts/gi,
      'CSS': /css|stylesheet/gi,
      'HTML': /html/gi,
      'Bootstrap': /bootstrap/gi,
      'Tailwind': /tailwind/gi,
      'API': /api|fetch|ajax/gi,
      'Responsive': /responsive|mobile/gi,
      'Animation': /animation|transition/gi,
      'Chart': /chart|graph/gi,
      'Form': /form|input/gi,
      'Gallery': /gallery|image/gi,
      'Navigation': /nav|menu/gi,
      'Search': /search/gi,
      'Login': /login|auth/gi,
      'Database': /database|db/gi,
      'PWA': /pwa|service.?worker/gi
    };

    Object.entries(techPatterns).forEach(([tag, pattern]) => {
      if (pattern.test(content)) {
        tags.add(tag);
      }
    });

    // Feature tags based on HTML elements
    const featurePatterns = {
      'Interactive': /<button|onclick|addEventListener/gi,
      'Media': /<img|<video|<audio/gi,
      'Tables': /<table|<tr|<td/gi,
      'Lists': /<ul|<ol|<li/gi,
      'Cards': /card|panel/gi,
      'Modal': /modal|popup/gi,
      'Slider': /slider|carousel/gi,
      'Tabs': /tab|accordion/gi
    };

    Object.entries(featurePatterns).forEach(([tag, pattern]) => {
      if (pattern.test(content)) {
        tags.add(tag);
      }
    });

    // Color scheme tags
    const colorPatterns = {
      'Dark Mode': /dark.?mode|dark.?theme/gi,
      'Colorful': /#[0-9a-f]{6}|rgb\(|hsl\(/gi,
      'Minimalist': /minimal|clean|simple/gi,
      'Modern': /modern|contemporary/gi
    };

    Object.entries(colorPatterns).forEach(([tag, pattern]) => {
      if (pattern.test(content)) {
        tags.add(tag);
      }
    });

    return Array.from(tags).slice(0, 8); // Limit to 8 tags
  }

  private static getProjectContent(project: Project): string {
    const allContent = [
      project.name,
      project.description || '',
      ...Object.keys(project.fileTree),
      ...Object.values(project.fileTree)
    ].join(' ');

    return allContent.toLowerCase();
  }

  static getCategoryById(categoryId: string): ProjectCategory | undefined {
    return projectCategories.find(cat => cat.id === categoryId);
  }

  static getProjectsByCategory(projects: Project[]): Map<string, Project[]> {
    const categorized = new Map<string, Project[]>();

    projectCategories.forEach(category => {
      categorized.set(category.id, []);
    });

    projects.forEach(project => {
      const category = project.category || this.categorizeProject(project);
      const categoryProjects = categorized.get(category) || [];
      categoryProjects.push(project);
      categorized.set(category, categoryProjects);
    });

    return categorized;
  }

  static updateProjectMetadata(project: Project): Project {
    return {
      ...project,
      category: project.category || this.categorizeProject(project),
      tags: project.tags || this.generateTags(project),
      description: project.description || this.generateDescription(project)
    };
  }

  private static generateDescription(project: Project): string {
    const category = this.getCategoryById(this.categorizeProject(project));
    const tags = this.generateTags(project);
    
    if (tags.length > 0) {
      return `A ${category?.name.toLowerCase() || 'web'} project featuring ${tags.slice(0, 3).join(', ')}.`;
    }
    
    return `A ${category?.name.toLowerCase() || 'web'} project built with modern web technologies.`;
  }
}