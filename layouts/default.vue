<template>
    <div class="container mx-auto flex items-center justify-between">
        <p class="logo-text"><img id="header-icon" src="/favicon.ico" alt="" />Nuxt<span>Chat</span></p>
        <div class="user-section flex" v-if="store.activeSession">
            <UAvatar style="background-color: white;" :src="`https://robohash.org/${store.username}`" alt="Avatar" />
            <UDropdown class="ml-3" :items="[[{
                label: 'Logout',
                icon: 'i-heroicons-power-20-solid',
                click: handleLogout
            }]]" :popper="{ placement: 'bottom-start' }">
                <div>
                    <p class="self-center">{{ store.username }}</p>
                    <UIcon id="dropdown-icon" name="i-heroicons-chevron-down-20-solid"
                        class="w-5 h-5 ml-2 color-white" />
                </div>
            </UDropdown>
        </div>
    </div>
    <NuxtLoadingIndicator />
    <slot></slot>
</template>

<script setup>
import { store } from '~/store'
import { ref } from 'vue';

const isDropdownActive = ref(false)

const handleLogout = () => {
    isDropdownActive.value = false
    navigateTo('/')
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #0f1729;
    max-width: none;
    padding: 1.5rem 5rem;
    height: 84px;
}

.logo-text {
    font-size: 1.5em;
    display: flex;
    align-items: center;

    span {
        color: #00dc82;
    }
}

.user-section {
    align-items: center;

    div {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
}

#header-icon {
    width: 40px;
}
</style>