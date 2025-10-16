import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Globe, Lock, MoreVertical, Trash2, Copy } from 'lucide-react'
import { Project } from '@/types'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface ProjectCardProps {
  project: Project
  onLoad: (project: Project) => void
  onRemix: (project: Project) => void
  onTogglePublic: (projectId: string) => void
  onDelete: (projectId: string) => void
  isOwner?: boolean
}

export function ProjectCard({
  project,
  onLoad,
  onRemix,
  onTogglePublic,
  onDelete,
  isOwner = true,
}: ProjectCardProps) {
  const fileCount = Object.keys(project.fileTree).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onTogglePublic(project.id)}>
                    {project.isPublic ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Tornar privado
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Tornar público
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRemix(project)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Fazer remix
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(project.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pb-3" onClick={() => onLoad(project)}>
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {project.tags && project.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{project.tags.length - 3} mais
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {fileCount} arquivo{fileCount !== 1 ? 's' : ''}
            {project.category && ` • ${project.category}`}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(project.updatedAt)}
            </div>
            
            <div className="flex items-center gap-1">
              {project.isPublic ? (
                <Globe className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Lock className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}