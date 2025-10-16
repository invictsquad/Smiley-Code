// Gradientes Modernos
export interface Gradient {
  id: string;
  name: string;
  description: string;
  category: 'warm' | 'cool' | 'vibrant' | 'subtle' | 'dark' | 'pastel';
  css: string;
  colors: string[];
  direction?: string;
}

export class GradientGenerator {
  private static gradients: Gradient[] = [
    // Warm Gradients
    {
      id: 'sunset-warm',
      name: 'Sunset Warm',
      description: 'Warm sunset colors',
      category: 'warm',
      css: 'background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);',
      colors: ['#ff9a9e', '#fecfef'],
      direction: '135deg'
    },
    {
      id: 'orange-coral',
      name: 'Orange Coral',
      description: 'Vibrant orange to coral',
      category: 'warm',
      css: 'background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);',
      colors: ['#ff6b6b', '#ffa726'],
      direction: '135deg'
    },
    {
      id: 'fire-gradient',
      name: 'Fire Gradient',
      description: 'Fiery red to orange',
      category: 'warm',
      css: 'background: linear-gradient(45deg, #ff416c 0%, #ff4b2b 100%);',
      colors: ['#ff416c', '#ff4b2b'],
      direction: '45deg'
    },

    // Cool Gradients
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      description: 'Deep ocean blues',
      category: 'cool',
      css: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
      colors: ['#667eea', '#764ba2'],
      direction: '135deg'
    },
    {
      id: 'sky-gradient',
      name: 'Sky Gradient',
      description: 'Clear sky blue',
      category: 'cool',
      css: 'background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);',
      colors: ['#74b9ff', '#0984e3'],
      direction: '135deg'
    },
    {
      id: 'mint-fresh',
      name: 'Mint Fresh',
      description: 'Fresh mint green',
      category: 'cool',
      css: 'background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);',
      colors: ['#a8edea', '#fed6e3'],
      direction: '135deg'
    },

    // Vibrant Gradients
    {
      id: 'rainbow-bright',
      name: 'Rainbow Bright',
      description: 'Vibrant rainbow colors',
      category: 'vibrant',
      css: 'background: linear-gradient(135deg, #ff0844 0%, #ffb199 25%, #ff6b9d 50%, #c44569 75%, #f8b500 100%);',
      colors: ['#ff0844', '#ffb199', '#ff6b9d', '#c44569', '#f8b500'],
      direction: '135deg'
    },
    {
      id: 'neon-glow',
      name: 'Neon Glow',
      description: 'Electric neon colors',
      category: 'vibrant',
      css: 'background: linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%);',
      colors: ['#12c2e9', '#c471ed', '#f64f59'],
      direction: '135deg'
    },

    // Subtle Gradients
    {
      id: 'soft-gray',
      name: 'Soft Gray',
      description: 'Subtle gray tones',
      category: 'subtle',
      css: 'background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);',
      colors: ['#f5f7fa', '#c3cfe2'],
      direction: '135deg'
    },
    {
      id: 'pearl-white',
      name: 'Pearl White',
      description: 'Elegant pearl white',
      category: 'subtle',
      css: 'background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);',
      colors: ['#fdfbfb', '#ebedee'],
      direction: '135deg'
    },

