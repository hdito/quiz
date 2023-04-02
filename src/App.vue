<script setup lang="ts">
import { useCurrentUser, useIsCurrentUserLoaded } from 'vuefire'
import { signIn, signOut } from './firebase'

const isCurrentUserLoaded = useIsCurrentUserLoaded()

const user = useCurrentUser()
</script>

<template>
  <template v-if="isCurrentUserLoaded">
    <header class="flex items-center gap-4 p-4">
      <RouterLink class="underline" to="/">Тесты</RouterLink>

      <template v-if="user !== null">
        <RouterLink class="underline" to="/create">Создать тест</RouterLink>
        <button class="ml-auto" @click="signOut">Выйти</button>
      </template>

      <button class="ml-auto" v-else @click="signIn">Войти через Google</button>
    </header>

    <RouterView />
  </template>
</template>
