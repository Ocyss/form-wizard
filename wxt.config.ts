import ui from "@nuxt/ui/vite";
import VueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAul/qhkola72hJ1MvMuL7fP4H7qyxMQJOLmzJXg9ISvqDmU7EaHWPQZvMd2vrBniLWuAY0l4+/A8fZ3nDoZEmJqz0R4rOM1hcaBqaDZY48nMZcZ+4wD8ZEkeaDwu7rx5Ox0o4X5DF7oxMUXoQGbbzZQkL7ANmiAJiqg3akse9RN6mM80hRiRXNqPcDEvWul5bUait05taJnH9KvH8+k3+PU7baUd7wOOXs5DnnIQbgaKE2gmLPLmKrauS09EkHFMvSH/5hsOWUHTna12fXWSSsRzPDEQG3psNCs3CSHawDs9klnfABVfKypXz3DQaO3rG69mF6f6i3juRqrOj9jNKLQIDAQAB",
    default_locale: "zh_CN",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["storage", "sidePanel", "activeTab", "scripting", "contextMenus", "tabs"],
    host_permissions: ["http://*/*", "https://*/*"],
    content_scripts: [
      {
        js: ["content-scripts/main.js"],
        matches: ["*://*/*"],
      },
    ],
  },
  imports: false,
  outDirTemplate: "{{browser}}-mv{{manifestVersion}}",
  vite: () => ({
    plugins: [
      VueJsx(),
      ui({
        autoImport: {
          dts: "src/auto-imports.d.ts",
        },
        components: {
          dts: "src/components.d.ts",
        },
        ui: {
          colors: {
            primary: "purple",
            neutral: "zinc",
          },
        },
      }),
    ],
  }),
});
