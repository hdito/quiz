<script setup lang="ts">
import { toRefs } from 'vue'
import type { ValidationError } from 'yup'

const props = defineProps<{ onClose: () => void; errors: ValidationError }>()
const { errors } = toRefs(props)
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
    <div class="border border-black bg-white p-4">
      <h2 class="font-bold">Вы не можете опубликовать этот тест из-за следующих ошибок:</h2>
      <ul class="list-inside list-disc">
        <li v-for="error in errors.errors" :key="error">
          {{ error }}
        </li>
      </ul>
      <button @click="onClose">Закрыть</button>
    </div>
  </div>
</template>
