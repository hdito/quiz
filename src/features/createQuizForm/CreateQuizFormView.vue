<script setup lang="ts">
import { toRefs } from 'vue'
import CreateQuizForm from './CreateQuizForm.vue'
import { useQuiz } from './useQuiz'

const props = defineProps<{ id: string }>()
const { id } = toRefs(props)

const { quiz, loading, error } = useQuiz(id)
</script>

<template>
  <main class="px-4 pb-4">
    <div v-if="loading">Загрузка</div>
    <div v-else-if="error">
      <h2>Произошла ошибка.</h2>
      <p>Попробуйте позже</p>
    </div>
    <CreateQuizForm v-else :quiz="quiz!" />
  </main>
</template>
