import { db } from '@/firebase'
import { QuizDraftSchema, type QuizDraft } from '@/schemas/quizDraftSchema'
import { doc, getDoc } from 'firebase/firestore'
import { ref, computed, onMounted, type Ref } from 'vue'

export function useQuiz(id: Ref<string>) {
  const quiz = ref<QuizDraft | null>(null)
  const error = ref<unknown | null>(null)
  const loading = ref(true)

  const quizDoc = computed(() => doc(db, 'quizes', id.value))

  onMounted(async () => {
    try {
      const data = await getDoc(quizDoc.value)
      quiz.value = QuizDraftSchema.validateSync(data.data())
      error.value = null
    } catch (err) {
      error.value = err
      quiz.value = null
    }
    loading.value = false
  })

  return { quiz, error, loading }
}
