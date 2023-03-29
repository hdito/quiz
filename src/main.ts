import './index.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import CreateQuizForm from '@/features/createQuizForm/CreateQuizForm.vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import QuizList from '@/features/quizList/QuizList.vue'
import QuizPage from '@/features/quizForm/QuizPage.vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: QuizList },
    { path: '/create', component: CreateQuizForm },
    { path: '/quiz/:id', component: QuizPage }
  ]
})

app.use(router)

app.use(VueFire, { firebaseApp, modules: [VueFireAuth()] })

app.mount('#app')
