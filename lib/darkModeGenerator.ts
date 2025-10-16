// Modo Escuro Automático
export interface ColorScheme {
  light: ColorPalette;
  dark: ColorPalette;
}

export interface ColorPalette {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export class DarkModeGenerator {
  
  static generateDarkMode(lightColors: Partial<ColorPalette>): ColorScheme {
    // Cores padrão se não fornecidas
    const defaultLight: ColorPalette = {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      shadow: 'rgba(0, 0, 0, 0.1)'
    };

    const light: ColorPalette = { ...defaultLight, ...lightColors };
    
    // Gerar versão escura automaticamente
    const dark: ColorPalette = {
      background: this.invertLightness(light.background, 0.05), // Muito escuro
      surface: this.invertLightness(light.surface, 0.1),        // Escuro
      primary: this.adjustForDark(light.primary),               // Mais claro no escuro
      secondary: this.adjustForDark(light.secondary),           // Mais claro
      accent: this.adjustForDark(light.accent),                 // Mais vibrante
      text: this.invertLightness(light.text, 0.9),             // Quase branco
      textSecondary: this.invertLightness(light.textSecondary, 0.7), // Cinza claro
      border: this.invertLightness(light.border, 0.2),         // Cinza escuro
      shadow: 'rgba(0, 0, 0, 0.3)'                            // Sombra mais forte
    };

    return { light, dark };
  }

  static generateDarkModeCSS(colorScheme: ColorScheme): string {
    return `/* Dark Mode System */
:root {
  /* Light Mode Colors */
  --color-background: ${colorScheme.light.background};
  --color-surface: ${colorScheme.light.surface};
  --color-primary: ${colorScheme.light.primary};
  --color-secondary: ${colorScheme.light.secondary};
  --color-accent: ${colorScheme.light.accent};
  --color-text: ${colorScheme.light.text};
  --color-text-secondary: ${colorScheme.light.textSecondary};
  --color-border: ${colorScheme.light.border};
  --color-shadow: ${colorScheme.light.shadow};
  
  /* Theme transition */
  --transition-theme: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Dark Mode Colors */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: ${colorScheme.dark.background};
    --color-surface: ${colorScheme.dark.surface};
    --color-primary: ${colorScheme.dark.primary};
    --color-secondary: ${colorScheme.dark.secondary};
    --color-accent: ${colorScheme.dark.accent};
    --color-text: ${colorScheme.dark.text};
    --color-text-secondary: ${colorScheme.dark.textSecondary};
    --color-border: ${colorScheme.dark.border};
    --color-shadow: ${colorScheme.dark.shadow};
  }
}

/* Manual Dark Mode Toggle */
[data-theme="dark"] {
  --color-background: ${colorScheme.dark.background};
  --color-surface: ${colorScheme.dark.surface};
  --color-primary: ${colorScheme.dark.primary};
  --color-secondary: ${colorScheme.dark.secondary};
  --color-accent: ${colorScheme.dark.accent};
  --color-text: ${colorScheme.dark.text};
  --color-text-secondary: ${colorScheme.dark.textSecondary};
  --color-border: ${colorScheme.dark.border};
  --color-shadow: ${colorScheme.dark.shadow};
}

/* Base Styles */
body {
  background-color: var(--color-background);
  color: var(--color-text);
  transition: var(--transition-theme);
}

/* Surface Elements */
.surface {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: var(--transition-theme);
}

/* Primary Elements */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  transition: var(--transition-theme);
}

.btn-primary:hover {
  background-color: var(--color-primary);
  filter: brightness(1.1);
}

/* Secondary Elements */
.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
  border: none;
  transition: var(--transition-theme);
}

/* Text Colors */
.text-primary { color: var(--color-text); }
.text-secondary { color: var(--color-text-secondary); }

/* Borders */
.border { border-color: var(--color-border); }

/* Shadows */
.shadow {
  box-shadow: 0 4px 6px -1px var(--color-shadow);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px var(--color-shadow);
}

/* Form Elements */
input, textarea, select {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: var(--transition-theme);
}

input:focus, textarea:focus, select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Cards */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  transition: var(--transition-theme);
}

/* Navigation */
.nav {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition-theme);
}

/* Footer */
.footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: var(--transition-theme);
}`;
  }