    // Dark Gradients
    {
      id: 'dark-night',
      name: 'Dark Night',
      description: 'Deep dark tones',
      category: 'dark',
      css: 'background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);',
      colors: ['#2c3e50', '#34495e'],
      direction: '135deg'
    },
    {
      id: 'midnight-blue',
      name: 'Midnight Blue',
      description: 'Midnight blue gradient',
      category: 'dark',
      css: 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);',
      colors: ['#1e3c72', '#2a5298'],
      direction: '135deg'
    },

    // Pastel Gradients
    {
      id: 'pastel-dream',
      name: 'Pastel Dream',
      description: 'Soft pastel colors',
      category: 'pastel',
      css: 'background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);',
      colors: ['#ffecd2', '#fcb69f'],
      direction: '135deg'
    },
    {
      id: 'lavender-mist',
      name: 'Lavender Mist',
      description: 'Gentle lavender tones',
      category: 'pastel',
      css: 'background: linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%);',
      colors: ['#e0c3fc', '#9bb5ff'],
      direction: '135deg'
    }
  ];

  static getAllGradients(): Gradient[] {
    return this.gradients;
  }

  static getGradientsByCategory(category: Gradient['category']): Gradient[] {
    return this.gradients.filter(grad => grad.category === category);
  }

  static getGradientById(id: string): Gradient | undefined {
    return this.gradients.find(grad => grad.id === id);
  }

  static generateCustomGradient(colors: string[], direction: string = '135deg'): string {
    if (colors.length < 2) {
      throw new Error('At least 2 colors are required for a gradient');
    }

    const colorStops = colors.map((color, index) => {
      const percentage = (index / (colors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    }).join(', ');

    return `background: linear-gradient(${direction}, ${colorStops});`;
  }

  static generateGradientCSS(selectedGradients: string[]): string {
    const gradients = selectedGradients
      .map(id => this.getGradientById(id))
      .filter(Boolean) as Gradient[];

    let css = '/* Modern Gradients Library */\n\n';

    gradients.forEach(gradient => {
      css += `/* ${gradient.name} - ${gradient.description} */\n`;
      css += `.gradient-${gradient.id} {\n  ${gradient.css}\n}\n\n`;
    });

    // Adicionar utilitários de gradiente
    css += `/* Gradient Utilities */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-border {
  position: relative;
  background: white;
  border-radius: 8px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

/* Animated Gradients */
.gradient-animated {
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Gradient Overlays */
.gradient-overlay {
  position: relative;
}

.gradient-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
  pointer-events: none;
}

/* Mesh Gradients */
.gradient-mesh {
  background: 
    radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #f093fb 0%, transparent 50%);
}`;

    return css;
  }

  static suggestGradientsForProject(projectType: string, mood?: string): string[] {
    const suggestions: Record<string, string[]> = {
      'tech': ['ocean-blue', 'sky-gradient', 'neon-glow'],
      'creative': ['rainbow-bright', 'pastel-dream', 'sunset-warm'],
      'business': ['soft-gray', 'pearl-white', 'midnight-blue'],
      'ecommerce': ['orange-coral', 'fire-gradient', 'vibrant'],
      'portfolio': ['lavender-mist', 'mint-fresh', 'pastel-dream'],
      'blog': ['soft-gray', 'pastel-dream', 'pearl-white'],
      'landing': ['sunset-warm', 'ocean-blue', 'neon-glow']
    };

    const moodSuggestions: Record<string, string[]> = {
      'energetic': ['fire-gradient', 'neon-glow', 'rainbow-bright'],
      'calm': ['soft-gray', 'mint-fresh', 'lavender-mist'],
      'professional': ['midnight-blue', 'dark-night', 'pearl-white'],
      'playful': ['pastel-dream', 'sunset-warm', 'rainbow-bright'],
      'elegant': ['pearl-white', 'lavender-mist', 'soft-gray']
    };

    let result = suggestions[projectType.toLowerCase()] || ['soft-gray', 'ocean-blue'];
    
    if (mood && moodSuggestions[mood.toLowerCase()]) {
      result = [...result, ...moodSuggestions[mood.toLowerCase()]];
    }

    return [...new Set(result)].slice(0, 3);
  }

  static generateGradientPreview(gradient: Gradient): string {
    return `
<div class="gradient-preview" style="${gradient.css} width: 100px; height: 60px; border-radius: 8px; border: 1px solid #e2e8f0;">
</div>`;
  }

  static injectGradients(fileTree: Record<string, string>, selectedGradients: string[]): Record<string, string> {
    const updatedFileTree = { ...fileTree };
    
    // Gerar CSS dos gradientes
    const gradientCSS = this.generateGradientCSS(selectedGradients);
    
    if (updatedFileTree['styles/style.css']) {
      updatedFileTree['styles/style.css'] += '\n\n' + gradientCSS;
    } else {
      updatedFileTree['styles/gradients.css'] = gradientCSS;
    }
    
    // Criar documentação dos gradientes
    const gradients = selectedGradients
      .map(id => this.getGradientById(id))
      .filter(Boolean) as Gradient[];

    const gradientDocs = gradients.map(gradient => 
      `## ${gradient.name}
**Categoria:** ${gradient.category}
**Descrição:** ${gradient.description}
**Uso:** \`class="gradient-${gradient.id}"\`
**CSS:** \`${gradient.css}\`
**Cores:** ${gradient.colors.join(', ')}`
    ).join('\n\n');

    updatedFileTree['docs/gradients.md'] = `# Gradientes Disponíveis

Este projeto inclui uma biblioteca de gradientes modernos.

## Como Usar

Adicione a classe do gradiente ao elemento:
\`\`\`html
<div class="gradient-sunset-warm">Conteúdo</div>
\`\`\`

## Utilitários Especiais

- \`.gradient-text\` - Texto com gradiente
- \`.gradient-border\` - Borda com gradiente
- \`.gradient-animated\` - Gradiente animado
- \`.gradient-overlay\` - Overlay com gradiente
- \`.gradient-mesh\` - Gradiente mesh

## Gradientes Incluídos

${gradientDocs}`;
    
    return updatedFileTree;
  }

  static getCategories(): string[] {
    return ['warm', 'cool', 'vibrant', 'subtle', 'dark', 'pastel'];
  }
}