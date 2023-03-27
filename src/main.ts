import './index.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import CreateQuizForm from './components/CreateQuizForm.vue'
import QuizForm from './components/QuizForm.vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: QuizForm },
    { path: '/create', component: CreateQuizForm }
  ]
})

app.use(router)

app.mount('#app')
