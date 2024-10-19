<template>
    <div class="container mx-auto flex items-center justify-between">
        <p class="logo-text"><img id="header-icon" src="/favicon.ico" alt="" />Nuxt<span>Chat</span></p>
        <div class="user-section flex" v-if="store.activeSession">
            <UAvatar style="background-color: white;" :src="`https://robohash.org/${store.username}`" alt="Avatar" />
            <div @click="toggleDropdown">
                <p class="ml-2 self-center">{{ store.username }}</p>
                <UIcon id="dropdown-icon"
                    :name="isDropdownActive ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'"
                    class="w-5 h-5 ml-2 color-white" />
            </div>
            <div id="dropdown-section" :class="isDropdownActive ? 'active' : ''">
                <UButton @click="handleLogout">logout</UButton>
            </div>
        </div>
    </div>
    <NuxtLoadingIndicator />
    <slot />
</template>

<script setup>
import { store } from '~/store'
import { ref } from 'vue';

const isDropdownActive = ref(false)

const toggleDropdown = () => {
    isDropdownActive.value = !isDropdownActive.value
}
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

#dropdown-icon {
    transition: all 1s ease-in-out;
}

#dropdown-section {
    position: absolute;
    width: 8rem;
    background-color: white;
    transform: translateY(3rem);
    display: none;
    padding: .5rem;
    border-radius: 10px;
    transition: all 1s ease-in-out;

    &.active {
        display: block;
    }

    button {
        width: 100%;
    }
}
</style>