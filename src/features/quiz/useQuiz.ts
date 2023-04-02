import { QuizSchema } from '@/schemas/quizSchema'
import { doc } from 'firebase/firestore'
import { computed, type Ref } from 'vue'
import { firestoreDefaultConverter, useDocument, useFirestore } from 'vuefire'

export function useQuiz(id: Ref<string>) {
  const db = useFirestore()

  const quizDocument = computed(() => doc(db, 'quizes', id.value))

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
