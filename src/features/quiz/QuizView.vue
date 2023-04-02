<script setup lang="ts">
import { toRefs } from 'vue'
import QuizForm from './QuizForm.vue'
import { useQuiz } from './useQuiz'

const props = defineProps<{ id: string }>()
const { id } = toRefs(props)

const { data, pending } = useQuiz(id)
</script>

<template>
  <div v-if="pending" class="px-4">Загрузка...</div>
  <QuizForm v-else :quiz="data!" />
</template>
