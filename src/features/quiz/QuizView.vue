<script setup lang="ts">
import QuizForm from './QuizForm.vue'
import { useQuiz } from './useQuiz'

const { data, pending } = useQuiz()
</script>

<template>
  <div v-if="pending" class="px-4">Загрузка...</div>
  <QuizForm v-else :quiz="data!" />
</template>
