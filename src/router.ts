import { doc, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { createRouter, createWebHistory } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import { getCurrentUser } from './features/createQuizForm/getCurrentUser'
import QuizListView from './features/quizList/QuizListView.vue'
import { db } from './firebase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: QuizListView, meta: { requiresAuth: false } },
    {
      path: '/create',
      component: () => import('./features/createQuizForm/CreateQuizFormView.vue'),
      beforeEnter: async () => {
        const id = nanoid()
        const user = useCurrentUser()
        if (!user.value?.uid) return '/'

        await setDoc(doc(db, 'quizes', id), {
          id,
          isPublished: false,
          description: '',
          owner: user.value.uid,
          results: [],
          title: '',
          questions: []
        })
        return `/edit/${id}`
      },
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:id',
      component: () => import('./features/createQuizForm/CreateQuizFormView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/quiz/:id',
      component: () => import('./features/quiz/QuizView.vue'),
      props: true,
      meta: { requiresAuth: false }
    },
    {
      path: '/user',
      component: () => import('./features/myQuizes/MyQuizesView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth && !(await getCurrentUser())) {
    return '/'
  }
})

export { router }
