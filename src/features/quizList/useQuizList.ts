import { db } from '@/firebase'
import { QuizSchema } from '@/schemas/quizSchema'
import { query, collection, where } from 'firebase/firestore'
import { ref } from 'vue'
import { useCollection, firestoreDefaultConverter } from 'vuefire'

export function useQuizList() {
  const quizQuery = query(collection(db, 'quizes'), where('isPublished', '==', true))

  const loading = ref(true)
  const { data, error, promise } = useCollection(
    quizQuery.withConverter({
      fromFirestore: (snapshot) => {
        const data = firestoreDefaultConverter.fromFirestore(snapshot)
        const parsedQuizes = QuizSchema.validateSync(data)
        return parsedQuizes
      },
      toFirestore: (data) => data
    })
  )
  promise.value.then(() => (loading.value = false))
  return { data, error, loading }
}
