import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Error = {
  message: string
}

export const useErrorStore = defineStore('errors', () => {
  const errors = ref(new Map<string, Error>())

  function addError(message: string) {
    const id = nanoid()
    errors.value.set(id, { message })
  }

  function clearError(id: string) {
    errors.value.delete(id)
  }

  const errorArray = computed(() => errors.value.entries())

  return { errorArray, addError, clearError }
})
