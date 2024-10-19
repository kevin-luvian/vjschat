<script setup lang="ts">
import { store } from '~/store'
import { useHead } from '@unhead/vue'

useHead({ title: 'NuxtChat' })

async function navigateToChat() {
  navigateTo('/chat')
}
</script>

<template>
  <div class="container mx-auto flex items-center justify-between">
    <p class="logo-text">Nuxt<span>Chat</span></p>
  </div>
  <UCard class="card">
    <div class="contents">
      <UInput class="text-input" color="primary" placeholder="Input Username..." v-model="store.username"
        @keyup.enter="navigateToChat" />
      <UButton icon="i-heroicons-globe-alt" @click="navigateToChat">connect</UButton>
    </div>
  </UCard>
</template>

<style scoped>
.container {
  background-color: #0f1729;
  max-width: none;
  padding: 1.5rem 5rem;
  height: 84px;

  .logo-text {
    font-size: 1.5em;

    span {
      color: #00dc82;
    }
  }
}

.card {
  margin: 10rem
}

.contents {
  display: flex;
  padding: 2rem;
  width: 100%;

  div {
    flex: 1;
    margin-right: 1rem;
  }
}
</style>
