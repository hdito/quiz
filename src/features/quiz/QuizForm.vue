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
  <main class="px-4">
    <h1 class="font-bold">{{ quiz.title }}</h1>
    <template v-if="position === null">
      <p>
        {{ quiz.description }}
      </p>
      <button @click="nextQuestion">Вперёд</button>
    </template>
    <h2 v-else-if="position === quiz.questions.length">
      {{ showUserResult() }}
    </h2>
    <template v-else>
      <h2>{{ currentQuestion.text }}</h2>
      <ul>
        <li v-for="answer in currentQuestion.answers" :key="answer.text">
          <input
            class="mr-2"
            :value="answer.score"
            type="radio"
            :name="currentQuestion.text"
            :id="`checkbox-${answer.text}`"
            v-model="userAnswers[position]"
          />
          <label :for="`checkbox-${answer.text}`">{{ answer.text }}</label>
        </li>
      </ul>
      <button @click="nextQuestion">Вперёд</button>
    </template>
  </main>
</template>
