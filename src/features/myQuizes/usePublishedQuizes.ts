import { db } from '@/firebase'
import { QuizSchema } from '@/schemas/quizSchema'
import { collection, query, where } from 'firebase/firestore'
import { ref } from 'vue'
import { firestoreDefaultConverter, useCollection, useCurrentUser } from 'vuefire'

export function usePublishedQuizes() {
  const user = useCurrentUser()
  if (!user.value?.uid) throw Error('You must call usePublishedQuizes only after authentication')
  const publishedQuizesQuery = query(
    collection(db, 'quizes'),
    where('isPublished', '==', true),
    where('owner', '==', user.value.uid)
  )
  const loading = ref(true)
  const { data, error, promise } = useCollection(
    publishedQuizesQuery.withConverter({
      fromFirestore: (snapshot) => {
        const data = firestoreDefaultConverter.fromFirestore(snapshot)
        const parsedQuiz = QuizSchema.validateSync(data)
        return parsedQuiz
      },
      toFirestore: (data) => data
    })
  )
  promise.value.then(() => (loading.value = false))
  return { data, error, loading }
}
