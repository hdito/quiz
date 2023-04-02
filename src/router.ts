import { createRouter, createWebHistory } from 'vue-router'
import QuizListView from './features/quizList/QuizListView.vue'
import QuizView from './features/quiz/QuizView.vue'
import CreateQuizFormView from './features/createQuizForm/CreateQuizFormView.vue'
import { doc, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { getCurrentUser } from './features/createQuizForm/getCurrentUser'
import { db } from './firebase'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: QuizListView },
    {
      path: '/create',
      component: CreateQuizFormView,
      beforeEnter: async () => {
        const id = nanoid()
        const user = await getCurrentUser()
        if (user === null) return '/'

        await setDoc(doc(db, 'quizes', id), {
          id,
          isPublished: false,
          description: '',
          owner: user.uid,
          results: [],
          title: '',
          questions: []
        })
        return `/edit/${id}`
      }
    },
    {
      path: '/edit/:id',
      component: CreateQuizFormView,
      props: true
    },
    { path: '/quiz/:id', component: QuizView, props: true }
  ]
})
