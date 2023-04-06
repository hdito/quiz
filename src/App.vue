<script setup lang="ts">
import { useCurrentUser, useIsCurrentUserLoaded } from 'vuefire'
import { signIn, signOut } from './firebase'
import { useRouter } from 'vue-router'
import ClientErrors from '@/features/clientErrors/ClientErrors.vue'
import { useErrorStore } from './features/clientErrors/errorStore'

const isCurrentUserLoaded = useIsCurrentUserLoaded()

const user = useCurrentUser()

const router = useRouter()

const { addError } = useErrorStore()

async function signOutWithRedirect() {
  try {
    await signOut()
  } catch (e) {
    addError('Не удалось выйти')
  }
  router.push('/')
}
</script>

<template>
  <template v-if="isCurrentUserLoaded">
    <header
      class="sticky top-0 flex items-center gap-6 bg-white/50 p-4 text-center shadow-md shadow-slate-200"
    >
      <RouterLink active-class="underline underline-offset-2 decoration-2" to="/">Тесты</RouterLink>

      <template v-if="user && user.uid">
        <RouterLink active-class="underline underline-offset-2 decoration-2" to="/user"
          >Мои тесты</RouterLink
        >
        <RouterLink
          class="rounded-md bg-sky-600 px-2 py-1 text-white transition-shadow hover:shadow-md"
          to="/create"
          >Создать тест</RouterLink
        >
        <button
          class="ml-auto rounded-md bg-slate-700 px-2 py-1 text-white transition-shadow hover:shadow-md"
          @click="signOutWithRedirect"
        >
          Выйти
        </button>
      </template>

      <button class="ml-auto" v-else @click="signIn">Войти через Google</button>
    </header>
    <main class="p-4">
      <RouterView />
    </main>
    <ClientErrors />
  </template>
</template>
