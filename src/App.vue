<script setup lang="ts"></script>

<template>
  <header class="flex items-center gap-4 p-4">
    <RouterLink class="underline" to="/">Тесты</RouterLink>
    <RouterLink class="underline" to="/create">Создать тест</RouterLink>
  </header>
  <RouterView />
</template>
