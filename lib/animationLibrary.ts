// Animações Pré-definidas
export interface Animation {
  id: string;
  name: string;
  description: string;
  category: 'entrance' | 'hover' | 'scroll' | 'loading' | 'transition';
  css: string;
  usage: string;
  duration?: string;
  easing?: string;
}

export class AnimationLibrary {
  private static animations: Animation[] = [
    // Entrance Animations
    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Smooth fade in effect',
      category: 'entrance',
      css: `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}`,
      usage: 'class="fade-in"',
      duration: '0.6s',
      easing: 'ease-out'
    },
    {
      id: 'slide-up',
      name: 'Slide Up',
      description: 'Slide up from bottom',
      category: 'entrance',
      css: `
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.8s ease-out;
}`,
      usage: 'class="slide-up"',
      duration: '0.8s',
      easing: 'ease-out'
    },
    {
      id: 'scale-in',
      name: 'Scale In',
      description: 'Scale from small to normal',
      category: 'entrance',
      css: `
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}`,
      usage: 'class="scale-in"',
      duration: '0.5s',
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },

    // Hover Animations
    {
      id: 'hover-lift',
      name: 'Hover Lift',
      description: 'Lift element on hover',
      category: 'hover',
      css: `
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}`,
      usage: 'class="hover-lift"',
      duration: '0.3s',
      easing: 'ease'
    },
    {
      id: 'hover-glow',
      name: 'Hover Glow',
      description: 'Glow effect on hover',
      category: 'hover',
      css: `
.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}`,
      usage: 'class="hover-glow"',
      duration: '0.3s',
      easing: 'ease'
    },
    {
      id: 'hover-scale',
      name: 'Hover Scale',
      description: 'Scale up on hover',
      category: 'hover',
      css: `
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}`,
      usage: 'class="hover-scale"',
      duration: '0.2s',
      easing: 'ease'
    },

    // Scroll Animations
    {
      id: 'scroll-reveal',
      name: 'Scroll Reveal',
      description: 'Reveal on scroll',
      category: 'scroll',
      css: `
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}`,
      usage: 'class="scroll-reveal"',
      duration: '0.8s',
      easing: 'ease'
    },
    {
      id: 'parallax-slow',
      name: 'Parallax Slow',
      description: 'Slow parallax effect',
      category: 'scroll',
      css: `
.parallax-slow {
  transform: translateZ(0);
  will-change: transform;
}`,
      usage: 'class="parallax-slow"',
      duration: 'continuous',
      easing: 'linear'
    },

    // Loading Animations
    {
      id: 'spinner',
      name: 'Spinner',
      description: 'Rotating spinner',
      category: 'loading',
      css: `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}`,
      usage: 'class="spinner"',
      duration: '1s',
      easing: 'linear'
    },
    {
      id: 'pulse',
      name: 'Pulse',
      description: 'Pulsing effect',
      category: 'loading',
      css: `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}`,
      usage: 'class="pulse"',
      duration: '2s',
      easing: 'ease-in-out'
    },
    {
      id: 'skeleton',
      name: 'Skeleton Loading',
      description: 'Skeleton placeholder animation',
      category: 'loading',
      css: `
@keyframes skeleton {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: skeleton 1.5s infinite;
}`,
      usage: 'class="skeleton"',
      duration: '1.5s',
      easing: 'linear'
    },

    // Transition Animations
    {
      id: 'smooth-transition',
      name: 'Smooth Transition',
      description: 'Smooth all properties transition',
      category: 'transition',
      css: `
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`,
      usage: 'class="smooth-transition"',
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  ];

  static getAllAnimations(): Animation[] {
    return this.animations;
  }

  static getAnimationsByCategory(category: Animation['category']): Animation[] {
    return this.animations.filter(anim => anim.category === category);
  }

  static getAnimationById(id: string): Animation | undefined {
    return this.animations.find(anim => anim.id === id);
  }

