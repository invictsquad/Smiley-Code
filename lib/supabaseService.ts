import { supabase, DatabaseProject, DatabaseUser, DatabaseVersion } from './supabase';
import { Project, Version } from '../types';

export class SupabaseService {
  // Autenticação
  static async signUp(email: string, password: string, displayName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  // Projetos
  static async createProject(project: Omit<Project, 'id' | 'updatedAt'>): Promise<{ data: Project | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          file_tree: project.fileTree,
          is_public: project.isPublic,
          user_id: user?.id,
          tags: project.tags,
          category: project.category,
          description: project.description,
        })
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: this.transformDatabaseProjectToProject(data),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateProject(projectId: string, updates: Partial<Project>): Promise<{ data: Project | null; error: any }> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.fileTree !== undefined) updateData.file_tree = updates.fileTree;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: this.transformDatabaseProjectToProject(data),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteProject(projectId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    return { error };
  }

  static async getUserProjects(): Promise<{ data: Project[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) return { data: null, error };

      return {
        data: data.map(this.transformDatabaseProjectToProject),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getPublicProjects(limit = 20): Promise<{ data: Project[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) return { data: null, error };

      return {
        data: data.map(this.transformDatabaseProjectToProject),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getProject(projectId: string): Promise<{ data: Project | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) return { data: null, error };

      return {
        data: this.transformDatabaseProjectToProject(data),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Versões
  static async createVersion(projectId: string, version: Omit<Version, 'id' | 'createdAt'>): Promise<{ data: Version | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .insert({
          project_id: projectId,
          name: version.name,
          file_tree: version.fileTree,
          metadata: version.metadata,
        })
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: this.transformDatabaseVersionToVersion(data),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getProjectVersions(projectId: string): Promise<{ data: Version[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) return { data: null, error };

      return {
        data: data.map(this.transformDatabaseVersionToVersion),
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sincronização com localStorage
  static async syncWithLocalStorage(): Promise<{ success: boolean; error?: any }> {
    try {
      // Buscar projetos do localStorage
      const localProjects = localStorage.getItem('smiley-code-projects');
      if (!localProjects) return { success: true };

      const projects: Project[] = JSON.parse(localProjects);
      
      // Verificar se o usuário está logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: true };

      // Buscar projetos existentes no Supabase
      const { data: existingProjects } = await this.getUserProjects();
      const existingIds = new Set(existingProjects?.map(p => p.id) || []);

      // Sincronizar projetos que não existem no Supabase
      for (const project of projects) {
        if (!existingIds.has(project.id)) {
          await this.createProject({
            name: project.name,
            fileTree: project.fileTree,
            isPublic: project.isPublic,
            tags: project.tags,
            category: project.category,
            description: project.description,
          });
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Utilitários de transformação
  private static transformDatabaseProjectToProject(dbProject: DatabaseProject): Project {
    return {
      id: dbProject.id,
      name: dbProject.name,
      fileTree: dbProject.file_tree,
      isPublic: dbProject.is_public,
      updatedAt: new Date(dbProject.updated_at),
      tags: dbProject.tags,
      category: dbProject.category,
      description: dbProject.description,
    };
  }

  private static transformDatabaseVersionToVersion(dbVersion: DatabaseVersion): Version {
    return {
      id: dbVersion.id,
      name: dbVersion.name,
      createdAt: new Date(dbVersion.created_at),
      fileTree: dbVersion.file_tree,
      metadata: dbVersion.metadata,
    };
  }
}