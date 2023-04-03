<script setup lang="ts">
defineProps<{ onClose: () => void }>()
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
    <div class="border border-black bg-white p-4">
      <h2 class="font-bold">Вы не можете опубликовать тест</h2>
      <p>В нём содержатся ошибки</p>
      <button @click="onClose">Закрыть</button>
    </div>
  </div>
</template>
