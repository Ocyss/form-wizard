import ui from '@nuxt/ui/vue-plugin'
import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/main.css'

// eslint-disable-next-line ts/no-unsafe-argument
const app = createApp(App)

app.use(ui)

app.mount('#app')
