<script setup lang="ts">
import { useErrorStore } from './errorStore'

const errorStore = useErrorStore()
</script>

<template>
  <div class="fixed bottom-4 right-4 flex max-w-xs flex-col gap-2">
    <div
      class="flex items-center justify-between gap-4 border border-black p-2"
      v-for="error in errorStore.errorArray"
      :key="error[0]"
    >
      <div>
        {{ error[1].message }}
      </div>
      <button @click="() => errorStore.clearError(error[0])">Очистить</button>
    </div>
  </div>
</template>
