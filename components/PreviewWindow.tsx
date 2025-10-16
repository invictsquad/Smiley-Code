import { useState, useEffect } from 'react';
import { RefreshCw, Smartphone, Tablet, Monitor, Code, Upload, SidebarClose, SidebarOpen, ExternalLink } from 'lucide-react';
import { FileTree, Language } from '../types';
import { t } from '../lib/i18n';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    JSZip: any;
  }
}

interface PreviewWindowProps {
  fileTree: FileTree | null;
  language: Language;
  isSidebarVisibleOnDesktop: boolean;
  onToggleSidebarOnDesktop: () => void;
  onShowCodeViewer: () => void;
  onInitiatePublish: () => void;
  isLoading: boolean;
}

type ViewMode = 'mobile' | 'tablet' | 'desktop' | 'multi';

const generatePreviewHtml = (fileTree: FileTree | null, language: Language): string => {
  if (!fileTree || !fileTree['index.html']) {
    console.log('❌ Preview: No fileTree or index.html found');
    return `<body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; color: #555;">${t('preview.empty', language)}</body>`;
  }

  let htmlContent = fileTree['index.html'];
  
  // Ensure HTML has basic structure
  if (!htmlContent.includes('<html') && !htmlContent.includes('<body')) {
    htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body>${htmlContent}</body></html>`;
  }
  
  // Ensure HTML is not empty or malformed
  if (htmlContent.trim().length < 50) {
    console.log('⚠️ Preview: HTML content seems too short, might be malformed');
    return `<body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; color: #555;">Conteúdo HTML inválido ou muito curto</body>`;
  }
  


  // Inline CSS <link> tags
  htmlContent = htmlContent.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g, (match, path) => {
    const cleanPath = path.replace(/^\.\//, '');
    const cssContent = fileTree[cleanPath];
    if (cssContent) {
      console.log(`🎨 Inlining CSS: ${cleanPath}`);
      return `<style>\n${cssContent}\n</style>`;
    }
    console.log(`⚠️ CSS not found: ${cleanPath}`);
    return match;
  });

  // Inline JS <script> tags
  htmlContent = htmlContent.replace(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g, (match, path) => {
    const cleanPath = path.replace(/^\.\//, '');
    const jsContent = fileTree[cleanPath];
    if (jsContent) {
      console.log(`⚡ Inlining JS: ${cleanPath}`);
      return `<script>\n${jsContent}\n</script>`;
    }
    console.log(`⚠️ JS not found: ${cleanPath}`);
    return match;
  });

  // Add navigation prevention script
  const navigationPreventionScript = `
    <script>
      // Prevent navigation and form submissions that would leave the preview
      (function() {
        // Prevent all form submissions
        document.addEventListener('submit', function(e) {
          e.preventDefault();
          console.log('Form submission prevented in preview mode');
        });

        // Prevent navigation on links
        document.addEventListener('click', function(e) {
          const target = e.target.closest('a');
          if (target && target.href) {
            // Allow links that open in new tab/window
            if (target.target === '_blank' || target.target === '_new') {
              return;
            }
            
            // Allow hash links (same page navigation)
            if (target.href.startsWith('#') || target.href.includes('#')) {
              return;
            }
            
            // Allow javascript: links
            if (target.href.startsWith('javascript:')) {
              return;
            }
            
            // Prevent external navigation
            e.preventDefault();
            console.log('Navigation prevented in preview mode. Link:', target.href);
          }
        });

        // Override window.location methods
        const originalAssign = window.location.assign;
        const originalReplace = window.location.replace;
        const originalReload = window.location.reload;
        
        window.location.assign = function(url) {
          console.log('window.location.assign prevented in preview mode. URL:', url);
        };
        
        window.location.replace = function(url) {
          console.log('window.location.replace prevented in preview mode. URL:', url);
        };
        
        window.location.reload = function() {
          console.log('window.location.reload prevented in preview mode');
        };

        // Override history methods
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(state, title, url) {
          console.log('history.pushState in preview mode. URL:', url);
          // Allow hash-only changes
          if (url && url.startsWith('#')) {
            return originalPushState.call(this, state, title, url);
          }
        };
        
        history.replaceState = function(state, title, url) {
          console.log('history.replaceState in preview mode. URL:', url);
          // Allow hash-only changes
          if (url && url.startsWith('#')) {
            return originalReplaceState.call(this, state, title, url);
          }
        };
      })();
    </script>
  `;

  // Insert the script before the closing body tag, or at the end if no body tag
  if (htmlContent.includes('</body>')) {
    htmlContent = htmlContent.replace('</body>', navigationPreventionScript + '\n</body>');
  } else {
    htmlContent += navigationPreventionScript;
  }

  return htmlContent;
};

const getLoadingPhrases = (language: Language): {title: string, phrases: string[]} => {
  const phrases_pt = [
      "Inicializando o ambiente de desenvolvimento...", "Configurando o servidor web...", "Instalando dependências...", "Estruturando o projeto...", "Criando o arquivo index.html...", "Adicionando a estrutura básica do HTML...", "Vinculando a folha de estilos CSS...", "Aplicando o reset de CSS...", "Definindo as variáveis de cor...", "Estilizando o corpo da página...", "Adicionando fontes personalizadas...", "Criando o cabeçalho...", "Desenvolvendo a barra de navegação...", "Tornando o layout responsivo...", "Adicionando media queries...", "Criando componentes reutilizáveis...", "Escrevendo o script principal em JavaScript...", "Implementando a lógica de negócios...", "Adicionando interatividade aos botões...", "Validando os formulários...", "Manipulando eventos do DOM...", "Buscando dados de uma API...", "Renderizando dados dinamicamente...", "Otimizando o desempenho...", "Minificando arquivos CSS e JS...", "Comprimindo as imagens...", "Configurando o cache do navegador...", "Garantindo a acessibilidade (a11y)...", "Adicionando atributos ARIA...", "Testando a navegação por teclado...", "Verificando o contraste das cores...", "Implementando o modo escuro...", "Escrevendo testes unitários...", "Configurando testes de integração...", "Executando a suíte de testes...", "Depurando o código...", "Corrigindo bugs inesperados...", "Refatorando para melhorar a legibilidade...", "Adicionando comentários ao código...", "Documentando as funções...", "Preparando para a implantação...", "Construindo a versão de produção...", "Verificando a compatibilidade entre navegadores...", "Polindo as animações da interface...", "Adicionando transições suaves...", "Ajustando o espaçamento e alinhamento...", "Finalizando os detalhes do design...", "Adicionando o favicon...", "Configurando as meta tags de SEO...", "Quase pronto...", "Compilando o resultado final...",
  ];
  const phrases_en = [
      "Initializing development environment...", "Setting up web server...", "Installing dependencies...", "Scaffolding project structure...", "Creating index.html...", "Adding HTML boilerplate...", "Linking CSS stylesheet...", "Applying CSS reset...", "Defining color variables...", "Styling the body...", "Adding custom fonts...", "Building the header...", "Developing navigation bar...", "Making the layout responsive...", "Adding media queries...", "Creating reusable components...", "Writing main JavaScript file...", "Implementing business logic...", "Adding button interactivity...", "Validating forms...", "Handling DOM events...", "Fetching data from API...", "Rendering dynamic data...", "Optimizing for performance...", "Minifying CSS and JS files...", "Compressing images...", "Configuring browser cache...", "Ensuring accessibility (a11y)...", "Adding ARIA attributes...", "Testing keyboard navigation...", "Checking color contrast...", "Implementing dark mode...", "Writing unit tests...", "Setting up integration tests...", "Running test suite...", "Debugging code...", "Fixing unexpected bugs...", "Refactoring for readability...", "Adding code comments...", "Documenting functions...", "Preparing for deployment...", "Building for production...", "Checking browser compatibility...", "Polishing UI animations...", "Adding smooth transitions...", "Adjusting spacing and alignment...", "Finalizing design details...", "Adding favicon...", "Configuring SEO meta tags...", "Almost there...", "Compiling final result...",
  ];
  const phrases_es = [
      "Inicializando entorno de desarrollo...", "Configurando servidor web...", "Instalando dependencias...", "Creando estructura del proyecto...", "Creando index.html...", "Añadiendo plantilla HTML...", "Vinculando hoja de estilos CSS...", "Aplicando reseteo de CSS...", "Definindo variables de color...", "Estilizando el body...", "Añadiendo fuentes personalizadas...", "Construyendo la cabecera...", "Desarrollando la barra de navegación...", "Haciendo el diseño responsivo...", "Añadiendo media queries...", "Creando componentes reutilizables...", "Escribiendo script principal de JavaScript...", "Implementando lógica de negocio...", "Añadiendo interactividad a los botones...", "Validando formularios...", "Manejando eventos del DOM...", "Obteniendo datos de una API...", "Renderizando datos dinámicos...", "Optimizando el rendimiento...", "Minificando archivos CSS y JS...", "Comprimiendo imágenes...", "Configurando la caché del navegador...", "Asegurando la accesibilidad (a11y)...", "Añadiendo atributos ARIA...", "Probando navegación por teclado...", "Verificando contraste de colores...", "Implementando modo oscuro...", "Escribiendo pruebas unitarias...", "Configurando pruebas de integración...", "Ejecutando suite de pruebas...", "Depurando el código...", "Corrigiendo errores inesperados...", "Refactorizando para legibilidad...", "Añadiendo comentarios al código...", "Documentando funciones...", "Preparando para el despliegue...", "Compilando para producción...", "Verificando compatibilidad de navegadores...", "Puliendo animaciones de la interfaz...", "Añadiendo transiciones suaves...", "Ajustando espaciado y alineación...", "Finalizando detalles de diseño...", "Añadiendo favicon...", "Configurando metaetiquetas de SEO...", "Casi listo...", "Compilando resultado final...",
  ];

  switch(language) {
      case 'pt': return { title: 'Friendly está construindo...', phrases: phrases_pt };
      case 'en': return { title: 'Friendly is building...', phrases: phrases_en };
      case 'es': return { title: 'Friendly está construyendo...', phrases: phrases_es };
      default: return { title: 'Friendly is building...', phrases: phrases_en };
  }
}

const generateLoadingHtml = (language: Language): string => {
  const { title, phrases } = getLoadingPhrases(language);
  const allLines = [title, ...phrases];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
          body {
              background-color: #1e293b; /* dark-bg */
              color: #e2e8f0; /* dark-text */
              font-family: 'Roboto Mono', monospace;
              overflow: hidden;
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
          }
          .terminal {
              width: 90%;
              max-width: 800px;
              height: 90%;
              max-height: 600px;
              background-color: rgba(0,0,0,0.2);
              border: 2px solid #64748b; /* dark-border */
              border-radius: 0.75rem; /* rounded-lg */
              box-shadow: 4px 4px 0px #e2e8f0, 0 0 20px rgba(0,0,0,0.4);
              display: flex;
              flex-direction: column;
          }
          .terminal-header {
              background-color: #334155; /* dark-surface */
              padding: 0.5rem 1rem;
              border-bottom: 2px solid #64748b;
              display: flex;
              align-items: center;
              gap: 0.5rem;
          }
          .terminal-dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 1px solid rgba(0,0,0,0.2);
          }
          .terminal-body {
              flex-grow: 1;
              padding: 1rem;
              overflow-y: auto;
              font-size: 0.9em;
          }
          .cursor {
              display: inline-block;
              width: 0.6em;
              height: 1.2em;
              background-color: #a8e6cf; /* brand-green */
              animation: blink 1s step-end infinite;
              vertical-align: bottom;
          }
          @keyframes blink {
              50% { opacity: 0; }
          }
      </style>
    </head>
    <body>
        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-dot" style="background-color: #ff6b6b;"></div>
                <div class="terminal-dot" style="background-color: #ffd93d;"></div>
                <div class="terminal-dot" style="background-color: #a8e6cf;"></div>
            </div>
            <div class="terminal-body">
                <pre><code id="code-output"></code></pre>
            </div>
        </div>

        <script>
            const lines = ${JSON.stringify(allLines)};
            const outputEl = document.getElementById('code-output');
            const terminalBody = document.querySelector('.terminal-body');

            const cursorEl = document.createElement('span');
            cursorEl.className = 'cursor';
            if(outputEl) outputEl.appendChild(cursorEl);

            let lineIndex = 0;
            let charIndex = 0;
            const typingSpeed = 20;
            const lineDelay = 150;
            const loopDelay = 2000;

            function type() {
                if (!outputEl || !cursorEl) return;
                
                if (lineIndex >= lines.length) {
                    setTimeout(() => {
                        while (outputEl.firstChild && outputEl.firstChild !== cursorEl) {
                            outputEl.removeChild(outputEl.firstChild);
                        }
                        lineIndex = 0;
                        charIndex = 0;
                        type();
                    }, loopDelay);
                    return;
                }

                const currentLine = lines[lineIndex];
                if (charIndex < currentLine.length) {
                    const textNode = document.createTextNode(currentLine.charAt(charIndex));
                    outputEl.insertBefore(textNode, cursorEl);
                    charIndex++;
                    setTimeout(type, typingSpeed);
                } else {
                    const newlineNode = document.createTextNode('\\n');
                    outputEl.insertBefore(newlineNode, cursorEl);
                    lineIndex++;
                    charIndex = 0;
                    if(terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
                    setTimeout(type, lineDelay);
                }
            }
            type();
        </script>
    </body>
    </html>
  `;
};

const IconButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, isActive?: boolean, disabled?: boolean, className?: string }> = ({ icon, label, onClick, isActive, disabled, className }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    aria-label={label}
    title={label}
    disabled={disabled}
    className={`flex items-center gap-2 px-3 py-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm transition-colors disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-400 ${isActive ? 'bg-brand-yellow text-slate-800' : 'bg-white dark:bg-dark-surface hover:bg-slate-100 dark:hover:bg-slate-600'} ${className}`}
  >
    {icon}
    <span className="hidden sm:inline font-bold text-sm">{label}</span>
  </motion.button>
);

const PreviewWindow: React.FC<PreviewWindowProps> = ({ fileTree, language, isSidebarVisibleOnDesktop, onToggleSidebarOnDesktop, onShowCodeViewer, onInitiatePublish, isLoading }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [key, setKey] = useState(0);
  
  // Force refresh when fileTree changes
  useEffect(() => {
    if (fileTree && Object.keys(fileTree).length > 0) {
      console.log('🔄 Preview: FileTree updated, refreshing...');
      // Force iframe refresh immediately when fileTree changes
      setKey(prev => prev + 1);
    }
  }, [fileTree]);
  
  // Additional refresh when loading finishes
  useEffect(() => {
    if (!isLoading && fileTree && Object.keys(fileTree).length > 0) {
      console.log('🔄 Preview: Loading finished, ensuring refresh...');
      setTimeout(() => {
        setKey(prev => prev + 1);
      }, 100);
    }
  }, [isLoading]);

  const viewWidths: Record<ViewMode, string> = {
    mobile: 'w-[375px] max-w-full',
    tablet: 'w-[768px] max-w-full',
    desktop: 'w-full',
    multi: 'w-full',
  };

  const refreshPreview = () => setKey(prev => prev + 1);

  const handleOpenInNewTab = () => {
    if (!fileTree) return;
    const htmlContent = generatePreviewHtml(fileTree, language);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  
  const cycleViewMode = () => {
    const modes: ViewMode[] = ['desktop', 'tablet', 'mobile'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  const viewModeData: Record<ViewMode, { icon: React.ReactNode; label: string; }> = {
    mobile: { icon: <Smartphone size={18}/>, label: t('preview.mobile', language) },
    tablet: { icon: <Tablet size={18}/>, label: t('preview.tablet', language) },
    desktop: { icon: <Monitor size={18}/>, label: t('preview.desktop', language) },
    multi: { icon: <Monitor size={18}/>, label: 'Multi' },
  };



  const generatedCode = isLoading
    ? generateLoadingHtml(language)
    : generatePreviewHtml(fileTree, language);
  const hasFiles = fileTree && Object.keys(fileTree).length > 0 && fileTree['index.html'];
  
  // Debug logs
  console.log('🎬 PreviewWindow render:', {
    isLoading,
    hasFiles,
    fileCount: fileTree ? Object.keys(fileTree).length : 0,
    hasIndexHtml: fileTree ? !!fileTree['index.html'] : false,
    files: fileTree ? Object.keys(fileTree).slice(0, 5) : [],
    generatedCodeLength: generatedCode.length
  });

  return (
    <>
      <div className="h-full flex flex-col bg-brand-bg dark:bg-dark-bg">
        <header className="flex-shrink-0 bg-white dark:bg-dark-surface border-b-2 border-slate-800 dark:border-dark-border p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
              <IconButton 
              icon={isSidebarVisibleOnDesktop ? <SidebarClose size={18}/> : <SidebarOpen size={18}/>}
              label={isSidebarVisibleOnDesktop ? t('preview.hideSidebar', language) : t('preview.showSidebar', language)}
              onClick={onToggleSidebarOnDesktop} 
              className="hidden md:flex"
            />
            <IconButton icon={<RefreshCw size={18}/>} label={t('preview.refresh', language)} onClick={refreshPreview} disabled={isLoading} />
          </div>
          
          <div className="flex items-center gap-2 rounded-lg border-2 border-slate-800 dark:border-dark-border p-1 bg-slate-200 dark:bg-slate-900">
            {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} title={viewModeData[mode].label} disabled={isLoading} className={`p-1.5 rounded-md transition-colors ${viewMode === mode ? 'bg-white dark:bg-dark-surface shadow-sm' : 'hover:bg-slate-300/50 dark:hover:bg-slate-700/50'} disabled:opacity-50 disabled:hover:bg-transparent`}>
                {viewModeData[mode].icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <IconButton icon={<Code size={18}/>} label={t('preview.code', language)} onClick={onShowCodeViewer} disabled={!hasFiles || isLoading} />
            <IconButton icon={<ExternalLink size={18}/>} label={t('preview.openInNewTab', language)} onClick={handleOpenInNewTab} disabled={!hasFiles || isLoading}/>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={!hasFiles || isLoading} onClick={onInitiatePublish} className="flex items-center gap-2 px-3 py-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-brand-coral text-slate-800 font-bold text-sm transition-colors hover:bg-brand-yellow disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-400">
                <Upload size={18}/>
                <span className="hidden sm:inline">{t('preview.publish', language)}</span>
            </motion.button>
          </div>
        </header>
        <main className="flex-grow p-2 sm:p-4 flex items-center justify-center overflow-auto">
          <div className={`h-full bg-white border-2 border-slate-800 dark:border-dark-border rounded-xl shadow-comic dark:shadow-comic-dark transition-all duration-300 ease-out-back ${viewWidths[viewMode]}`}>
            <iframe
              key={key}
              srcDoc={generatedCode}
              title="Preview"
              className="w-full h-full rounded-lg"
              sandbox="allow-scripts allow-forms allow-modals allow-popups"
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default PreviewWindow;