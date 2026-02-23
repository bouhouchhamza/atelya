import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: {
      resolveDependencies(_filename, dependencies) {
        return dependencies.filter((dependency) => !dependency.includes('hero-3d-vendors'))
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@react-three') || id.includes('node_modules/three')) {
            return 'hero-3d-vendors'
          }

          if (id.includes('node_modules/@tanstack')) {
            return 'query-vendors'
          }

          if (id.includes('node_modules/react-router')) {
            return 'router-vendors'
          }

          return undefined
        },
      },
    },
  },
})
