<script setup lang="ts">
import { useErrorStore } from './errorStore'

const errorStore = useErrorStore()
</script>

<template>
  <ul class="fixed bottom-4 right-4 flex max-w-xs flex-col gap-2">
    <li
      class="flex items-center justify-between overflow-hidden rounded-md border border-slate-300 bg-white"
      v-for="error in errorStore.errorArray"
      :key="error[0]"
    >
      <div class="border-r border-r-slate-300 p-2">
        {{ error[1].message }}
      </div>
      <button @click="() => errorStore.clearError(error[0])" class="h-full p-2">Закрыть</button>
    </li>
  </ul>
</template>
