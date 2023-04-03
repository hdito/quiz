<script setup lang="ts">
import { useCurrentUser, useIsCurrentUserLoaded } from 'vuefire'
import { signIn, signOut } from './firebase'
import { useRouter } from 'vue-router'

const isCurrentUserLoaded = useIsCurrentUserLoaded()

const user = useCurrentUser()

const router = useRouter()

function signOutWithRedirect() {
  signOut()
  router.push('/')
}
</script>

<template>
  <template v-if="isCurrentUserLoaded">
    <header class="sticky top-0 flex items-center gap-4 bg-white/50 p-4">
      <RouterLink class="underline" to="/">Тесты</RouterLink>

      <template v-if="user && user.uid">
        <RouterLink class="underline" to="/user">Мои тесты</RouterLink>
        <RouterLink class="underline" to="/create">Создать тест</RouterLink>
        <button class="ml-auto" @click="signOutWithRedirect">Выйти</button>
      </template>

      <button class="ml-auto" v-else @click="signIn">Войти через Google</button>
    </header>

    <RouterView />
  </template>
</template>
