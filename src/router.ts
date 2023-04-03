import { createRouter, createWebHistory } from 'vue-router'
import QuizListView from './features/quizList/QuizListView.vue'
import QuizView from './features/quiz/QuizView.vue'
import CreateQuizFormView from './features/createQuizForm/CreateQuizFormView.vue'
import { doc, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { getCurrentUser } from './features/createQuizForm/getCurrentUser'
import { db } from './firebase'
import MyQuizesView from './features/myQuizes/MyQuizesView.vue'
import { useCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: QuizListView, meta: { requiresAuth: false } },
    {
      path: '/create',
      component: CreateQuizFormView,
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
      component: CreateQuizFormView,
      props: true,
      meta: { requiresAuth: true }
    },
    { path: '/quiz/:id', component: QuizView, props: true, meta: { requiresAuth: false } },
    { path: '/user', component: MyQuizesView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth && !(await getCurrentUser())) {
    return '/'
  }
})

export { router }
