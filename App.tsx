import { useState, useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { LoadingPage } from './components/ui/loading';
import LandingPage from './components/LandingPage';
import EditorPage from './components/EditorPage';
import AuthModal from './components/AuthModal';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PricingPage from './components/PricingPage';
import { Language, Project } from './types';
import Footer from './components/Footer';
import { ProjectCategorizer } from './lib/projectCategories';
import { ProjectNameGenerator } from './lib/projectNameGenerator';
import { useAuth } from './lib/useAuth';
import { queryClient } from './lib/queryClient';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from './lib/useProjects';

function AppContent() {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [initialPromptForEditor, setInitialPromptForEditor] = useState<string | null>(null);
  const [initialImagesForEditor, setInitialImagesForEditor] = useState<{ data: string; mimeType: string; }[] | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('pt');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'privacy' | 'terms' | 'pricing'>('landing');
  
  const { user, loading: authLoading } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Removed useEffect hooks - now handled by React Query
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleStartNewProject = async (prompt: string, images?: { data: string; mimeType: string; }[]) => {
    console.log('🎯 handleStartNewProject called:', { prompt, images: images?.length, user: !!user });
    
    // Gerar nome automaticamente baseado no prompt
    let projectName: string;
    
    if (prompt && prompt.trim().length > 0) {
      projectName = ProjectNameGenerator.generateQuickName(prompt);
    } else {
      projectName = ProjectNameGenerator.generateQuickName('');
    }

    const projectData = {
      name: projectName,
      fileTree: {},
      isPublic: false,
      tags: undefined,
      category: undefined,
      description: undefined,
    };
    
    try {
      const newProject = await createProjectMutation.mutateAsync(projectData);
      setEditingProject(newProject);
      
      if (prompt && prompt.trim().length > 0) {
        setInitialPromptForEditor(prompt);
        setInitialImagesForEditor(images || null);
        
        // Gerar nome melhor com IA em background
        try {
          const aiGeneratedName = await ProjectNameGenerator.generateProjectName(prompt);
          if (aiGeneratedName !== projectName) {
            await updateProjectMutation.mutateAsync({
              id: newProject.id,
              updates: { name: aiGeneratedName }
            });
            setEditingProject(prev => prev ? { ...prev, name: aiGeneratedName } : null);
          }
        } catch (error) {
          console.warn('Failed to generate AI project name:', error);
        }
      } else {
        setInitialPromptForEditor(null);
        setInitialImagesForEditor(null);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleLoadProject = (project: Project) => {
    setInitialPromptForEditor(null);
    setInitialImagesForEditor(null);
    setEditingProject(project);
  };

  const handleRemixProject = async (projectToRemix: Project) => {
    const projectData = {
      ...projectToRemix,
      name: `${projectToRemix.name} (Remix)`,
      isPublic: false,
    };
    
    try {
      const newProject = await createProjectMutation.mutateAsync(projectData);
      setInitialPromptForEditor(null);
      setInitialImagesForEditor(null);
      setEditingProject(newProject);
    } catch (error) {
      console.error('Failed to remix project:', error);
    }
  };

  const handleSaveAndExit = async (updatedProject: Project) => {
    // Auto-categorize and tag the project
    const enhancedProject = ProjectCategorizer.updateProjectMetadata({
      ...updatedProject,
      updatedAt: new Date()
    });
    
    try {
      await updateProjectMutation.mutateAsync({
        id: enhancedProject.id,
        updates: enhancedProject
      });
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleTogglePublic = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        updates: { isPublic: !project.isPublic }
      });
    } catch (error) {
      console.error('Failed to update project visibility:', error);
    }
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProjectMutation.mutateAsync(projectId);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (authLoading || projectsLoading) {
    return <LoadingPage text="Carregando aplicação..." />;
  }

  return (
    <>
      {editingProject ? (
        <EditorPage
          initialProject={editingProject}
          onSaveAndExit={handleSaveAndExit}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
          initialPrompt={initialPromptForEditor}
          initialImages={initialImagesForEditor}
        />
      ) : (
        <>
          {currentPage === 'landing' && (
            <div className="min-h-screen flex flex-col">
              <main className="flex-grow">
                <LandingPage 
                  onStartCreating={handleStartNewProject}
                  language={language}
                  onLanguageChange={setLanguage}
                  userProjects={projects}
                  onLoadProject={handleLoadProject}
                  onRemixProject={handleRemixProject}
                  onTogglePublic={handleTogglePublic}
                  onDeleteProject={handleDeleteProject}
                  user={user}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
              </main>
              <Footer 
                language={language} 
                onNavigate={(page) => setCurrentPage(page)} 
              />
            </div>
          )}
          
          {currentPage === 'privacy' && (
            <PrivacyPolicyPage
              language={language}
              onLanguageChange={setLanguage}
              onBack={() => setCurrentPage('landing')}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
          
          {currentPage === 'terms' && (
            <TermsOfServicePage
              language={language}
              onLanguageChange={setLanguage}
              onBack={() => setCurrentPage('landing')}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
          
          {currentPage === 'pricing' && (
            <PricingPage
              language={language}
              onLanguageChange={setLanguage}
              onBack={() => setCurrentPage('landing')}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
        </>
      )}
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingPage />}>
          <AppContent />
        </Suspense>
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
