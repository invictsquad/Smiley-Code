import { useState, useEffect } from 'react';
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
import { SupabaseService } from './lib/supabaseService';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [initialPromptForEditor, setInitialPromptForEditor] = useState<string | null>(null);
  const [initialImagesForEditor, setInitialImagesForEditor] = useState<{ data: string; mimeType: string; }[] | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('pt');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'privacy' | 'terms' | 'pricing'>('landing');
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      if (user) {
        // Usuário logado: carregar do Supabase
        try {
          const { data: supabaseProjects, error } = await SupabaseService.getUserProjects();
          if (error) {
            console.error('Failed to load projects from Supabase:', error);
            // Fallback para localStorage
            loadFromLocalStorage();
          } else {
            setProjects(supabaseProjects || []);
          }
        } catch (error) {
          console.error('Error loading projects from Supabase:', error);
          loadFromLocalStorage();
        }
      } else {
        // Usuário não logado: carregar do localStorage
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedProjects = localStorage.getItem('smiley-code-projects');
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects).map((p: any) => ({
            ...p,
            updatedAt: new Date(p.updatedAt),
          }));
          setProjects(parsedProjects);
        }
      } catch (error) {
        console.error('Failed to load projects from localStorage', error);
      }
    };

    console.log('🔐 Auth state:', { user: !!user, authLoading });
    
    if (!authLoading) {
      loadProjects();
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Sempre salvar no localStorage como backup
    try {
      localStorage.setItem('smiley-code-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects to localStorage', error);
    }
  }, [projects]);
  
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
      // Usar nome rápido primeiro, depois atualizar com IA
      projectName = ProjectNameGenerator.generateQuickName(prompt);
    } else {
      projectName = ProjectNameGenerator.generateQuickName('');
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectName,
      fileTree: {},
      isPublic: false,
      updatedAt: new Date(),
    };
    
    // Criar no Supabase se o usuário estiver logado
    if (user) {
      try {
        const { data: createdProject, error } = await SupabaseService.createProject({
          name: newProject.name,
          fileTree: newProject.fileTree,
          isPublic: newProject.isPublic,
          tags: newProject.tags,
          category: newProject.category,
          description: newProject.description,
        });
        
        if (createdProject && !error) {
          setProjects(prev => [createdProject, ...prev]);
          setEditingProject(createdProject);
        } else {
          // Fallback para projeto local
          setProjects(prev => [newProject, ...prev]);
          setEditingProject(newProject);
        }
      } catch (error) {
        console.error('Failed to create project in Supabase:', error);
        // Fallback para projeto local
        setProjects(prev => [newProject, ...prev]);
        setEditingProject(newProject);
      }
    } else {
      setProjects(prev => [newProject, ...prev]);
      setEditingProject(newProject);
    }
    
    if (prompt && prompt.trim().length > 0) {
      setInitialPromptForEditor(prompt);
      setInitialImagesForEditor(images || null);
      
      // Gerar nome melhor com IA em background
      try {
        const aiGeneratedName = await ProjectNameGenerator.generateProjectName(prompt);
        if (aiGeneratedName !== projectName) {
          const updatedProject = { ...newProject, name: aiGeneratedName };
          setProjects(prev => prev.map(p => p.id === newProject.id ? updatedProject : p));
          setEditingProject(updatedProject);
          
          // Atualizar no Supabase também
          if (user) {
            await SupabaseService.updateProject(newProject.id, { name: aiGeneratedName });
          }
        }
      } catch (error) {
        console.warn('Failed to generate AI project name:', error);
      }
    } else {
      setInitialPromptForEditor(null);
      setInitialImagesForEditor(null);
    }
  };

  const handleLoadProject = (project: Project) => {
    setInitialPromptForEditor(null);
    setInitialImagesForEditor(null);
    setEditingProject(project);
  };

  const handleRemixProject = (projectToRemix: Project) => {
    const newProject: Project = {
      ...projectToRemix,
      id: `proj-${Date.now()}`,
      name: `${projectToRemix.name} (Remix)`,
      isPublic: false,
      updatedAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
    setInitialPromptForEditor(null);
    setInitialImagesForEditor(null);
    setEditingProject(newProject);
  };

  const handleSaveAndExit = async (updatedProject: Project) => {
    // Auto-categorize and tag the project
    const enhancedProject = ProjectCategorizer.updateProjectMetadata({
      ...updatedProject,
      updatedAt: new Date()
    });
    
    // Atualizar estado local
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? enhancedProject : p)
    );
    
    // Salvar no Supabase se o usuário estiver logado
    if (user) {
      try {
        await SupabaseService.updateProject(enhancedProject.id, enhancedProject);
      } catch (error) {
        console.error('Failed to save project to Supabase:', error);
      }
    }
    
    setEditingProject(null);
  };

  const handleTogglePublic = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = { ...project, isPublic: !project.isPublic, updatedAt: new Date() };
    
    setProjects(prev =>
      prev.map(p => p.id === projectId ? updatedProject : p)
    );

    // Atualizar no Supabase se o usuário estiver logado
    if (user) {
      try {
        await SupabaseService.updateProject(projectId, { isPublic: updatedProject.isPublic });
      } catch (error) {
        console.error('Failed to update project visibility in Supabase:', error);
      }
    }
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Deletar do Supabase se o usuário estiver logado
      if (user) {
        try {
          await SupabaseService.deleteProject(projectId);
        } catch (error) {
          console.error('Failed to delete project from Supabase:', error);
        }
      }
    }
  };

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

export default App;
