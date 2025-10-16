// Biblioteca de Ícones Integrada
export interface IconSet {
  id: string;
  name: string;
  description: string;
  icons: IconDefinition[];
  cdnUrl?: string;
}

export interface IconDefinition {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  usage: string;
}

export class IconLibraryManager {
  private static iconSets: Map<string, IconSet> = new Map();

  // Lucide Icons (já integrado)
  static lucideIcons: IconDefinition[] = [
    {
      name: 'home',
      category: 'navigation',
      tags: ['house', 'inicio', 'casa'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
      usage: '<Home size={24} />'
    },
    {
      name: 'user',
      category: 'people',
      tags: ['person', 'profile', 'usuario', 'perfil'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      usage: '<User size={24} />'
    },
    {
      name: 'mail',
      category: 'communication',
      tags: ['email', 'message', 'correio'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
      usage: '<Mail size={24} />'
    },
    {
      name: 'phone',
      category: 'communication',
      tags: ['telephone', 'call', 'telefone'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      usage: '<Phone size={24} />'
    },
    {
      name: 'shopping-cart',
      category: 'commerce',
      tags: ['cart', 'buy', 'carrinho', 'comprar'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6"/></svg>',
      usage: '<ShoppingCart size={24} />'
    }
  ];

  // Heroicons
  static heroIcons: IconDefinition[] = [
    {
      name: 'academic-cap',
      category: 'education',
      tags: ['education', 'graduation', 'educacao'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>',
      usage: 'className="w-6 h-6"'
    },
    {
      name: 'heart',
      category: 'social',
      tags: ['love', 'like', 'favorite', 'amor', 'curtir'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>',
      usage: 'className="w-6 h-6"'
    }
  ];

  static initialize() {
    this.iconSets.set('lucide', {
      id: 'lucide',
      name: 'Lucide Icons',
      description: 'Beautiful & consistent icon toolkit',
      icons: this.lucideIcons,
      cdnUrl: 'https://unpkg.com/lucide@latest/dist/umd/lucide.js'
    });

    this.iconSets.set('heroicons', {
      id: 'heroicons',
      name: 'Heroicons',
      description: 'Beautiful hand-crafted SVG icons by Tailwind CSS',
      icons: this.heroIcons,
      cdnUrl: 'https://heroicons.com/'
    });
  }

  static searchIcons(query: string, category?: string): IconDefinition[] {
    const allIcons: IconDefinition[] = [];
    
    this.iconSets.forEach(iconSet => {
      allIcons.push(...iconSet.icons);
    });

    const normalizedQuery = query.toLowerCase();
    
    return allIcons.filter(icon => {
      const matchesQuery = 
        icon.name.toLowerCase().includes(normalizedQuery) ||
        icon.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
      
      const matchesCategory = !category || icon.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  static getCategories(): string[] {
    const categories = new Set<string>();
    
    this.iconSets.forEach(iconSet => {
      iconSet.icons.forEach(icon => {
        categories.add(icon.category);
      });
    });
    
    return Array.from(categories).sort();
  }

  static generateIconCode(icon: IconDefinition, framework: 'react' | 'html' = 'html'): string {
    if (framework === 'react') {
      return icon.usage;
    } else {
      return icon.svg;
    }
  }

  static injectIconLibrary(fileTree: Record<string, string>, icons: IconDefinition[]): Record<string, string> {
    const updatedFileTree = { ...fileTree };
    
    // Adicionar CDN links no HTML
    if (updatedFileTree['index.html']) {
      let html = updatedFileTree['index.html'];
      
      // Adicionar Lucide CDN se não existir
      if (!html.includes('lucide')) {
        const lucideCdn = '<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>';
        html = html.replace('</head>', `  ${lucideCdn}\n</head>`);
      }
      
      updatedFileTree['index.html'] = html;
    }
    
    // Criar arquivo de ícones
    const iconUsage = icons.map(icon => 
      `// ${icon.name} - ${icon.category}\n// Usage: ${icon.usage}\n// Tags: ${icon.tags.join(', ')}`
    ).join('\n\n');
    
    updatedFileTree['docs/icons.md'] = `# Ícones Disponíveis

Este projeto inclui uma biblioteca de ícones integrada.

## Como Usar

### Lucide Icons (React-like)
\`\`\`html
<i data-lucide="icon-name"></i>
\`\`\`

### Heroicons (SVG direto)
\`\`\`html
${this.heroIcons[0].svg}
\`\`\`

## Ícones Incluídos

${iconUsage}

## Inicialização

Adicione no final do seu JavaScript:
\`\`\`javascript
// Inicializar Lucide icons
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}
\`\`\`
`;
    
    return updatedFileTree;
  }
}

// Inicializar biblioteca
IconLibraryManager.initialize();