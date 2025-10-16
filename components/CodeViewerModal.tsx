import { useState, useEffect } from 'react';
import { FileTree, Language } from '../types';
import { X, FileText, Search, Save, Trash2, FileArchive, Code2, Wand2, FilePenLine } from 'lucide-react';
import { t } from '../lib/i18n';

// --- START OF FORMATTING LOGIC ---
// Basic code formatters for HTML, CSS, and JS.
// These are simple implementations and may not cover all edge cases.

const formatHtml = (code: string): string => {
    const indentChar = '  '; // two spaces
    let indentLevel = 0;
    const lines = code.split('\n');
    let formattedCode = '';
    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length === 0) continue;

        if (line.startsWith('</')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        formattedCode += indentChar.repeat(indentLevel) + line + '\n';
        
        const openTagMatch = line.match(/^<([a-z0-9]+)/i);
        const isSelfClosing = line.endsWith('/>') || (openTagMatch && selfClosingTags.includes(openTagMatch[1].toLowerCase()));
        
        if (line.startsWith('<') && !line.startsWith('</') && !line.startsWith('<!') && !isSelfClosing) {
            indentLevel++;
        }
    }
    return formattedCode.trim();
};

const formatCssOrJs = (code: string): string => {
    let indentLevel = 0;
    const indent = '  ';
    
    // Add newlines to split single-line rules/statements for better processing
    let processedCode = code.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '\n}\n');

    const lines = processedCode.split('\n');
    let formattedCode = '';

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed === '}') {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        formattedCode += indent.repeat(indentLevel) + trimmed + '\n';

        if (trimmed.endsWith('{')) {
            indentLevel++;
        }
    }
    // Clean up potential excessive newlines
    return formattedCode.replace(/\n\n/g, '\n').trim();
}

const formatCode = (path: string, content: string): string => {
  try {
    const extension = path.split('.').pop();
    switch (extension) {
      case 'html':
        return formatHtml(content);
      case 'css':
      case 'js':
        return formatCssOrJs(content);
      default:
        return content;
    }
  } catch (e) {
    console.error("Formatting failed for", path, e);
    return content;
  }
};
// --- END OF FORMATTING LOGIC ---


interface CodeViewerModalProps {
  fileTree: FileTree;
  onClose: () => void;
  language: Language;
  onSaveFile: (path: string, content: string) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
}

