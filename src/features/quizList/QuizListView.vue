<script setup lang="ts">
import { useQuizList } from './useQuizList'

const { data: quizes, loading, error } = useQuizList()
</script>

<template>
  <main class="flex flex-col gap-4 px-4">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">
      <h2 class="font-bold">При загрузке данных возникла ошибка</h2>
      <p>Попробуйте зайти позднее</p>
    </div>
    <RouterLink
      v-else
      v-for="quiz in quizes"
      :key="quiz.title"
      class="border border-black p-4 hover:underline"
      :to="`/quiz/${quiz.id}`"
    >
      {{ quiz.title }}
    </RouterLink>
  </main>
</template>
