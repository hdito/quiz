<script setup lang="ts">
import { toRefs } from 'vue'
import CreateQuizForm from './CreateQuizForm.vue'
import { useQuiz } from './useQuiz'

const props = defineProps<{ id: string }>()
const { id } = toRefs(props)

const { quiz, loading, error } = useQuiz(id)
</script>

<template>
  <div v-if="loading">Загрузка</div>
  <div v-else-if="error">
    <h2 class="font-bold">При загрузке данных возникла ошибка</h2>
    <p>Попробуйте зайти позднее</p>
  </div>
  <CreateQuizForm v-else :quiz="quiz!" />
</template>
