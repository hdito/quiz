import './index.css'
import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import { firebaseApp } from './firebase'
import { router } from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

app.use(router)

app.use(VueFire, { firebaseApp, modules: [VueFireAuth()] })

app.use(pinia)

app.mount('#app')
