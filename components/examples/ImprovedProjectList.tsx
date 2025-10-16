import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import { Project } from '@/types'
import { useProjects, useCreateProject } from '@/lib/useProjects'
import { ProjectCard } from '../ProjectCard'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Loading } from '../ui/loading'
import { useToast } from '../ui/use-toast'

interface ImprovedProjectListProps {
  onLoadProject: (project: Project) => void
  onRemixProject: (project: Project) => void
  onTogglePublic: (projectId: string) => void
  onDeleteProject: (projectId: string) => void
}

export function ImprovedProjectList({
  onLoadProject,
  onRemixProject,
  onTogglePublic,
  onDeleteProject,
}: ImprovedProjectListProps) {
  const { data: projects = [], isLoading, error } = useProjects()
  const createProject = useCreateProject()
  const { toast } = useToast()

  const handleCreateProject = async () => {
    try {
      await createProject.mutateAsync({
        name: 'Novo Projeto',
        fileTree: {},
        isPublic: false,
      })
      
      toast({
        title: "Projeto criado!",
        description: "Seu novo projeto está pronto para ser editado.",
      })
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loading size="lg" text="Carregando projetos..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">
            Erro ao carregar projetos. Tente novamente.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meus Projetos</h2>
          <p className="text-muted-foreground">
            {projects.length} projeto{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleCreateProject}
            disabled={createProject.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {createProject.isPending ? 'Criando...' : 'Novo Projeto'}
          </Button>
        </div>
      </div>

      {/* Lista de projetos */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto ainda</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro projeto para começar a construir aplicações incríveis!
            </p>
            <Button onClick={handleCreateProject} disabled={createProject.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onLoad={onLoadProject}
                onRemix={onRemixProject}
                onTogglePublic={onTogglePublic}
                onDelete={onDeleteProject}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}