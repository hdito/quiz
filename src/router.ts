import { createRouter, createWebHistory } from 'vue-router'
import QuizListView from './features/quizList/QuizListView.vue'
import QuizView from './features/quiz/QuizView.vue'
import CreateQuizFormView from './features/createQuizForm/CreateQuizFormView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: QuizListView },
    { path: '/create', component: CreateQuizFormView },
    { path: '/quiz/:id', component: QuizView }
  ]
})
