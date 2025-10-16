import { useState, useEffect, useCallback } from 'react';
import { Project, Message, FileTree, Version, Language } from '../types';
import ChatSidebar from './ChatSidebar';
import PreviewWindow from './PreviewWindow';
import CodeViewerModal from './CodeViewerModal';
import PublishModal from './PublishModal';
import GitHubDeployModal from './GitHubDeployModal';
import AnalysisPanel from './AnalysisPanel';
import EnhancedAnalysisPanel from './EnhancedAnalysisPanel';
import { t } from '../lib/i18n';
import { RealDataIntegrator, popularDataSources } from '../lib/realDataIntegration';
import { ProjectNameGenerator } from '../lib/projectNameGenerator';
import { AutoVersioningSystem } from '../lib/autoVersioning';
import { IconLibraryManager } from '../lib/iconLibrary';
import { SmartTypographyManager } from '../lib/smartTypography';
import { DarkModeGenerator } from '../lib/darkModeGenerator';
import { AnimationLibrary } from '../lib/animationLibrary';
import { GradientGenerator } from '../lib/gradientGenerator';

// Novos sistemas implementados
import { smileyCodeAI } from '../lib/smileyCodeAI';
import { workflowSystem, WorkflowMode } from '../lib/workflowSystem';
import { XMLToolsSystem } from '../lib/xmlTools';
import { CodingGuidelines, AutoCodeImprovement } from '../lib/codingGuidelines';
import { conversationMemory } from '../lib/conversationMemory';

interface EditorPageProps {
    initialProject: Project;
    onSaveAndExit: (updatedProject: Project) => void;
    theme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    initialPrompt: string | null;
    initialImages: { data: string; mimeType: string; }[] | null;
}

