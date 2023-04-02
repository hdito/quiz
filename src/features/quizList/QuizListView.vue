<script setup lang="ts">
import { collection } from 'firebase/firestore'
import { firestoreDefaultConverter, useCollection, useFirestore } from 'vuefire'
import { QuizSchema } from '@/schemas/quizSchema'

const db = useFirestore()

const quizes = useCollection(
  collection(db, 'quizes').withConverter({
    fromFirestore: (snapshot) => {
      const data = firestoreDefaultConverter.fromFirestore(snapshot)
      const parsedQuizes = QuizSchema.validateSync(data)
      return parsedQuizes
    },
    toFirestore: (data) => data
  })
)
</script>

<template>
  <main class="flex flex-col gap-4 px-4">
    <RouterLink
      v-for="quiz in quizes"
      :key="quiz.title"
      class="border border-black p-4 hover:underline"
      :to="`/quiz/${quiz.id}`"
    >
      {{ quiz.title }}
    </RouterLink>
  </main>
</template>
