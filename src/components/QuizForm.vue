<script setup lang="ts">
import { quizData } from '@/quizData'
import { computed, ref } from 'vue'

const position = ref<null | number>(null)
const userAnswers = ref<(number | null)[]>(Array(quizData.questions.length).fill(null))

const currentQuestion = computed(() => {
  if (position.value === null) throw Error('Must be used only inside answers')
  return quizData.questions[position.value]
})

function showUserResult() {
  if (userAnswers.value.some((answer) => answer === null))
    throw Error('Must be called only after user answered all questions')
  const totalScore = (userAnswers.value as number[]).reduce((total, answer) => (total += answer), 0)

  const userResult = quizData.results.find(
    (result) => result.minScore <= totalScore && result.maxScore >= totalScore
  )
  if (!userResult) throw Error('Incorrect quiz data')
  return userResult.text
}

function nextQuestion() {
  if (position.value === null) {
    position.value = 0
    return
  }
  position.value++
}
</script>

<template>
  <h1>{{ quizData.title }}</h1>
  <template v-if="position === null">
    <p>
      {{ quizData.description }}
    </p>
    <button @click="nextQuestion">Вперёд</button>
  </template>
  <h2 v-else-if="position === quizData.questions.length">
    {{ showUserResult() }}
  </h2>
  <template v-else>
    <h2>{{ currentQuestion.text }}</h2>
    <ul>
      <li v-for="answer in currentQuestion.answers" :key="answer.text">
        <input
          :value="answer.score"
          type="radio"
          :name="currentQuestion.text"
          :id="'checkbox' + answer.text"
          v-model="userAnswers[position]"
        />
        <label :for="'checkbox' + answer.text">{{ answer.text }}</label>
      </li>
    </ul>
    <button @click="nextQuestion">Вперёд</button>
  </template>
</template>
