import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Project } from '@/types'
import { SupabaseService } from './supabaseService'
import { useAuth } from './useAuth'
import { useToast } from '@/components/ui/use-toast'

const PROJECTS_QUERY_KEY = ['projects']

export function useProjects() {
  const { user } = useAuth()
  const { toast } = useToast()

  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async (): Promise<Project[]> => {
      if (user) {
        // Usuário logado: carregar do Supabase
        try {
          const { data, error } = await SupabaseService.getUserProjects()
          if (error) {
            console.error('Failed to load projects from Supabase:', error)
            throw error
          }
          return data || []
        } catch (error) {
          console.error('Error loading projects from Supabase:', error)
          // Fallback para localStorage
          return loadFromLocalStorage()
        }
      } else {
        // Usuário não logado: carregar do localStorage
        return loadFromLocalStorage()
      }
    },
    enabled: true,
  })
}

function loadFromLocalStorage(): Project[] {
  try {
    const savedProjects = localStorage.getItem('smiley-code-projects')
    if (savedProjects) {
      return JSON.parse(savedProjects).map((p: any) => ({
        ...p,
        updatedAt: new Date(p.updatedAt),
      }))
    }
    return []
  } catch (error) {
    console.error('Failed to load projects from localStorage', error)
    return []
  }
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'updatedAt'>) => {
      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        updatedAt: new Date(),
      }

      if (user) {
        try {
          const { data, error } = await SupabaseService.createProject(projectData)
          if (error) throw error
          return data
        } catch (error) {
          console.error('Failed to create project in Supabase:', error)
          // Fallback para projeto local
          return newProject
        }
      }
      
      return newProject
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old = []) => [
        newProject,
        ...old,
      ])
      
      // Salvar no localStorage como backup
      const projects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY) || []
      localStorage.setItem('smiley-code-projects', JSON.stringify(projects))
      
      toast({
        title: "Projeto criado",
        description: "Seu novo projeto foi criado com sucesso!",
      })
    },
    onError: (error) => {
      console.error('Failed to create project:', error)
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const updatedProject = { ...updates, id, updatedAt: new Date() }

      if (user) {
        try {
          await SupabaseService.updateProject(id, updates)
        } catch (error) {
          console.error('Failed to update project in Supabase:', error)
        }
      }

      return updatedProject
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old = []) =>
        old.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p))
      )
      
      // Salvar no localStorage como backup
      const projects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY) || []
      localStorage.setItem('smiley-code-projects', JSON.stringify(projects))
      
      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso!",
      })
    },
    onError: (error) => {
      console.error('Failed to update project:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (user) {
        try {
          await SupabaseService.deleteProject(projectId)
        } catch (error) {
          console.error('Failed to delete project from Supabase:', error)
        }
      }
      return projectId
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old = []) =>
        old.filter((p) => p.id !== deletedId)
      )
      
      // Salvar no localStorage como backup
      const projects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY) || []
      localStorage.setItem('smiley-code-projects', JSON.stringify(projects))
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso!",
      })
    },
    onError: (error) => {
      console.error('Failed to delete project:', error)
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o projeto. Tente novamente.",
        variant: "destructive",
      })
    },
  })
}