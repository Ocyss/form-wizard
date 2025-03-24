import ui from '@nuxt/ui/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    default_locale: 'zh_CN',
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    permissions: ['storage', 'sidePanel', 'activeTab', 'scripting'],
    host_permissions: ['http://*/*', 'https://*/*'],
  },
  vite: () => ({
    plugins: [
      vueJsx(),
      ui({
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
