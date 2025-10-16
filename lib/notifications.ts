import { toast } from '@/components/ui/use-toast'

/**
 * Sistema de notificações padronizado para a aplicação
 */
export const notifications = {
  // Notificações de sucesso
  success: {
    projectCreated: (projectName: string) =>
      toast({
        title: "✅ Projeto criado!",
        description: `O projeto "${projectName}" foi criado com sucesso.`,
      }),

    projectSaved: () =>
      toast({
        title: "💾 Projeto salvo!",
        description: "Todas as alterações foram salvas automaticamente.",
      }),

    projectPublished: () =>
      toast({
        title: "🌐 Projeto publicado!",
        description: "Seu projeto agora está público e pode ser acessado por outros usuários.",
      }),

    deploySuccess: (url: string) =>
      toast({
        title: "🚀 Deploy realizado!",
        description: `Seu projeto está disponível em: ${url}`,
      }),
  },

  // Notificações de erro
  error: {
    projectCreateFailed: () =>
      toast({
        title: "❌ Erro ao criar projeto",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive",
      }),

    projectSaveFailed: () =>
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível salvar as alterações. Verifique sua conexão.",
        variant: "destructive",
      }),

    networkError: () =>
      toast({
        title: "🌐 Erro de conexão",
        description: "Verifique sua conexão com a internet e tente novamente.",
        variant: "destructive",
      }),

    authRequired: () =>
      toast({
        title: "🔐 Login necessário",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      }),
  },

  // Notificações informativas
  info: {
    autoSaving: () =>
      toast({
        title: "💾 Salvando automaticamente...",
        description: "Suas alterações estão sendo salvas.",
      }),

    projectLoading: () =>
      toast({
        title: "📂 Carregando projeto...",
        description: "Aguarde enquanto carregamos seu projeto.",
      }),

    featureComingSoon: (feature: string) =>
      toast({
        title: "🚧 Em breve!",
        description: `A funcionalidade "${feature}" estará disponível em breve.`,
      }),
  },

  // Notificações de aviso
  warning: {
    unsavedChanges: () =>
      toast({
        title: "⚠️ Alterações não salvas",
        description: "Você tem alterações não salvas. Deseja continuar?",
      }),

    projectLimitReached: () =>
      toast({
        title: "⚠️ Limite atingido",
        description: "Você atingiu o limite de projetos. Considere fazer upgrade.",
      }),

    largeFileWarning: () =>
      toast({
        title: "⚠️ Arquivo grande",
        description: "Este arquivo é muito grande e pode afetar a performance.",
      }),
  },
}

/**
 * Função utilitária para mostrar notificações de loading com promise
 */
export async function withLoadingToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
): Promise<T> {
  const loadingToast = toast({
    title: messages.loading,
    description: "Aguarde...",
  })

  try {
    const result = await promise
    loadingToast.dismiss()
    
    toast({
      title: "✅ Sucesso!",
      description: messages.success,
    })
    
    return result
  } catch (error) {
    loadingToast.dismiss()
    
    toast({
      title: "❌ Erro",
      description: messages.error,
      variant: "destructive",
    })
    
    throw error
  }
}