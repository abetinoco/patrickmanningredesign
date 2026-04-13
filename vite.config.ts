import path from 'path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * In dev/preview, `/admin/login` etc. must serve `admin/index.html` (React SPA).
 * Otherwise Vite falls through to the root `index.html` and you see the marketing homepage.
 */
function adminSpaFallback(): Plugin {
  const shouldRewrite = (pathname: string) => {
    if (!pathname.startsWith('/admin')) return false
    if (pathname.startsWith('/admin/src/')) return false
    const clean = pathname.split('?')[0] ?? ''
    if (/\.[a-zA-Z0-9]+$/.test(clean)) return false
    return true
  }

  return {
    name: 'admin-spa-fallback',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? ''
        const pathname = url.split('?')[0] ?? ''
        if (shouldRewrite(pathname)) req.url = '/admin/index.html'
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? ''
        const pathname = url.split('?')[0] ?? ''
        if (shouldRewrite(pathname)) req.url = '/admin/index.html'
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), adminSpaFallback()],
  envDir: path.resolve(__dirname),
  server: {
    port: 8080,
    open: '/',
  },
  preview: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        closingCosts: path.resolve(__dirname, 'closing-cost-estimator.html'),
        rentVsBuy: path.resolve(__dirname, 'rent-vs-buy.html'),
        admin: path.resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
