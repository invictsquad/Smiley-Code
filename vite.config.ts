/**
 * Smiley Code - Construtor de Aplicações Web com IA
 * 
 * @author Luiz Antônio De Lima Mendonça
 * @location Resende, Rio de Janeiro, Brasil
 * @repository https://github.com/invictsquad/Smiley-Code
 * @license MIT
 */

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        global: 'globalThis',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Garantir que as variáveis VITE_ sejam carregadas automaticamente
      envPrefix: ['VITE_', 'GEMINI_'],
    };
});
