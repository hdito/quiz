<script setup lang="ts">
import { useErrorStore } from '@/features/clientErrors/errorStore'
import { db } from '@/firebase'
import type { QuizDraft } from '@/schemas/quizDraftSchema'
import { QuizFormSchema } from '@/schemas/quizFormSchema'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref } from 'vue'
import PublishErrorsModal from './PublishErrorsModal.vue'
import { useDrafts } from './useDrafts'
import { usePublishedQuizes } from './usePublishedQuizes'

const { data: drafts, loading: loadingDrafts, error: errorDrafts } = useDrafts()
const {
  data: publishedQuizes,
  loading: loadingPublishedQuizes,
  error: errorPublishedQuizes
} = usePublishedQuizes()

const { addError } = useErrorStore()

async function deleteQuiz(id: string) {
  try {
    await deleteDoc(doc(db, 'quizes', id))
  } catch (e) {
    addError('Не удалось удалить')
  }
}

async function removeFromPublication(id: string) {
  try {
    await updateDoc(doc(db, 'quizes', id), { isPublished: false })
  } catch (e) {
    addError('Не удалось снять с публикации')
  }
}

async function publish(quiz: QuizDraft) {
  try {
    await QuizFormSchema.validate(quiz, { abortEarly: false })
  } catch (e) {
    hasErrors.value = true
    return
  }
  try {
    await updateDoc(doc(db, 'quizes', quiz.id), { isPublished: true })
  } catch (e) {
    addError('Не удалось опубликовать')
  }
}
const hasErrors = ref(false)
</script>

<template>
  <Teleport to="body">
    <PublishErrorsModal v-if="hasErrors" :onClose="() => (hasErrors = false)" />
  </Teleport>
  <p v-if="loadingDrafts || loadingPublishedQuizes">Загрузка...</p>
  <div v-else-if="errorDrafts || errorPublishedQuizes">
    <h2 class="font-bold">При загрузке данных возникла ошибка</h2>
    <p>Попробуйте зайти позднее</p>
  </div>
  <template v-else>
    <h2 class="mb-2 text-xl font-bold">Черновики</h2>
    <div v-if="drafts.length !== 0" class="mb-4 flex flex-col gap-2">
      <div
        v-for="draft in drafts"
        :key="draft.id"
        class="flex items-center gap-4 rounded-md border border-slate-300 p-4"
      >
        <div class="min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ draft.title }}
        </div>
        <div class="ml-auto flex gap-4">
          <button
            @click="() => publish(draft)"
            class="rounded-md border border-sky-500 bg-sky-50 px-2 py-1 text-sky-700 hover:shadow-md"
          >
            Опубликовать
          </button>
          <RouterLink
            :to="`/edit/${draft.id}`"
            class="rounded-md border border-emerald-500 bg-emerald-50 px-2 py-1 text-emerald-700 hover:shadow-md"
            >Редактировать</RouterLink
          >
          <button
            @click="() => deleteQuiz(draft.id)"
            class="rounded-md border border-rose-500 bg-rose-50 px-2 py-1 text-rose-700 hover:shadow-md"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <p v-else>У вас пока нет черновиков</p>
    <h2 class="mb-2 text-xl font-bold">Опубликованные тесты</h2>
    <div class="flex flex-col gap-2" v-if="publishedQuizes.length !== 0">
      <div
        class="flex items-center gap-4 rounded-md border border-slate-300 p-4 hover:shadow-md"
        v-for="publishedQuiz in publishedQuizes"
        :key="publishedQuiz.id"
      >
        <div>
          {{ publishedQuiz.title }}
        </div>
        <div class="ml-auto flex gap-4">
          <button
            @click="() => removeFromPublication(publishedQuiz.id)"
            class="rounded-md border border-sky-500 bg-sky-50 px-2 py-1 text-sky-700 hover:shadow-md"
          >
            Снять с публикации
          </button>
          <RouterLink
            :to="`/edit/${publishedQuiz.id}`"
            class="rounded-md border border-emerald-500 bg-emerald-50 px-2 py-1 text-emerald-700 hover:shadow-md"
            >Редактировать</RouterLink
          >
          <button
            @click="() => deleteQuiz(publishedQuiz.id)"
            class="rounded-md border border-rose-500 bg-rose-50 px-2 py-1 text-rose-700 hover:shadow-md"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <p v-else>У вас пока нет опубликованных тестов</p>
  </template>
</template>