  static generateAnimationCSS(selectedAnimations: string[]): string {
    const animations = selectedAnimations
      .map(id => this.getAnimationById(id))
      .filter(Boolean) as Animation[];

    let css = '/* Animation Library */\n\n';
    
    animations.forEach(animation => {
      css += `/* ${animation.name} - ${animation.description} */\n`;
      css += animation.css;
      css += '\n\n';
    });

    // Adicionar utilitários gerais
    css += `/* Animation Utilities */
.animate-delay-100 { animation-delay: 0.1s; }
.animate-delay-200 { animation-delay: 0.2s; }
.animate-delay-300 { animation-delay: 0.3s; }
.animate-delay-500 { animation-delay: 0.5s; }

.animate-duration-fast { animation-duration: 0.3s; }
.animate-duration-normal { animation-duration: 0.6s; }
.animate-duration-slow { animation-duration: 1s; }

.animate-ease-in { animation-timing-function: ease-in; }
.animate-ease-out { animation-timing-function: ease-out; }
.animate-ease-in-out { animation-timing-function: ease-in-out; }

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

    return css;
  }

  static generateScrollAnimationScript(): string {
    return `// Scroll Animation Observer
class ScrollAnimationManager {
  constructor() {
    this.init();
  }

  init() {
    // Intersection Observer para scroll reveals
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos com scroll-reveal
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      this.observer.observe(el);
    });

    // Parallax scroll
    this.initParallax();
  }

  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-slow');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = \`translateY(\${rate}px)\`;
      });
    });
  }

  // Adicionar animação de entrada com delay
  staggerAnimations(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.style.animationDelay = \`\${index * delay}ms\`;
    });
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.scrollAnimationManager = new ScrollAnimationManager();
  
  // Stagger animations para listas
  window.scrollAnimationManager.staggerAnimations('.fade-in', 150);
  window.scrollAnimationManager.staggerAnimations('.slide-up', 100);
});`;
  }

  static injectAnimations(fileTree: Record<string, string>, selectedAnimations: string[]): Record<string, string> {
    const updatedFileTree = { ...fileTree };
    
    // Gerar CSS das animações
    const animationCSS = this.generateAnimationCSS(selectedAnimations);
    
    if (updatedFileTree['styles/style.css']) {
      updatedFileTree['styles/style.css'] += '\n\n' + animationCSS;
    } else {
      updatedFileTree['styles/animations.css'] = animationCSS;
    }
    
    // Adicionar script de scroll animations se necessário
    const hasScrollAnimations = selectedAnimations.some(id => 
      this.getAnimationById(id)?.category === 'scroll'
    );
    
    if (hasScrollAnimations) {
      updatedFileTree['scripts/scroll-animations.js'] = this.generateScrollAnimationScript();
      
      // Atualizar HTML para incluir o script
      if (updatedFileTree['index.html']) {
        let html = updatedFileTree['index.html'];
        html = html.replace('</body>', '  <script src="scripts/scroll-animations.js"></script>\n</body>');
        updatedFileTree['index.html'] = html;
      }
    }
    
    return updatedFileTree;
  }

  static suggestAnimationsForProject(projectType: string): string[] {
    const suggestions: Record<string, string[]> = {
      'portfolio': ['fade-in', 'slide-up', 'hover-lift', 'scroll-reveal'],
      'business': ['fade-in', 'hover-glow', 'smooth-transition'],
      'ecommerce': ['scale-in', 'hover-scale', 'spinner', 'smooth-transition'],
      'blog': ['fade-in', 'scroll-reveal', 'smooth-transition'],
      'landing': ['slide-up', 'scale-in', 'hover-lift', 'scroll-reveal'],
      'dashboard': ['fade-in', 'skeleton', 'smooth-transition'],
      'creative': ['scale-in', 'hover-lift', 'parallax-slow', 'scroll-reveal']
    };

    return suggestions[projectType.toLowerCase()] || ['fade-in', 'smooth-transition'];
  }
}