const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ fileTree, onClose, language, onSaveFile, onDeleteFile, onRenameFile }) => {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const filePaths = Object.keys(fileTree).sort();

  useEffect(() => {
    const defaultFile = filePaths.find(p => p.toLowerCase() === 'index.html') || filePaths[0];
    if (defaultFile) {
      setSelectedFile(defaultFile);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    if (selectedFile && fileTree[selectedFile] !== undefined) {
      setEditedContent(fileTree[selectedFile]);
    } else {
      setEditedContent('');
    }
  }, [selectedFile, fileTree]);
  
  const handleSave = () => {
    if (selectedFile) {
      onSaveFile(selectedFile, editedContent);
    }
  };

  const handleDelete = () => {
    if (selectedFile && window.confirm(t('codeViewer.confirmDelete', language, { fileName: selectedFile }))) {
      onDeleteFile(selectedFile);
      const currentIndex = filteredFilePaths.findIndex(p => p === selectedFile);
      setSelectedFile(filteredFilePaths[currentIndex - 1] || filteredFilePaths[0] || '');
    }
  };

  const handleFormatCode = () => {
    if (selectedFile) {
      const formattedContent = formatCode(selectedFile, editedContent);
      setEditedContent(formattedContent);
    }
  };

  const handleRename = () => {
    if (selectedFile) {
      const newName = prompt(t('codeViewer.enterNewName', language, { fileName: selectedFile }), selectedFile);
      if (newName && newName.trim() && newName !== selectedFile) {
        onRenameFile(selectedFile, newName.trim());
        setSelectedFile(newName.trim());
      }
    }
  };
  
  const handleDownloadZip = () => {
    if (!fileTree || filePaths.length === 0 || !window.JSZip) return;
    
    const zip = new window.JSZip();
    Object.keys(fileTree).forEach(path => {
      zip.file(path, fileTree[path]);
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'friendly-app.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const filteredFilePaths = filePaths.filter(path =>
    path.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isDirty = selectedFile && fileTree[selectedFile] !== editedContent;
  const isFormattable = selectedFile && (selectedFile.endsWith('.html') || selectedFile.endsWith('.css') || selectedFile.endsWith('.js'));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div 
        className="w-[95vw] max-w-6xl h-[90vh] bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-xl shadow-comic dark:shadow-comic-dark flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b-2 border-slate-800 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <Code2 size={28} className="text-brand-coral"/>
            <h2 className="font-display text-2xl sm:text-3xl text-slate-800 dark:text-dark-text truncate">{t('codeViewer.title', language)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={filePaths.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-brand-teal text-slate-800 hover:bg-brand-teal/80 active:shadow-none transition-all ease-out-back active:translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileArchive size={16}/> <span className="hidden sm:inline">{t('codeViewer.downloadZip', language)}</span>
            </button>
            <button onClick={onClose} className="p-2 border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-white dark:bg-dark-surface hover:bg-red-400 active:shadow-none transition-all ease-out-back active:translate-y-0.5">
              <X size={20} />
            </button>
          </div>
        </header>
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {filePaths.length === 0 ? (
              <div className="w-full flex items-center justify-center text-center text-slate-500 dark:text-slate-400 p-8">
                <p className="text-lg">{t('codeViewer.noCode', language)}</p>
              </div>
          ) : (
            <>
              {/* File Tree Sidebar */}
              <aside className="w-full h-1/3 md:w-1/4 md:h-full border-b-2 md:border-b-0 md:border-r-2 border-slate-800 dark:border-dark-border flex flex-col bg-slate-50 dark:bg-slate-900/50">
                <div className="p-3 border-b-2 border-slate-800 dark:border-dark-border">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder={t('codeViewer.searchFiles', language)}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-2 py-1.5 text-sm bg-white dark:bg-dark-surface border-2 border-slate-800 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  </div>
                </div>
                <ul className="flex-grow overflow-y-auto p-2">
                {filteredFilePaths.map(path => (
                  <li key={path}>
                  <button
                    onClick={() => setSelectedFile(path)}
                    className={`w-full text-left p-2 rounded-md flex items-center gap-2.5 text-sm transition-colors duration-100 ${selectedFile === path ? 'bg-brand-yellow font-bold text-slate-800' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    <FileText size={16} className="flex-shrink-0"/>
                    <span className="truncate">{path}</span>
                  </button>
                  </li>
                ))}
                </ul>
              </aside>
              
              {/* Code Editor */}
              <main className="w-full h-2/3 md:w-3/4 md:h-full flex flex-col bg-white dark:bg-dark-surface">
                {selectedFile ? (
                  <>
                    <div className="flex-shrink-0 flex items-center justify-between p-2.5 border-b-2 border-slate-800 dark:border-dark-border bg-slate-50 dark:bg-slate-900/50">
                      <span className="font-bold font-mono truncate text-slate-600 dark:text-slate-300">{selectedFile}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={handleRename} className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-white dark:bg-dark-surface hover:bg-brand-yellow active:shadow-none transition-all ease-out-back active:translate-y-0.5">
                          <FilePenLine size={16}/> <span className="hidden sm:inline">{t('codeViewer.rename', language)}</span>
                        </button>
                        <button onClick={handleFormatCode} disabled={!isFormattable} className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-brand-teal text-slate-800 hover:bg-brand-teal/80 active:shadow-none transition-all ease-out-back active:translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed">
                          <Wand2 size={16}/> <span className="hidden sm:inline">{t('codeViewer.formatCode', language)}</span>
                        </button>
                        <button onClick={handleSave} disabled={!isDirty} className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-brand-green text-slate-800 hover:bg-brand-green/80 active:shadow-none transition-all ease-out-back active:translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed">
                          <Save size={16}/> <span className="hidden sm:inline">{t('codeViewer.save', language)}</span>
                        </button>
                        <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold border-2 border-slate-800 dark:border-dark-border rounded-lg shadow-comic-sm bg-brand-coral text-white hover:bg-red-600 active:shadow-none transition-all ease-out-back active:translate-y-0.5">
                          <Trash2 size={16}/> <span className="hidden sm:inline">{t('codeViewer.delete', language)}</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={editedContent}
                      onChange={e => setEditedContent(e.target.value)}
                      className="w-full h-full p-4 text-sm font-mono bg-transparent focus:outline-none resize-none"
                      spellCheck="false"
                    />
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-slate-500">{t('codeViewer.prompt', language)}</div>
                )}
              </main>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeViewerModal;