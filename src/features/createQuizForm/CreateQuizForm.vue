<script setup lang="ts">
import { useErrorStore } from '@/features/clientErrors/errorStore'
import { db } from '@/firebase'
import { router } from '@/router'
import { QuizDraftSchema, type QuizDraft } from '@/schemas/quizDraftSchema'
import { QuizFormSchema } from '@/schemas/quizFormSchema'
import { debounce } from 'debounce'
import { doc, updateDoc } from 'firebase/firestore'
import { ErrorMessage, Field, FieldArray, useForm } from 'vee-validate'
import { nextTick, onUnmounted, ref } from 'vue'
import { useDisplayErrors } from './useDisplayErrors'

const props = defineProps<{ quiz: QuizDraft }>()

const { addError } = useErrorStore()

const { handleSubmit, values, errors } = useForm({
  validationSchema: QuizFormSchema,
  initialValues: props.quiz
})

const { displayedErrors, hideErrors, showErrors } = useDisplayErrors(errors)

const onSubmit = handleSubmit(async (values) => {
  const castedValues = QuizFormSchema.cast(values)

  try {
    await updateDoc(doc(db, 'quizes', props.quiz.id), { ...castedValues, isPublished: true })
    router.push(`/quiz/${props.quiz.id}`)
  } catch (error) {
    addError('Не удалось опубликовать')
  }
}, onInvalidSubmit)

function onInvalidSubmit() {
  nextTick(() => {
    showErrors()
    window.scroll({ top: 0, behavior: 'smooth' })
  })
}

const debouncedUpdate = debounce(async () => {
  let updatedQuiz = null

  try {
    QuizFormSchema.validateSync(values)
    updatedQuiz = QuizFormSchema.cast(values)
  } catch {
    if (isPublished.value === true) addError('Снят с публикации')
    isPublished.value = false
    updatedQuiz = { ...QuizDraftSchema.cast(values), isPublished: false }
  }

  try {
    await updateDoc(doc(db, 'quizes', props.quiz.id), updatedQuiz)
  } catch (e) {
    console.log(e)
    addError('Не удалось сохранить тест')
  }
}, 2000)

onUnmounted(() => {
  debouncedUpdate.clear()
})

const isPublished = ref(props.quiz.isPublished)

const currentTab = ref<'main' | 'questions' | 'results'>('main')
</script>

