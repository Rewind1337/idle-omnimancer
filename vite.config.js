import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages hosts Omnimancer under /idle-omnimancer/.
  // Keep local development at the root path.
  base: command === 'build' ? '/idle-omnimancer/' : '/',
}))
