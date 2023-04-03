<script setup lang="ts">
import { toRefs } from 'vue'
import QuizForm from './QuizForm.vue'
import { useQuiz } from './useQuiz'

const props = defineProps<{ id: string }>()
const { id } = toRefs(props)

const { data, loading, error } = useQuiz(id)
</script>

<template>
  <div v-if="loading" class="px-4">Загрузка...</div>
  <div v-else-if="error">
    <h2 class="font-bold">При загрузке данных возникла ошибка</h2>
    <p>Попробуйте зайти позднее</p>
  </div>
  <QuizForm v-else :quiz="data!" />
</template>
