<script setup lang="ts">
import { ErrorMessage, Field, FieldArray, useForm } from 'vee-validate'
import { nextTick, ref } from 'vue'
import { array, number, object, string } from 'yup'

const titleValidationSchema = string().required("Can't be empty")
const resultsValidationSchema = array(
  object({
    min: number().required("Can't be empty"),
    max: number().required("Can't be empty"),
    text: string().required("Can't be empty")
  })
).test({
  message: 'Quiz must have at least 1 result',
  test: (array) => array && array.length !== 0
})
const questionsValidationSchema = array(
  object({
    text: string().required("Can't be empty"),
    answers: array(
      object({
        score: number().required("Can't be empty"),
        text: string().required("Can't be empty")
      })
    ).test({
      message: 'Question must have at least 1 answer',
      test: (array) => array && array.length !== 0
    })
  })
).test({
  message: 'Quiz must have at least 1 question',
  test: (array) => array && array.length !== 0
})

const validationSchema = object({
  title: titleValidationSchema,
  results: resultsValidationSchema,
  questions: questionsValidationSchema
})

const { handleSubmit } = useForm({
  validationSchema
})

const onSubmit = handleSubmit((values) => {
  console.log(values)
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
              <button type="button" @click="() => addAnswer({ score: undefined, text: undefined })">
                Добавить ответ
              </button>
            </FieldArray>
            <button class="block" type="button" @click="() => removeQuestion(questionIndex)">
              Удалить вопрос
            </button>
          </div>
        </div>
        <button type="button" @click="() => addQuestion({ text: undefined, answers: [] })">
          Добавить вопрос
        </button>
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
        <button
          type="button"
          @click="() => addResult({ text: undefined, min: undefined, max: undefined })"
        >
          Добавить результат
        </button>
      </FieldArray>
    </div>
    <button type="submit">Опубликовать</button>
  </form>
</template>
