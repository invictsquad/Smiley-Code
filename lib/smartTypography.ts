// Tipografia Inteligente
export interface FontPairing {
  id: string;
  name: string;
  description: string;
  headingFont: GoogleFont;
  bodyFont: GoogleFont;
  category: 'modern' | 'classic' | 'playful' | 'professional' | 'minimal';
  mood: string[];
  industries: string[];
}

export interface GoogleFont {
  family: string;
  weights: string[];
  styles: string[];
  googleFontsUrl: string;
  cssDeclaration: string;
}

export class SmartTypographyManager {
  private static fontPairings: FontPairing[] = [
    {
      id: 'modern-clean',
      name: 'Modern Clean',
      description: 'Clean and contemporary for tech and startups',
      headingFont: {
        family: 'Inter',
        weights: ['400', '600', '700'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
        cssDeclaration: 'font-family: "Inter", sans-serif;'
      },
      bodyFont: {
        family: 'Inter',
        weights: ['400', '500'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
        cssDeclaration: 'font-family: "Inter", sans-serif;'
      },
      category: 'modern',
      mood: ['clean', 'professional', 'minimal'],
      industries: ['tech', 'startup', 'saas', 'finance']
    },
    {
      id: 'elegant-serif',
      name: 'Elegant Serif',
      description: 'Sophisticated serif pairing for luxury brands',
      headingFont: {
        family: 'Playfair Display',
        weights: ['400', '700'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        cssDeclaration: 'font-family: "Playfair Display", serif;'
      },
      bodyFont: {
        family: 'Source Sans Pro',
        weights: ['400', '600'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap',
        cssDeclaration: 'font-family: "Source Sans Pro", sans-serif;'
      },
      category: 'classic',
      mood: ['elegant', 'sophisticated', 'luxury'],
      industries: ['fashion', 'luxury', 'law', 'consulting']
    },
    {
      id: 'friendly-rounded',
      name: 'Friendly Rounded',
      description: 'Warm and approachable for creative businesses',
      headingFont: {
        family: 'Nunito',
        weights: ['600', '700', '800'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap',
        cssDeclaration: 'font-family: "Nunito", sans-serif;'
      },
      bodyFont: {
        family: 'Open Sans',
        weights: ['400', '600'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap',
        cssDeclaration: 'font-family: "Open Sans", sans-serif;'
      },
      category: 'playful',
      mood: ['friendly', 'warm', 'approachable'],
      industries: ['creative', 'education', 'healthcare', 'nonprofit']
    },
    {
      id: 'corporate-strong',
      name: 'Corporate Strong',
      description: 'Strong and trustworthy for corporate websites',
      headingFont: {
        family: 'Roboto Slab',
        weights: ['400', '700'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap',
        cssDeclaration: 'font-family: "Roboto Slab", serif;'
      },
      bodyFont: {
        family: 'Roboto',
        weights: ['400', '500'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap',
        cssDeclaration: 'font-family: "Roboto", sans-serif;'
      },
      category: 'professional',
      mood: ['trustworthy', 'strong', 'corporate'],
      industries: ['corporate', 'finance', 'insurance', 'government']
    },
    {
      id: 'minimal-mono',
      name: 'Minimal Mono',
      description: 'Clean monospace for developers and portfolios',
      headingFont: {
        family: 'JetBrains Mono',
        weights: ['400', '700'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
        cssDeclaration: 'font-family: "JetBrains Mono", monospace;'
      },
      bodyFont: {
        family: 'Inter',
        weights: ['400', '500'],
        styles: ['normal'],
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
        cssDeclaration: 'font-family: "Inter", sans-serif;'
      },
      category: 'minimal',
      mood: ['minimal', 'technical', 'modern'],
      industries: ['tech', 'developer', 'portfolio', 'agency']
    }
  ];

  static suggestTypography(projectDescription: string, industry?: string): FontPairing[] {
    const description = projectDescription.toLowerCase();
    const suggestions: { pairing: FontPairing; score: number }[] = [];

    this.fontPairings.forEach(pairing => {
      let score = 0;

      // Score baseado na indústria
      if (industry && pairing.industries.includes(industry.toLowerCase())) {
        score += 10;
      }

      // Score baseado no mood/palavras-chave
      pairing.mood.forEach(mood => {
        if (description.includes(mood)) {
          score += 5;
        }
      });

      // Score baseado na categoria
      if (description.includes('modern') && pairing.category === 'modern') score += 8;
      if (description.includes('classic') && pairing.category === 'classic') score += 8;
      if (description.includes('playful') && pairing.category === 'playful') score += 8;
      if (description.includes('professional') && pairing.category === 'professional') score += 8;
      if (description.includes('minimal') && pairing.category === 'minimal') score += 8;

      // Palavras-chave específicas
      if (description.includes('tech') || description.includes('startup')) {
        if (pairing.id === 'modern-clean') score += 15;
      }
      if (description.includes('luxury') || description.includes('elegant')) {
        if (pairing.id === 'elegant-serif') score += 15;
      }
      if (description.includes('creative') || description.includes('friendly')) {
        if (pairing.id === 'friendly-rounded') score += 15;
      }

      suggestions.push({ pairing, score });
    });

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.pairing);
  }

  static generateTypographyCSS(pairing: FontPairing): string {
    const headingWeights = pairing.headingFont.weights.join(';');
    const bodyWeights = pairing.bodyFont.weights.join(';');

    return `/* Typography System - ${pairing.name} */
@import url('${pairing.headingFont.googleFontsUrl}');
@import url('${pairing.bodyFont.googleFontsUrl}');

:root {
  --font-heading: ${pairing.headingFont.cssDeclaration.replace('font-family: ', '').replace(';', '')};
  --font-body: ${pairing.bodyFont.cssDeclaration.replace('font-family: ', '').replace(';', '')};
  
  /* Typography Scale */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}

/* Base Typography */
body {
  ${pairing.bodyFont.cssDeclaration}
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  ${pairing.headingFont.cssDeclaration}
  line-height: var(--leading-tight);
  font-weight: 700;
}

h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-4xl); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }
h5 { font-size: var(--text-xl); }
h6 { font-size: var(--text-lg); }

/* Responsive Typography */
@media (max-width: 768px) {
  h1 { font-size: var(--text-4xl); }
  h2 { font-size: var(--text-3xl); }
  h3 { font-size: var(--text-2xl); }
}

/* Utility Classes */
.text-heading { ${pairing.headingFont.cssDeclaration} }
.text-body { ${pairing.bodyFont.cssDeclaration} }

.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }
.text-5xl { font-size: var(--text-5xl); }

.leading-tight { line-height: var(--leading-tight); }
.leading-normal { line-height: var(--leading-normal); }
.leading-relaxed { line-height: var(--leading-relaxed); }`;
  }

  static injectTypography(fileTree: Record<string, string>, pairing: FontPairing): Record<string, string> {
    const updatedFileTree = { ...fileTree };
    
    // Atualizar CSS principal
    const typographyCSS = this.generateTypographyCSS(pairing);
    
    if (updatedFileTree['styles/style.css']) {
      // Adicionar no início do CSS existente
      updatedFileTree['styles/style.css'] = typographyCSS + '\n\n' + updatedFileTree['styles/style.css'];
    } else {
      updatedFileTree['styles/typography.css'] = typographyCSS;
    }
    
    // Atualizar HTML para incluir preload das fontes
    if (updatedFileTree['index.html']) {
      let html = updatedFileTree['index.html'];
      
      // Adicionar preload para performance
      const preloadLinks = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="${pairing.headingFont.googleFontsUrl}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="${pairing.bodyFont.googleFontsUrl}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript>
    <link rel="stylesheet" href="${pairing.headingFont.googleFontsUrl}">
    <link rel="stylesheet" href="${pairing.bodyFont.googleFontsUrl}">
  </noscript>`;
      
      html = html.replace('</head>', preloadLinks + '\n</head>');
      updatedFileTree['index.html'] = html;
    }
    
    return updatedFileTree;
  }

  static getAllPairings(): FontPairing[] {
    return this.fontPairings;
  }

  static getPairingById(id: string): FontPairing | undefined {
    return this.fontPairings.find(p => p.id === id);
  }
}