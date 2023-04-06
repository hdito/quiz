<script setup lang="ts">
defineProps<{ onClose: () => void }>()
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-slate-900/50 p-4">
    <div class="rounded-xl border border-slate-700 bg-white p-4">
      <h2 class="text-xl font-bold">Вы не можете опубликовать тест</h2>
      <p class="mb-4">В нём содержатся ошибки</p>
      <button
        @click="onClose"
        class="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-slate-800 transition-shadow hover:shadow-md"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>