<template>
  <form class="flex flex-col gap-4 px-4 pb-4" @submit="onSubmit" @input="debouncedUpdate">
    <div class="flex gap-4">
      <button
        @click="() => (currentTab = 'main')"
        type="button"
        :class="`${currentTab === 'main' ? 'underline decoration-2 underline-offset-2' : ''}`"
      >
        Основные настройки
      </button>
      <button
        @click="() => (currentTab = 'questions')"
        type="button"
        :class="`${currentTab === 'questions' ? 'underline decoration-2 underline-offset-2' : ''}`"
      >
        Вопросы
      </button>
      <button
        @click="() => (currentTab = 'results')"
        type="button"
        :class="`${currentTab === 'results' ? 'underline decoration-2 underline-offset-2' : ''}`"
      >
        Результаты
      </button>
    </div>
    <div v-if="displayedErrors">
      <p>Исправьте ошибки, чтобы опубликовать свой тест</p>
      <ul class="mb-2 list-inside list-disc">
        <li v-for="error in displayedErrors" :key="error">
          {{ error }}
        </li>
      </ul>
      <button type="button" @click="hideErrors" class="rounded-md border border-slate-300 p-2">
        Скрыть
      </button>
    </div>
    <div v-show="currentTab === 'main'" class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label for="quiz-title" class="font-bold">Название</label>
        <Field name="title" id="quiz-title" type="text" class="rounded-md" />
        <ErrorMessage name="title" />
      </div>
      <div class="flex flex-col">
        <label for="quiz-description" class="font-bold">Описание</label>
        <Field name="description" id="quiz-description" type="text" v-slot="{ field }">
          <textarea v-bind="field" class="rounded-md" />
        </Field>
        <ErrorMessage name="description" />
      </div>
      <div>
        <span class="mr-1 font-bold">Статус:</span>
        <span v-if="isPublished">опубликован</span>
        <span v-else>не опубликован</span>
      </div>

      <button
        v-if="isPublished === false"
        type="submit"
        class="self-start rounded-md border border-emerald-800 bg-emerald-50 p-2 text-emerald-800 transition-colors hover:bg-emerald-100"
      >
        Опубликовать
      </button>
    </div>

    <div v-show="currentTab === 'questions'" class="flex flex-col gap-4">
      <FieldArray
        name="questions"
        v-slot="{ fields: questionFields, push: addQuestion, remove: removeQuestion }"
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(questionField, questionIndex) in questionFields"
            :key="questionField.key"
            class="p-4-700 overflow-hidden rounded-md border border-slate-300"
          >
            <div class="p-4">
              <div class="mb-4 flex flex-col">
                <label :for="questionField.key.toString()" class="font-bold">Вопрос</label>
                <Field
                  :name="`questions[${questionIndex}].text`"
                  type="text"
                  :id="questionField.key.toString()"
                  class="rounded-md"
                />
                <ErrorMessage :name="`questions[${questionIndex}].text`" />
              </div>
              <h3 class="mb-2 font-bold">Ответы</h3>
              <FieldArray
                :name="`questions[${questionIndex}].answers`"
                v-slot="{ fields: answerFields, push: addAnswer, remove: removeAnswer }"
              >
                <div class="mb-4 flex flex-col gap-4">
                  <div
                    v-for="(answerField, answerIndex) in answerFields"
                    :key="answerField.key"
                    class="flex overflow-hidden rounded-md border border-slate-300"
                  >
                    <div class="flex flex-1 gap-4 p-4">
                      <div class="flex flex-1 flex-col">
                        <label :for="`input-text-${answerIndex}`" class="font-bold">Ответ</label>
                        <Field
                          :name="`questions[${questionIndex}].answers[${answerIndex}].text`"
                          type="text"
                          :id="`input-text-${answerIndex}`"
                          class="rounded-md"
                        />
                        <ErrorMessage
                          :name="`questions[${questionIndex}].answers[${answerIndex}].text`"
                        />
                      </div>
                      <div class="flex flex-col">
                        <label :for="`input-score-${answerIndex}`" class="font-bold">Балл</label>
                        <Field
                          :name="`questions[${questionIndex}].answers[${answerIndex}].score`"
                          type="number"
                          :id="`input-score-${answerIndex}`"
                          class="rounded-md"
                        />
                        <ErrorMessage
                          :name="`questions[${questionIndex}].answers[${answerIndex}].score`"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="() => removeAnswer(answerIndex)"
                      class="border-l border-l-slate-300 bg-rose-50 p-2 text-rose-800 transition-colors hover:bg-rose-100"
                    >
                      Удалить ответ
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  @click="() => addAnswer({ score: null, text: '' })"
                  class="rounded-md border border-sky-800 bg-sky-50 px-2 py-1 text-sky-800 transition-colors hover:bg-sky-100"
                >
                  Добавить ответ
                </button>
              </FieldArray>
            </div>
            <button
              class="block w-full border-t border-t-slate-300 bg-rose-50 p-2 text-rose-800 transition-colors hover:bg-rose-100"
              type="button"
              @click="() => removeQuestion(questionIndex)"
            >
              Удалить вопрос
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="() => addQuestion({ text: '', answers: [] })"
          class="self-start rounded-md border border-emerald-800 bg-emerald-50 p-2 text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          Добавить вопрос
        </button>
      </FieldArray>
    </div>

    <div v-show="currentTab === 'results'" class="">
      <FieldArray
        name="results"
        v-slot="{ fields: resultFields, push: addResult, remove: removeResult }"
      >
        <div class="mb-4 flex flex-col gap-4">
          <div
            v-for="(resultField, resultIndex) in resultFields"
            :key="resultField.key"
            class="overflow-hidden rounded-md border border-slate-300"
          >
            <div class="flex gap-4">
              <div class="flex flex-1 gap-4 p-4">
                <div class="flex flex-col">
                  <label :for="`input-min-${resultIndex}`" class="font-bold"
                    >Минимальный балл</label
                  >
                  <Field
                    :name="`results[${resultIndex}].min`"
                    type="number"
                    :id="`input-min-${resultIndex}`"
                    class="rounded-md"
                  />
                  <ErrorMessage :name="`results[${resultIndex}].min`" />
                </div>
                <div class="flex flex-col">
                  <label :for="`input-max-${resultIndex}`" class="font-bold"
                    >Максимальный балл</label
                  >
                  <Field
                    :name="`results[${resultIndex}].max`"
                    type="number"
                    :id="`input-max-${resultIndex}`"
                    class="rounded-md"
                  />
                  <ErrorMessage :name="`results[${resultIndex}].max`" />
                </div>
                <div class="flex flex-1 flex-col">
                  <label :for="`input-result-${resultIndex}`" class="font-bold">Результат</label>
                  <Field
                    :name="`results[${resultIndex}].text`"
                    type="text"
                    :id="`input-result-${resultIndex}`"
                    class="rounded-md"
                  />
                  <ErrorMessage :name="`results[${resultIndex}].text`" />
                </div>
              </div>
              <button
                type="button"
                @click="() => removeResult(resultIndex)"
                class="border-l border-l-slate-300 bg-rose-50 p-4 text-rose-800 hover:bg-rose-100"
              >
                Удалить результат
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          @click="() => addResult({ text: '', min: null, max: null })"
          class="rounded-md border border-emerald-800 bg-emerald-50 p-2 text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          Добавить результат
        </button>
      </FieldArray>
    </div>
  </form>
</template>
