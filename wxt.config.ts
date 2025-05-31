import ui from '@nuxt/ui/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    default_locale: 'zh_CN',
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    permissions: ['storage', 'sidePanel', 'activeTab', 'scripting'],
    host_permissions: ['http://*/*', 'https://*/*'],
  },
  imports: false,
  outDirTemplate: '{{browser}}-mv{{manifestVersion}}',
  vite: () => ({
    plugins: [
      VueJsx(),
      ui({
        autoImport: {
          dts: 'src/auto-imports.d.ts',
        },
        components: {
          dts: 'src/components.d.ts',
        },
        ui: {
          colors: {
            primary: 'purple',
            neutral: 'zinc',
          },
        },
      }),
    ],
  }),
})
