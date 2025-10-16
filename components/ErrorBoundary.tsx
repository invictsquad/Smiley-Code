import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  console.error('🚨 Error caught by boundary:', error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 p-6 bg-card rounded-lg border shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">
            Algo deu errado
          </h2>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Ocorreu um erro inesperado. Você pode tentar recarregar a página ou entrar em contato com o suporte.
        </p>
        
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Detalhes técnicos
          </summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </details>
        
        <div className="flex gap-2">
          <Button onClick={resetErrorBoundary} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Recarregar página
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('🚨 Error Boundary caught an error:', error, errorInfo)
        
        // Aqui você pode enviar o erro para um serviço de monitoramento
        // como Sentry, LogRocket, etc.
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}