const EditorPage: React.FC<EditorPageProps> = ({
    initialProject,
    onSaveAndExit,
    theme,
    onThemeChange,
    language,
    onLanguageChange,
    initialPrompt,
    initialImages,
}) => {
    const [project, setProject] = useState<Project>(initialProject);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // History for Undo/Redo
    const [history, setHistory] = useState<{ fileTree: FileTree }[]>([{ fileTree: initialProject.fileTree }]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

    // Version History
    const [versionHistory, setVersionHistory] = useState<Version[]>([]);

    // UI State
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
    const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);

    // Novos estados para o sistema aprimorado
    const [currentWorkflowMode, setCurrentWorkflowMode] = useState<WorkflowMode>('DISCUSSION');
    const [pendingPlan, setPendingPlan] = useState<string[] | null>(null);
    const [codeAnalysis, setCodeAnalysis] = useState<any>(null);
    const [showPlanApproval, setShowPlanApproval] = useState(false);

    const updateFileTree = useCallback((newFileTree: FileTree, actionName?: string, aiMessage?: string) => {
        const oldFileTree = project.fileTree;

        console.log('🔄 updateFileTree called:', {
            actionName,
            oldFileCount: Object.keys(oldFileTree).length,
            newFileCount: Object.keys(newFileTree).length,
            hasIndexHtml: !!newFileTree['index.html'],
            newFiles: Object.keys(newFileTree),
            fileTreeContent: newFileTree
        });

        console.log('🔄 Atualizando projeto com nova fileTree...');
        setProject(p => {
            const updatedProject = { ...p, fileTree: newFileTree };
            console.log('✅ Projeto atualizado:', {
                projectId: updatedProject.id,
                fileCount: Object.keys(updatedProject.fileTree).length,
                files: Object.keys(updatedProject.fileTree)
            });
            return updatedProject;
        });

        const newHistory = history.slice(0, currentHistoryIndex + 1);
        newHistory.push({ fileTree: newFileTree });
        setHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);

        // Sistema de versionamento automático
        const analysis = AutoVersioningSystem.analyzeChanges(oldFileTree, newFileTree, aiMessage || actionName);

        // Sempre criar versão para mudanças significativas
        if (AutoVersioningSystem.shouldCreateVersion(analysis) || actionName) {
            const autoVersion = AutoVersioningSystem.createAutoVersion(
                oldFileTree,
                newFileTree,
                aiMessage || actionName,
                versionHistory.length + 1
            );

            // Se foi fornecido um actionName manual, usar ele
            if (actionName && !aiMessage) {
                autoVersion.name = actionName;
                autoVersion.metadata = {
                    ...autoVersion.metadata,
                    isAutoGenerated: false
                };
            }

            setVersionHistory(prev => [autoVersion, ...prev]);
        }
    }, [history, currentHistoryIndex, project.fileTree, versionHistory.length]);


    const handleUndo = () => {
        if (currentHistoryIndex > 0) {
            const newIndex = currentHistoryIndex - 1;
            setCurrentHistoryIndex(newIndex);
            setProject(p => ({ ...p, fileTree: history[newIndex].fileTree }));
        }
    };

    const handleRedo = () => {
        if (currentHistoryIndex < history.length - 1) {
            const newIndex = currentHistoryIndex + 1;
            setCurrentHistoryIndex(newIndex);
            setProject(p => ({ ...p, fileTree: history[newIndex].fileTree }));
        }
    };

    const canUndo = currentHistoryIndex > 0;
    const canRedo = currentHistoryIndex < history.length - 1;

    // Set initial message and trigger first generation if there is an initial prompt
    useEffect(() => {
        // Inicializar contexto de conversa
        const context = conversationMemory.initializeContext(initialProject);
        
        // Criar versão inicial do projeto
        if (versionHistory.length === 0) {
            const initialVersion: Version = {
                id: 'initial-v0',
                name: 'Projeto criado',
                createdAt: new Date(),
                fileTree: initialProject.fileTree,
                metadata: {
                    changeType: 'creation',
                    severity: 'major',
                    filesChanged: Object.keys(initialProject.fileTree),
                    isAutoGenerated: true
                }
            };
            setVersionHistory([initialVersion]);
        }

        const initialMessage: Message = {
            id: 'init',
            role: 'assistant',
            text: t('editor.initialMessage', language)
        };
        
        // Adicionar mensagem inicial à memória
        conversationMemory.addMessage(initialProject.id, initialMessage);
        
        if (initialPrompt) {
            const userMessage: Message = {
                id: 'init-user',
                role: 'user',
                text: initialPrompt,
                images: initialImages || undefined
            };
            setMessages([initialMessage]);
            // We pass the message directly to handleSendMessage instead of setting state first
            // to avoid race conditions and ensure the function has the latest data.
            handleSendMessage(userMessage, false, false, true);
        } else {
            setMessages([initialMessage]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parseAndApplyFileChanges = (aiResponseText: string, isFirstMessage: boolean) => {
        // Updated regex to be more flexible and handle potential whitespace variations.
        const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
            // FIX: Corrected typo from `aiResponse-text` to `aiResponseText` to use the function parameter.
            return { text: aiResponseText, plan: undefined, fileChanges: undefined, success: true };
        }

        try {
            let jsonString = jsonMatch[1].trim();

            // Check if JSON is truncated and try to fix common issues
            if (!jsonString.endsWith('}')) {
                console.warn('JSON appears to be truncated, attempting to fix...');

                // Try to find the last complete object structure
                let braceCount = 0;
                let lastValidIndex = -1;

                for (let i = 0; i < jsonString.length; i++) {
                    if (jsonString[i] === '{') braceCount++;
                    if (jsonString[i] === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            lastValidIndex = i;
                        }
                    }
                }

                if (lastValidIndex > 0) {
                    jsonString = jsonString.substring(0, lastValidIndex + 1);
                    console.log('Truncated JSON fixed, attempting to parse...');
                } else {
                    // If we can't fix it, try to extract at least the message
                    const messageMatch = jsonString.match(/"message"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
                    if (messageMatch) {
                        return {
                            text: messageMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
                            plan: undefined,
                            fileChanges: undefined,
                            success: true
                        };
                    }
                    throw new Error('JSON is severely malformed and cannot be recovered');
                }
            }

            const parsed = JSON.parse(jsonString);
            const newFileTree = { ...(isFirstMessage ? {} : project.fileTree) };
            let updatedFiles: string[] = [];

            console.log('📝 Processing AI response:', {
                hasFileChanges: !!parsed.file_changes,
                fileChangesType: typeof parsed.file_changes,
                fileChangesKeys: parsed.file_changes ? Object.keys(parsed.file_changes) : []
            });

            if (parsed.file_changes && typeof parsed.file_changes === 'object') {
                for (const [path, content] of Object.entries(parsed.file_changes)) {
                    if (content === null || content === 'DELETE') {
                        delete newFileTree[path];
                        console.log(`🗑️ Deleted file: ${path}`);
                    } else {
                        newFileTree[path] = content as string;
                        console.log(`📄 Added/Updated file: ${path} (${(content as string).length} chars)`);
                    }
                    updatedFiles.push(path);
                }
            }

            console.log('📁 Final fileTree:', {
                totalFiles: Object.keys(newFileTree).length,
                hasIndexHtml: !!newFileTree['index.html'],
                indexHtmlLength: newFileTree['index.html'] ? newFileTree['index.html'].length : 0,
                files: Object.keys(newFileTree)
            });

            if (updatedFiles.length > 0) {
                updateFileTree(newFileTree, parsed.message, aiResponseText);
            } else {
                console.warn('⚠️ No files were updated from AI response');
            }

            return {
                text: parsed.message || t('editor.updateSuccess', language),
                plan: parsed.plan,
                fileChanges: updatedFiles.length > 0 ? updatedFiles : undefined,
                success: true
            };
        } catch (error) {
            console.error('Failed to parse AI response JSON:', error);
            console.error('Raw JSON length:', jsonMatch[1].length);
            console.error('Raw JSON preview (first 500 chars):', jsonMatch[1].substring(0, 500));
            console.error('Raw JSON preview (last 500 chars):', jsonMatch[1].substring(Math.max(0, jsonMatch[1].length - 500)));

            // Try to extract file_changes even from malformed JSON
            const fileChangesMatch = jsonMatch[1].match(/"file_changes"\s*:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
            if (fileChangesMatch) {
                console.log('🔧 Attempting to recover file_changes from malformed JSON');
                try {
                    const fileChangesJson = `{"file_changes": {${fileChangesMatch[1]}}}`;
                    const recovered = JSON.parse(fileChangesJson);

                    const newFileTree = { ...(isFirstMessage ? {} : project.fileTree) };
                    let updatedFiles: string[] = [];

                    for (const [path, content] of Object.entries(recovered.file_changes)) {
                        if (content !== null && content !== 'DELETE') {
                            newFileTree[path] = content as string;
                            updatedFiles.push(path);
                        }
                    }

                    if (updatedFiles.length > 0) {
                        updateFileTree(newFileTree, 'Recovered from malformed JSON', aiResponseText);
                        return {
                            text: 'Código gerado com sucesso (recuperado de JSON malformado)',
                            success: true,
                            fileChanges: updatedFiles
                        };
                    }
                } catch (recoveryError) {
                    console.error('Failed to recover file_changes:', recoveryError);
                }
            }

            // Try to extract just the message for user feedback
            const messageMatch = jsonMatch[1].match(/"message"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
            const extractedMessage = messageMatch ?
                messageMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') :
                'Erro ao processar resposta da IA. O JSON retornado está malformado.';

            return {
                text: extractedMessage,
                success: false
            };
        }
    };

    // Método auxiliar para detectar tipo de projeto
    const detectProjectType = (prompt: string, fileTree: FileTree): string => {
        const text = prompt.toLowerCase();
        const htmlContent = fileTree['index.html']?.toLowerCase() || '';

        if (text.includes('portfolio') || htmlContent.includes('portfolio')) return 'portfolio';
        if (text.includes('blog') || htmlContent.includes('blog')) return 'blog';
        if (text.includes('ecommerce') || text.includes('shop') || text.includes('store')) return 'ecommerce';
        if (text.includes('dashboard') || text.includes('admin')) return 'dashboard';
        if (text.includes('landing') || text.includes('marketing')) return 'landing';
        if (text.includes('business') || text.includes('corporate')) return 'business';
        if (text.includes('creative') || text.includes('agency')) return 'creative';

        return 'tech'; // default
    };

    const handleSendMessage = async (message: Message, isSeniorMode: boolean, isDiscussionMode = false, isFirstMessage = false) => {
        console.log('🚀 Processando mensagem com sistema aprimorado do Smiley Code');
        
        setMessages(prev => [...prev, message]);
        setIsLoading(true);

        try {
            // Usar o novo sistema de workflow com memória
            const workflowResult = await workflowSystem.processMessage(
                message,
                project.fileTree,
                language,
                isSeniorMode,
                project.id,
                isDiscussionMode
            );

            console.log('📋 Resultado do workflow:', {
                mode: workflowResult.mode,
                success: workflowResult.success,
                hasPlan: !!workflowResult.plan,
                hasFileChanges: !!workflowResult.fileChanges,
                needsApproval: workflowResult.needsApproval
            });

            // Atualizar estado do workflow
            setCurrentWorkflowMode(workflowResult.mode);

            // Processar resultado baseado no modo
            if (workflowResult.mode === 'PLAN' && workflowResult.plan && workflowResult.needsApproval) {
                // MODO DE PLANO - Mostrar plano para aprovação
                setPendingPlan(workflowResult.plan);
                setShowPlanApproval(true);
                
                const planMessage: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    text: workflowResult.response,
                    plan: workflowResult.plan
                };
                setMessages(prev => [...prev, planMessage]);

            } else if (workflowResult.mode === 'ACTION' && workflowResult.fileChanges) {
                // MODO DE AÇÃO - Aplicar mudanças nos arquivos
                console.log('🔧 Aplicando mudanças de arquivos:', workflowResult.fileChanges);
                
                const newFileTree = { ...project.fileTree };
                let updatedFiles: string[] = [];

                // Aplicar mudanças de arquivos
                Object.entries(workflowResult.fileChanges).forEach(([path, content]) => {
                    if (content === null) {
                        delete newFileTree[path];
                        console.log(`🗑️ Arquivo deletado: ${path}`);
                    } else {
                        newFileTree[path] = content;
                        console.log(`📄 Arquivo atualizado: ${path} (${content.length} chars)`);
                    }
                    updatedFiles.push(path);
                });

                console.log('📁 FileTree antes da atualização:', Object.keys(project.fileTree));
                console.log('📁 FileTree depois da atualização:', Object.keys(newFileTree));

                if (updatedFiles.length > 0) {
                    updateFileTree(newFileTree, workflowResult.response);
                    console.log('✅ updateFileTree chamado com sucesso');
                } else {
                    console.warn('⚠️ Nenhum arquivo foi atualizado');
                }

                const actionMessage: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    text: workflowResult.response,
                    fileChanges: updatedFiles,
                    plan: workflowResult.plan
                };
                setMessages(prev => [...prev, actionMessage]);

            } else {
                // MODO DE DISCUSSÃO - Apenas resposta conversacional
                const discussionMessage: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    text: workflowResult.response
                };
                setMessages(prev => [...prev, discussionMessage]);
            }

            // Auto-enhance project with modern features se houver mudanças de arquivos
            if (workflowResult.mode === 'ACTION' && workflowResult.fileChanges) {
                await applyAutoEnhancements(workflowResult.response, isFirstMessage);
            }

            // Sugerir nome melhor para o projeto se é a primeira mensagem
            if (isFirstMessage && message.text && workflowResult.fileChanges) {
                try {
                    const suggestedName = await ProjectNameGenerator.generateProjectName(message.text);
                    if (suggestedName && suggestedName !== project.name) {
                        setProject(p => ({ ...p, name: suggestedName }));

                        // Adicionar mensagem sobre a atualização do nome
                        const nameUpdateMessage: Message = {
                            id: `name-update-${Date.now()}`,
                            role: 'assistant',
                            text: t('editor.projectNameUpdated', language, { newName: suggestedName })
                        };
                        setMessages(prev => [...prev, nameUpdateMessage]);
                    }
                } catch (error) {
                    console.warn('Failed to generate better project name:', error);
                }
            }

        } catch (error) {
            console.error('Erro no sistema Smiley Code:', error);
            const errorMessage: Message = {
                id: 'error-' + Date.now(),
                role: 'assistant',
                text: t('editor.genericError', language),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para aplicar melhorias automáticas
    const applyAutoEnhancements = async (aiMessage: string, isFirstMessage: boolean) => {
        let enhancedFileTree = { ...project.fileTree };
        let enhancements: string[] = [];

        // 1. Real Data Integration
        const needsData = aiMessage.toLowerCase().includes('data') ||
            aiMessage.toLowerCase().includes('api') ||
            aiMessage.toLowerCase().includes('fetch') ||
            enhancedFileTree['index.html']?.includes('blog') ||
            enhancedFileTree['index.html']?.includes('portfolio') ||
            enhancedFileTree['index.html']?.includes('gallery');

        if (needsData && !enhancedFileTree['scripts/data-service.js']) {
            enhancedFileTree = RealDataIntegrator.injectDataFetching(enhancedFileTree, popularDataSources);
            enhancements.push('Real data integration');
        }

        // 2. Smart Typography
        const needsTypography = isFirstMessage ||
            aiMessage.toLowerCase().includes('font') ||
            aiMessage.toLowerCase().includes('typography') ||
            aiMessage.toLowerCase().includes('text');

        if (needsTypography && !enhancedFileTree['styles/typography.css']) {
            const projectType = detectProjectType(aiMessage, enhancedFileTree);
            const suggestions = SmartTypographyManager.suggestTypography(aiMessage, projectType);
            if (suggestions.length > 0) {
                enhancedFileTree = SmartTypographyManager.injectTypography(enhancedFileTree, suggestions[0]);
                enhancements.push('Smart typography');
            }
        }

        // 3. Dark Mode
        const needsDarkMode = isFirstMessage && !enhancedFileTree['scripts/dark-mode.js'];
        if (needsDarkMode) {
            enhancedFileTree = DarkModeGenerator.injectDarkMode(enhancedFileTree);
            enhancements.push('Dark mode support');
        }

        // 4. Animations
        const needsAnimations = aiMessage.toLowerCase().includes('animation') ||
            aiMessage.toLowerCase().includes('hover') ||
            aiMessage.toLowerCase().includes('transition') ||
            (isFirstMessage && enhancedFileTree['index.html']?.includes('button'));

        if (needsAnimations && !enhancedFileTree['styles/animations.css']) {
            const projectType = detectProjectType(aiMessage, enhancedFileTree);
            const suggestedAnimations = AnimationLibrary.suggestAnimationsForProject(projectType);
            enhancedFileTree = AnimationLibrary.injectAnimations(enhancedFileTree, suggestedAnimations);
            enhancements.push('Modern animations');
        }

        // 5. Gradients
        const needsGradients = aiMessage.toLowerCase().includes('gradient') ||
            aiMessage.toLowerCase().includes('background') ||
            aiMessage.toLowerCase().includes('visual') ||
            (isFirstMessage && aiMessage.toLowerCase().includes('modern'));

        if (needsGradients && !enhancedFileTree['styles/gradients.css']) {
            const projectType = detectProjectType(aiMessage, enhancedFileTree);
            const suggestedGradients = GradientGenerator.suggestGradientsForProject(projectType);
            enhancedFileTree = GradientGenerator.injectGradients(enhancedFileTree, suggestedGradients);
            enhancements.push('Modern gradients');
        }

        // 6. Icon Library
        const needsIcons = aiMessage.toLowerCase().includes('icon') ||
            aiMessage.toLowerCase().includes('navigation') ||
            (isFirstMessage && enhancedFileTree['index.html']?.includes('nav'));

        if (needsIcons && !enhancedFileTree['docs/icons.md']) {
            enhancedFileTree = IconLibraryManager.injectIconLibrary(enhancedFileTree, IconLibraryManager.lucideIcons.slice(0, 10));
            enhancements.push('Icon library');
        }

        // 7. Aplicar melhorias automáticas de código
        const { improvedFileTree, changesApplied } = AutoCodeImprovement.applyBasicImprovements(enhancedFileTree);
        if (changesApplied.length > 0) {
            enhancedFileTree = improvedFileTree;
            enhancements.push(...changesApplied);
        }

        // Aplicar melhorias se houver
        if (enhancements.length > 0) {
            updateFileTree(enhancedFileTree, `Enhanced with: ${enhancements.join(', ')}`);
            
            // Mostrar mensagem sobre melhorias aplicadas
            const enhancementMessage: Message = {
                id: `enhancement-${Date.now()}`,
                role: 'assistant',
                text: `✨ Apliquei melhorias automáticas: ${enhancements.join(', ')}`
            };
            setMessages(prev => [...prev, enhancementMessage]);
        }
    };

    // Função para aprovar plano
    const handleApprovePlan = async () => {
        if (pendingPlan) {
            workflowSystem.approvePlan();
            setShowPlanApproval(false);
            setPendingPlan(null);
            
            // Executar o plano aprovado
            const executeMessage: Message = {
                id: `execute-plan-${Date.now()}`,
                role: 'user',
                text: 'Executar o plano aprovado'
            };
            
            await handleSendMessage(executeMessage, false, false, false);
        }
    };

    // Função para rejeitar plano
    const handleRejectPlan = () => {
        workflowSystem.rejectPlan();
        setShowPlanApproval(false);
        setPendingPlan(null);
        
        const rejectMessage: Message = {
            id: `reject-plan-${Date.now()}`,
            role: 'assistant',
            text: 'Plano rejeitado. Vamos tentar uma abordagem diferente. O que você gostaria de modificar?'
        };
        setMessages(prev => [...prev, rejectMessage]);
    };

    // Função para análise de código
    const handleAnalyzeCode = async () => {
        try {
            const analysis = CodingGuidelines.analyzeProject(project.fileTree);
            setCodeAnalysis(analysis);
            setIsAnalysisPanelOpen(true);
            
            const analysisMessage: Message = {
                id: `analysis-${Date.now()}`,
                role: 'assistant',
                text: `📊 Análise do código concluída! Pontuação geral: ${analysis.overallScore}/100\n\n${analysis.summary.join('\n')}`
            };
            setMessages(prev => [...prev, analysisMessage]);
        } catch (error) {
            console.error('Erro ao analisar código:', error);
        }
    };

    const handleSaveAndExit = () => {
        onSaveAndExit(project);
    };

    const handleNewChat = () => {
        setMessages([{
            id: 'new-chat',
            role: 'assistant',
            text: t('editor.newChatMessage', language)
        }]);
    };

    const handleProjectNameChange = (name: string) => {
        setProject(p => ({ ...p, name }));
    };

    const handleSaveVersion = (name: string) => {
        const newVersion: Version = {
            id: `v-${Date.now()}`,
            name: name,
            createdAt: new Date(),
            fileTree: project.fileTree
        };
        setVersionHistory(prev => [newVersion, ...prev]);
        alert(t('editor.versionSaved', language, { versionName: name }));
    };

    const handleVersionRestore = (fileTree: FileTree) => {
        updateFileTree(fileTree, 'Restored version');
        setMessages(prev => [...prev, { id: 'restore', role: 'assistant', text: t('editor.restoreMessage', language) }]);
    };

    const handleSaveFile = (path: string, content: string) => {
        const newFileTree = { ...project.fileTree, [path]: content };
        updateFileTree(newFileTree, `Edited ${path}`);
    };

    const handleDeleteFile = (path: string) => {
        const newFileTree = { ...project.fileTree };
        delete newFileTree[path];
        updateFileTree(newFileTree, `Deleted ${path}`);
    };

    const handleRenameFile = (oldPath: string, newPath: string) => {
        if (project.fileTree[newPath]) {
            alert(t('codeViewer.renameErrorExists', language, { fileName: newPath }));
            return;
        }
        const newFileTree = { ...project.fileTree };
        newFileTree[newPath] = newFileTree[oldPath];
        delete newFileTree[oldPath];
        // This is a simple text replacement for references. A robust solution would involve AST parsing.
        for (const path in newFileTree) {
            if (path !== newPath) {
                newFileTree[path] = newFileTree[path].replace(new RegExp(oldPath, 'g'), newPath);
            }
        }
        updateFileTree(newFileTree, `Renamed ${oldPath} to ${newPath}`);
        setMessages(prev => [...prev, { id: `rename-${Date.now()}`, role: 'assistant', text: t('editor.fileRenamed', language, { oldPath, newPath }) }]);
    };

    const handleApplyOptimization = (fileChanges: Record<string, string>) => {
        const newFileTree = { ...project.fileTree, ...fileChanges };
        updateFileTree(newFileTree, 'Applied AI optimization');
        setMessages(prev => [...prev, {
            id: `optimization-${Date.now()}`,
            role: 'assistant',
            text: 'I\'ve applied the optimization to your project. Check the preview to see the improvements!'
        }]);
        setIsAnalysisPanelOpen(false);
    };

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row font-body bg-brand-bg dark:bg-dark-bg text-slate-800 dark:text-dark-text">
            <div className={`transition-all duration-300 ${isSidebarVisible ? 'h-1/2 md:h-full md:w-[400px] lg:w-[480px]' : 'h-0 md:w-0'} flex-shrink-0 md:h-full`}>
                <div className="w-full h-full overflow-hidden">
                    <ChatSidebar
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onNewChat={handleNewChat}
                        onSaveAndExit={handleSaveAndExit}
                        isLoading={isLoading}
                        projectName={project.name}
                        onProjectNameChange={handleProjectNameChange}
                        theme={theme}
                        onThemeChange={onThemeChange}
                        versionHistory={versionHistory}
                        onVersionRestore={handleVersionRestore}
                        language={language}
                        onLanguageChange={onLanguageChange}
                        onInitiateGitHubDeploy={() => setIsGitHubModalOpen(true)}
                        onSaveVersion={handleSaveVersion}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onOpenAnalysis={handleAnalyzeCode}
                        currentWorkflowMode={currentWorkflowMode}
                        showPlanApproval={showPlanApproval}
                        pendingPlan={pendingPlan}
                        onApprovePlan={handleApprovePlan}
                        onRejectPlan={handleRejectPlan}
                    />
                </div>
            </div>

            <div className="flex-grow h-1/2 md:h-full">
                <PreviewWindow
                    fileTree={project.fileTree}
                    language={language}
                    isSidebarVisibleOnDesktop={isSidebarVisible}
                    onToggleSidebarOnDesktop={() => setIsSidebarVisible(!isSidebarVisible)}
                    onShowCodeViewer={() => setIsCodeViewerOpen(true)}
                    onInitiatePublish={() => setIsPublishModalOpen(true)}
                    isLoading={isLoading}
                />
            </div>

            {isCodeViewerOpen && (
                <CodeViewerModal
                    fileTree={project.fileTree}
                    onClose={() => setIsCodeViewerOpen(false)}
                    language={language}
                    onSaveFile={handleSaveFile}
                    onDeleteFile={handleDeleteFile}
                    onRenameFile={handleRenameFile}
                />
            )}

            {isPublishModalOpen && (
                <PublishModal
                    onClose={() => setIsPublishModalOpen(false)}
                    projectName={project.name}
                    fileTree={project.fileTree}
                    language={language}
                />
            )}

            {isAnalysisPanelOpen && (
                <EnhancedAnalysisPanel
                    fileTree={project.fileTree}
                    language={language}
                    onApplyOptimization={handleApplyOptimization}
                    onClose={() => setIsAnalysisPanelOpen(false)}
                    analysis={codeAnalysis}
                />
            )}

            {isGitHubModalOpen && (
                <GitHubDeployModal
                    onClose={() => setIsGitHubModalOpen(false)}
                    projectName={project.name}
                    fileTree={project.fileTree}
                    language={language}
                />
            )}


        </div>
    );
};

export default EditorPage;