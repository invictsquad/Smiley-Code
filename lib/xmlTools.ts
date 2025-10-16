import { FileTree } from '../types';

// Sistema de Ferramentas XML para o Smiley Code
export class XMLToolsSystem {
  
  // Operações de Arquivo
  static readFile(path: string, fileTree: FileTree): string | null {
    console.log(`📖 read_file: ${path}`);
    return fileTree[path] || null;
  }

  static writeToFile(path: string, content: string, fileTree: FileTree): FileTree {
    console.log(`✍️ write_to_file: ${path} (${content.length} chars)`);
    return {
      ...fileTree,
      [path]: content
    };
  }

  static replaceInFile(
    path: string, 
    searchContent: string, 
    replaceContent: string, 
    fileTree: FileTree
  ): FileTree {
    console.log(`🔄 replace_in_file: ${path}`);
    
    const currentContent = fileTree[path];
    if (!currentContent) {
      console.warn(`⚠️ Arquivo não encontrado: ${path}`);
      return fileTree;
    }

    const newContent = currentContent.replace(searchContent, replaceContent);
    
    return {
      ...fileTree,
      [path]: newContent
    };
  }

  static deleteFile(path: string, fileTree: FileTree): FileTree {
    console.log(`🗑️ delete_file: ${path}`);
    const newFileTree = { ...fileTree };
    delete newFileTree[path];
    return newFileTree;
  }

  static listFiles(path: string, fileTree: FileTree, recursive: boolean = false): string[] {
    console.log(`📂 list_files: ${path} (recursive: ${recursive})`);
    
    const files = Object.keys(fileTree);
    
    if (path === '.' || path === '/') {
      return files;
    }

    // Filtrar arquivos que começam com o caminho especificado
    const filteredFiles = files.filter(file => {
      if (recursive) {
        return file.startsWith(path);
      } else {
        const relativePath = file.replace(path + '/', '');
        return file.startsWith(path) && !relativePath.includes('/');
      }
    });

    return filteredFiles;
  }

  // Comandos do Shell (simulados)
  static executeCommand(command: string): { success: boolean; output: string } {
    console.log(`⚡ execute_command: ${command}`);
    
    // Simular comandos comuns
    switch (command.toLowerCase()) {
      case 'npm install':
        return {
          success: true,
          output: 'Dependencies installed successfully'
        };
      
      case 'npm run build':
        return {
          success: true,
          output: 'Build completed successfully'
        };
      
      case 'npm run dev':
        return {
          success: true,
          output: 'Development server started'
        };
      
      default:
        return {
          success: true,
          output: `Command executed: ${command}`
        };
    }
  }

  // Interação com o Navegador (simulada)
  static browserAction(action: string, url?: string): { success: boolean; message: string } {
    console.log(`🌐 browser_action: ${action} ${url || ''}`);
    
    switch (action) {
      case 'launch':
        return {
          success: true,
          message: `Browser launched with URL: ${url}`
        };
      
      case 'navigate':
        return {
          success: true,
          message: `Navigated to: ${url}`
        };
      
      case 'screenshot':
        return {
          success: true,
          message: 'Screenshot captured'
        };
      
      default:
        return {
          success: true,
          message: `Browser action completed: ${action}`
        };
    }
  }

