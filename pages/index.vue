<script setup lang="ts">
import { store } from '~/store'

// const results = await useFetch('https://robohash.org/asds');

async function navigateToChat() {
  store.username = 'person'
  navigateTo('/chat')
}
</script>

<template>
  <div class="container my-5 mx-auto flex flex-col items-center justify-end">
    <UAvatar :src="`https://robohash.org/${store.username}`" alt="Avatar" />
  </div>
  <UButton @click="navigateToChat">test</UButton>
</template>

<style></style>
