<script setup lang="ts">
import { store } from '~/store'
import { useHead } from '@unhead/vue'

useHead({ title: 'NuxtChat' })

onMounted(() => {
  store.activeSession = false
  store.username = ''
})

async function navigateToChat() {
  if (store.username == '') return
  store.activeSession = true
  navigateTo('/chat')
}
</script>

<template>
  <UCard class="card">
    <div class="contents">
      <UInput class="text-input" color="primary" placeholder="Input Username..." v-model="store.username"
        @keyup.enter="navigateToChat" />
      <UButton icon="i-heroicons-globe-alt" @click="navigateToChat">connect</UButton>
    </div>
  </UCard>
</template>

<style lang="scss" scoped>
.card {
  margin: 10rem;
  background-color: #0f1729;
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
