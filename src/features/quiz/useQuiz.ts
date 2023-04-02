import { QuizSchema } from '@/schemas/quizSchema'
import { doc } from 'firebase/firestore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestore, useDocument, firestoreDefaultConverter } from 'vuefire'

export function useQuiz() {
  const db = useFirestore()
  const route = useRoute()

  const id = route.params?.id
  if (typeof id !== 'string') throw Error('Component must be used only inside :id route')

  const quizDocument = computed(() => doc(db, 'quizes', id))

  const quiz = useDocument(
    quizDocument.value.withConverter({
      fromFirestore: (snapshot) => {
        const data = firestoreDefaultConverter.fromFirestore(snapshot)
        const parsedQuiz = QuizSchema.validateSync(data)
        return parsedQuiz
      },
      toFirestore: (data) => data
    })
  )
  return quiz
}
