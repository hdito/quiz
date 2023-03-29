<script setup lang="ts">
import QuizPage from './QuizForm.vue'
import { useQuiz } from './useQuiz'

const { data, pending } = useQuiz()
</script>

<template>
  <div v-if="pending" class="px-4">Загрузка...</div>
  <QuizPage v-else :quiz="data!" />
</template>
