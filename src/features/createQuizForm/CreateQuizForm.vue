<script setup lang="ts">
import { doc, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { ErrorMessage, Field, FieldArray, useForm } from 'vee-validate'
import { nextTick, ref } from 'vue'
import { useFirestore } from 'vuefire'
import { QuizFormSchema } from '@/schemas/quizFormSchema'

const { handleSubmit, errors, values } = useForm({
  validationSchema: QuizFormSchema
})

const db = useFirestore()

const onSubmit = handleSubmit(async (values) => {
  const castedValues = QuizFormSchema.cast(values)
  const id = nanoid()

  try {
    await setDoc(doc(db, 'quizes', id), { ...castedValues, id: nanoid() })
  } catch (error) {
    console.log(error)
  }
}, onInvalidSubmit)

function onInvalidSubmit() {
  nextTick(() => {
    isShowErrors.value = true
    window.scroll({ top: 0, behavior: 'smooth' })
  })
}

const isShowErrors = ref(false)

function hideErrors() {
  isShowErrors.value = false
}
</script>

<template>
  <form class="flex flex-col gap-4 px-4" @submit="onSubmit">
    <pre>

      {{ errors }}
    </pre>
    <pre>

      {{ values }}
    </pre>
    <div v-if="isShowErrors">
      <p>Исправьте ошибки, чтобы опубликовать свой тест</p>
      <button type="button" @click="hideErrors">Скрыть</button>
    </div>
    <div class="bg-gray-300 p-4">
      <div class="flex justify-between">
        <h2 class="font-bold">Основные настройки</h2>
      </div>
      <div class="flex flex-col">
        <label for="quiz-title">Название</label>
        <Field name="title" id="quiz-title" type="text" />
        <ErrorMessage name="title" />
      </div>
      <div class="flex flex-col">
        <label for="quiz-description">Описание</label>
        <Field name="description" id="quiz-description" type="text" v-slot="{ field }">
          <textarea v-bind="field" />
        </Field>
        <ErrorMessage name="description" />
      </div>
    </div>

    <div class="bg-gray-300 p-4">
      <h2 class="font-bold">Вопросы</h2>
      <FieldArray
        name="questions"
        v-slot="{ fields: questionFields, push: addQuestion, remove: removeQuestion }"
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(questionField, questionIndex) in questionFields"
            :key="questionField.key"
            class="bg-red-300 p-4"
          >
            <div class="flex flex-col">
              <label :for="questionField.key.toString()">Вопрос</label>
              <Field
                :name="`questions[${questionIndex}].text`"
                type="text"
                :id="questionField.key.toString()"
              />
              <ErrorMessage :name="`questions[${questionIndex}].text`" />
            </div>
            <h3 class="font-bold">Ответы</h3>
            <FieldArray
              :name="`questions[${questionIndex}].answers`"
              v-slot="{ fields: answerFields, push: addAnswer, remove: removeAnswer }"
            >
              <div class="flex flex-col gap-4">
                <div
                  v-for="(answerField, answerIndex) in answerFields"
                  :key="answerField.key"
                  class="bg-blue-300 p-4"
                >
                  <div class="flex gap-4">
                    <div class="flex flex-1 flex-col">
                      <label :for="`input-text-${answerIndex}`">Ответ</label>
                      <Field
                        :name="`questions[${questionIndex}].answers[${answerIndex}].text`"
                        type="text"
                        :id="`input-text-${answerIndex}`"
                      />
                      <ErrorMessage
                        :name="`questions[${questionIndex}].answers[${answerIndex}].text`"
                      />
                    </div>
                    <div class="flex flex-col">
                      <label :for="`input-score-${answerIndex}`">Балл</label>
                      <Field
                        :name="`questions[${questionIndex}].answers[${answerIndex}].score`"
                        type="number"
                        :id="`input-score-${answerIndex}`"
                      />
                      <ErrorMessage
                        :name="`questions[${questionIndex}].answers[${answerIndex}].score`"
                      />
                    </div>
                    <button type="button" @click="() => removeAnswer(answerIndex)">
                      Удалить ответ
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" @click="() => addAnswer({})">Добавить ответ</button>
            </FieldArray>
            <button class="block" type="button" @click="() => removeQuestion(questionIndex)">
              Удалить вопрос
            </button>
          </div>
        </div>
        <button type="button" @click="() => addQuestion({})">Добавить вопрос</button>
      </FieldArray>
    </div>

    <div class="bg-gray-300 p-4">
      <h2 class="font-bold">Результаты</h2>
      <FieldArray
        name="results"
        v-slot="{ fields: resultFields, push: addResult, remove: removeResult }"
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(resultField, resultIndex) in resultFields"
            :key="resultField.key"
            class="bg-red-300 p-4"
          >
            <div class="flex gap-4">
              <div class="flex flex-col">
                <label :for="`input-min-${resultIndex}`">Минимальный балл</label>
                <Field
                  :name="`results[${resultIndex}].min`"
                  type="number"
                  :id="`input-min-${resultIndex}`"
                />
                <ErrorMessage :name="`results[${resultIndex}].min`" />
              </div>
              <div class="flex flex-col">
                <label :for="`input-max-${resultIndex}`">Максимальный балл</label>
                <Field
                  :name="`results[${resultIndex}].max`"
                  type="number"
                  :id="`input-max-${resultIndex}`"
                />
                <ErrorMessage :name="`results[${resultIndex}].max`" />
              </div>
              <div class="flex flex-1 flex-col">
                <label :for="`input-result-${resultIndex}`">Результат</label>
                <Field
                  :name="`results[${resultIndex}].text`"
                  type="text"
                  :id="`input-result-${resultIndex}`"
                />
                <ErrorMessage :name="`results[${resultIndex}].text`" />
              </div>
              <button type="button" @click="() => removeResult(resultIndex)">
                Удалить результат
              </button>
            </div>
          </div>
        </div>
        <button type="button" @click="() => addResult({})">Добавить результат</button>
      </FieldArray>
    </div>
    <button type="submit">Опубликовать</button>
  </form>
</template>
