<script setup lang="ts">
import type { Quiz } from '@/schemas/quizSchema'
import { computed, ref, toRefs } from 'vue'
import { useErrorStore } from '../clientErrors/errorStore'

const props = defineProps<{ quiz: Quiz }>()

const { quiz } = toRefs(props)

const position = ref<null | number>(null)
const userAnswers = ref<(number | null)[]>(Array(quiz.value.questions.length).fill(null))

const currentQuestion = computed(() => {
  if (position.value === null) throw Error('Must be used only inside answers')
  return quiz.value.questions[position.value]
})

const { addError } = useErrorStore()

function showUserResult() {
  if (userAnswers.value.some((answer) => answer === null)) {
    return
  }
  const totalScore = (userAnswers.value as number[]).reduce((total, answer) => (total += answer), 0)

  const userResult = quiz.value.results.find(
    (result) => result.min <= totalScore && result.max >= totalScore
  )
  if (!userResult) {
    addError('Некорретные условия теста')
    return
  }
  return userResult.text
}

function nextQuestion() {
  if (position.value === null) {
    position.value = 0
    return
  }
  if (userAnswers.value[position.value as number] === null) return
  position.value++
}
</script>

<template>
  <div class="m-auto max-w-md">
    <h1 class="text-center font-bold">{{ quiz.title }}</h1>
    <template v-if="position === null">
      <p class="mb-4 text-center">
        {{ quiz.description }}
      </p>
      <button
        @click="nextQuestion"
        class="m-auto block rounded-md bg-sky-600 px-2 py-1 text-white transition-shadow hover:shadow-md"
      >
        Вперёд
      </button>
    </template>
    <h2 v-else-if="position === quiz.questions.length" class="text-center">
      {{ showUserResult() }}
    </h2>
    <template v-else>
      <h2 class="mb-4 text-center">{{ currentQuestion.text }}</h2>
      <ul class="mb-4 space-y-2">
        <li
          v-for="answer in currentQuestion.answers"
          :key="answer.text"
          class="flex items-center rounded-full border border-slate-300"
        >
          <input
            class="mr-2 ml-2"
            :value="answer.score"
            type="radio"
            :name="currentQuestion.text"
            :id="`checkbox-${answer.text}`"
            v-model="userAnswers[position]"
          />
          <label :for="`checkbox-${answer.text}`" class="flex-1 py-1">{{ answer.text }}</label>
        </li>
      </ul>
      <button
        @click="nextQuestion"
        class="m-auto block rounded-md bg-sky-600 px-2 py-1 text-white transition-shadow hover:shadow-md"
      >
        Вперёд
      </button>
    </template>
  </div>
</template>
