import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

function preconnectSupabase(supabaseUrl: string | undefined): Plugin {
  return {
    name: 'preconnect-supabase',
    transformIndexHtml(html) {
      if (!supabaseUrl) return html
      try {
        const origin = new URL(supabaseUrl).origin
        return html.replace(
          '</head>',
          `  <link rel="preconnect" href="${origin}" crossorigin />\n  </head>`,
        )
      } catch {
        return html
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'vendor-react'
            }
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase'
            }
          },
        },
      },
    },
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      preconnectSupabase(env.VITE_SUPABASE_URL),
    ],
  }
})
