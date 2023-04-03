import { QuizSchema } from '@/schemas/quizSchema'
import { doc } from 'firebase/firestore'
import { computed, ref, type Ref } from 'vue'
import { firestoreDefaultConverter, useDocument, useFirestore } from 'vuefire'

export function useQuiz(id: Ref<string>) {
  const db = useFirestore()

  const quizDocument = computed(() => doc(db, 'quizes', id.value))

  const loading = ref(true)
  const { data, error, promise } = useDocument(
    quizDocument.value.withConverter({
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
