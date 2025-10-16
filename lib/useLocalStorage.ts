import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

/**
 * Hook customizado para gerenciar localStorage com tratamento de erros
 * e sincronização automática entre abas
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const { toast } = useToast()
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar valor inicial do localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedValue = JSON.parse(item)
        setStoredValue(parsedValue)
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      toast({
        title: "Erro ao carregar dados",
        description: "Alguns dados podem não estar disponíveis.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [key, toast])

  // Sincronizar entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
      toast({
        title: "Erro ao salvar dados",
        description: "Não foi possível salvar as alterações localmente.",
        variant: "destructive",
      })
    }
  }

  return [storedValue, setValue, isLoading]
}