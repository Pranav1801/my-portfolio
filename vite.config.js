import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // served from https://pranav1801.github.io/my-portfolio/
  base: '/my-portfolio/',
  plugins: [react()],
})