  // Processamento de XML Tools
  static processXMLTools(xmlContent: string, fileTree: FileTree): {
    newFileTree: FileTree;
    actions: string[];
    success: boolean;
  } {
    const actions: string[] = [];
    let currentFileTree = { ...fileTree };
    let success = true;

    try {
      // Processar read_file
      const readFileMatches = xmlContent.match(/<read_file>\s*<path>(.*?)<\/path>\s*<\/read_file>/gs);
      if (readFileMatches) {
        readFileMatches.forEach(match => {
          const pathMatch = match.match(/<path>(.*?)<\/path>/);
          if (pathMatch) {
            const path = pathMatch[1];
            const content = this.readFile(path, currentFileTree);
            actions.push(`Read file: ${path} ${content ? '✅' : '❌'}`);
          }
        });
      }

      // Processar write_to_file
      const writeFileMatches = xmlContent.match(/<write_to_file>\s*<path>(.*?)<\/path>\s*<content>([\s\S]*?)<\/content>\s*<\/write_to_file>/gs);
      if (writeFileMatches) {
        writeFileMatches.forEach(match => {
          const pathMatch = match.match(/<path>(.*?)<\/path>/);
          const contentMatch = match.match(/<content>([\s\S]*?)<\/content>/);
          
          if (pathMatch && contentMatch) {
            const path = pathMatch[1];
            const content = contentMatch[1];
            currentFileTree = this.writeToFile(path, content, currentFileTree);
            actions.push(`Wrote file: ${path}`);
          }
        });
      }

      // Processar replace_in_file
      const replaceFileMatches = xmlContent.match(/<replace_in_file>\s*<path>(.*?)<\/path>\s*<diff>([\s\S]*?)<\/diff>\s*<\/replace_in_file>/gs);
      if (replaceFileMatches) {
        replaceFileMatches.forEach(match => {
          const pathMatch = match.match(/<path>(.*?)<\/path>/);
          const diffMatch = match.match(/<diff>([\s\S]*?)<\/diff>/);
          
          if (pathMatch && diffMatch) {
            const path = pathMatch[1];
            const diff = diffMatch[1];
            
            // Processar formato diff
            const searchMatch = diff.match(/<<<<<<< SEARCH([\s\S]*?)=======/);
            const replaceMatch = diff.match(/=======([\s\S]*?)>>>>>>> REPLACE/);
            
            if (searchMatch && replaceMatch) {
              const searchContent = searchMatch[1].trim();
              const replaceContent = replaceMatch[1].trim();
              currentFileTree = this.replaceInFile(path, searchContent, replaceContent, currentFileTree);
              actions.push(`Replaced content in: ${path}`);
            }
          }
        });
      }

      // Processar delete_file
      const deleteFileMatches = xmlContent.match(/<delete_file>\s*<path>(.*?)<\/path>\s*<\/delete_file>/gs);
      if (deleteFileMatches) {
        deleteFileMatches.forEach(match => {
          const pathMatch = match.match(/<path>(.*?)<\/path>/);
          if (pathMatch) {
            const path = pathMatch[1];
            currentFileTree = this.deleteFile(path, currentFileTree);
            actions.push(`Deleted file: ${path}`);
          }
        });
      }

      // Processar list_files
      const listFilesMatches = xmlContent.match(/<list_files>\s*<path>(.*?)<\/path>(?:\s*<recursive>(.*?)<\/recursive>)?\s*<\/list_files>/gs);
      if (listFilesMatches) {
        listFilesMatches.forEach(match => {
          const pathMatch = match.match(/<path>(.*?)<\/path>/);
          const recursiveMatch = match.match(/<recursive>(.*?)<\/recursive>/);
          
          if (pathMatch) {
            const path = pathMatch[1];
            const recursive = recursiveMatch ? recursiveMatch[1] === 'true' : false;
            const files = this.listFiles(path, currentFileTree, recursive);
            actions.push(`Listed files in: ${path} (${files.length} files)`);
          }
        });
      }

      // Processar execute_command
      const executeCommandMatches = xmlContent.match(/<execute_command>\s*<command>(.*?)<\/command>(?:\s*<requires_approval>(.*?)<\/requires_approval>)?\s*<\/execute_command>/gs);
      if (executeCommandMatches) {
        executeCommandMatches.forEach(match => {
          const commandMatch = match.match(/<command>(.*?)<\/command>/);
          if (commandMatch) {
            const command = commandMatch[1];
            const result = this.executeCommand(command);
            actions.push(`Executed command: ${command} ${result.success ? '✅' : '❌'}`);
          }
        });
      }

      // Processar browser_action
      const browserActionMatches = xmlContent.match(/<browser_action>\s*<action>(.*?)<\/action>(?:\s*<url>(.*?)<\/url>)?\s*<\/browser_action>/gs);
      if (browserActionMatches) {
        browserActionMatches.forEach(match => {
          const actionMatch = match.match(/<action>(.*?)<\/action>/);
          const urlMatch = match.match(/<url>(.*?)<\/url>/);
          
          if (actionMatch) {
            const action = actionMatch[1];
            const url = urlMatch ? urlMatch[1] : undefined;
            const result = this.browserAction(action, url);
            actions.push(`Browser action: ${action} ${result.success ? '✅' : '❌'}`);
          }
        });
      }

    } catch (error) {
      console.error('Erro ao processar XML tools:', error);
      success = false;
      actions.push(`Error processing XML tools: ${error}`);
    }

    return {
      newFileTree: currentFileTree,
      actions,
      success
    };
  }

  // Gerar XML de exemplo para demonstração
  static generateExampleXML(): string {
    return `
<!-- Exemplo de uso das ferramentas XML do Smiley Code -->

<!-- Ler um arquivo -->
<read_file>
<path>index.html</path>
</read_file>

<!-- Escrever um novo arquivo -->
<write_to_file>
<path>styles/main.css</path>
<content>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
</content>
</write_to_file>

<!-- Substituir conteúdo em um arquivo -->
<replace_in_file>
<path>index.html</path>
<diff>
<<<<<<< SEARCH
<title>Old Title</title>
=======
<title>New Amazing Title</title>
>>>>>>> REPLACE
</diff>
</replace_in_file>

<!-- Listar arquivos -->
<list_files>
<path>scripts</path>
<recursive>true</recursive>
</list_files>

<!-- Executar comando -->
<execute_command>
<command>npm install</command>
<requires_approval>false</requires_approval>
</execute_command>

<!-- Ação do navegador -->
<browser_action>
<action>launch</action>
<url>http://localhost:3000</url>
</browser_action>
`;
  }
}

// Utilitários para trabalhar com XML
export class XMLUtils {
  static escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  static unescapeXML(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  static formatXML(xml: string): string {
    const PADDING = ' '.repeat(2);
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');

    return xml.split('\r\n').map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      pad += indent;
      return PADDING.repeat(pad - indent) + node;
    }).join('\r\n');
  }
}