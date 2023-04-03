import { db } from '@/firebase'
import { collection, query, where } from 'firebase/firestore'
import { firestoreDefaultConverter, useCollection, useCurrentUser } from 'vuefire'
import { QuizDraftSchema } from '../../schemas/quizDraftSchema'
import { ref } from 'vue'

export function useDrafts() {
  const user = useCurrentUser()
  if (!user.value?.uid) throw Error('You must call useDrafts only after authentication')
  const draftsQuery = query(
    collection(db, 'quizes'),
    where('isPublished', '==', false),
    where('owner', '==', user.value.uid)
  )

  const loading = ref(true)
  const { data, promise, error } = useCollection(
    draftsQuery.withConverter({
      fromFirestore: (snapshot) => {
        const data = firestoreDefaultConverter.fromFirestore(snapshot)
        const parsedQuiz = QuizDraftSchema.validateSync(data)
        return parsedQuiz
      },
      toFirestore: (data) => data
    })
  )
  promise.value.then(() => (loading.value = false))

  return { data, loading, error }
}