  static generateDarkModeToggle(): string {
    return `/* Dark Mode Toggle Component */
.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 50px;
  padding: 4px;
  cursor: pointer;
  transition: var(--transition-theme);
  width: 60px;
  height: 32px;
}

.theme-toggle-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.theme-toggle[data-theme="dark"] .theme-toggle-slider {
  transform: translateX(28px);
}

.theme-toggle-icon {
  font-size: 12px;
  color: white;
}`;
  }

  static generateDarkModeScript(): string {
    return `// Dark Mode Toggle Script
class DarkModeManager {
  constructor() {
    this.init();
  }

  init() {
    // Verificar preferência salva ou do sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);
    
    // Escutar mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Atualizar toggle se existir
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('data-theme', theme);
      const icon = toggle.querySelector('.theme-toggle-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
      }
    }
  }

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.darkModeManager = new DarkModeManager();
  
  // Adicionar event listeners para toggles
  document.querySelectorAll('.theme-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      window.darkModeManager.toggle();
    });
  });
});`;
  }

  static injectDarkMode(fileTree: Record<string, string>, customColors?: Partial<ColorPalette>): Record<string, string> {
    const updatedFileTree = { ...fileTree };
    
    // Gerar esquema de cores
    const colorScheme = this.generateDarkMode(customColors || {});
    
    // Adicionar CSS do dark mode
    const darkModeCSS = this.generateDarkModeCSS(colorScheme);
    const toggleCSS = this.generateDarkModeToggle();
    
    if (updatedFileTree['styles/style.css']) {
      updatedFileTree['styles/style.css'] = darkModeCSS + '\n\n' + toggleCSS + '\n\n' + updatedFileTree['styles/style.css'];
    } else {
      updatedFileTree['styles/dark-mode.css'] = darkModeCSS + '\n\n' + toggleCSS;
    }
    
    // Adicionar JavaScript do dark mode
    updatedFileTree['scripts/dark-mode.js'] = this.generateDarkModeScript();
    
    // Atualizar HTML para incluir o toggle e script
    if (updatedFileTree['index.html']) {
      let html = updatedFileTree['index.html'];
      
      // Adicionar script antes do </body>
      html = html.replace('</body>', '  <script src="scripts/dark-mode.js"></script>\n</body>');
      
      // Adicionar toggle no header se existir nav
      if (html.includes('<nav') || html.includes('<header')) {
        const toggleHTML = `
        <button class="theme-toggle" aria-label="Toggle dark mode">
          <div class="theme-toggle-slider">
            <span class="theme-toggle-icon">☀️</span>
          </div>
        </button>`;
        
        // Tentar adicionar no nav ou header
        if (html.includes('</nav>')) {
          html = html.replace('</nav>', toggleHTML + '\n  </nav>');
        } else if (html.includes('</header>')) {
          html = html.replace('</header>', toggleHTML + '\n  </header>');
        }
      }
      
      updatedFileTree['index.html'] = html;
    }
    
    return updatedFileTree;
  }

  // Funções auxiliares para manipulação de cores
  private static hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  private static hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private static invertLightness(color: string, targetLightness: number): string {
    const [h, s, l] = this.hexToHsl(color);
    return this.hslToHex(h, s, targetLightness * 100);
  }

  private static adjustForDark(color: string): string {
    const [h, s, l] = this.hexToHsl(color);
    // Aumentar lightness para cores escuras ficarem visíveis no dark mode
    const newL = Math.max(l, 60);
    return this.hslToHex(h, s, newL);
  }
}