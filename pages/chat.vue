<template>
    <div class="container mx-auto flex items-center justify-between">
        <p class="logo-text">Nuxt<span>Chat</span></p>
        <div class="flex">
            <p class="mr-2 self-center">{{ store.username }}</p>
            <UAvatar style="background-color: white;" :src="`https://robohash.org/${store.username}`" alt="Avatar" />
        </div>
    </div>
    <div class="content">
        <div class="user-container">
            <h2>Users</h2>
            <ul class="user-list">
                <li>User 1</li>
                <li>User 2</li>
                <li>User 3</li>
            </ul>
        </div>

        <div class="chat-container">
            <div class="messages">
                <span v-for="message in messages">
                    <div :class="(store.username == message.username) ? 'my-message' : ''">
                        {{ message.message }}
                    </div>
                </span>
            </div>
            <div class="textbox">
                <UInput class="text-input" color="primary" placeholder="Search..." v-model="inputValue"
                    @keyup.enter="onInputSubmit" />
                <UButton icon="i-heroicons-paper-airplane-20-solid" size="sm" color="primary" square variant="solid"
                    @click="onInputSubmit" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { store } from '~/store'
import { ref } from 'vue'

watchEffect(() => {
    if (store.username == '') navigateTo('/')
})

const inputValue = ref('')

const messages = [
    { username: 'jeb', message: 'hello' },
    { username: 'bob', message: 'hello too' },
    { username: 'test', message: 'hello too' },
]

const onInputSubmit = () => {
    console.log(inputValue.value);
}
</script>

<style scoped lang="scss">
input {
    color: darkslategray !important;
}

.container {
    background-color: #0f1729;
    max-width: none;
    padding: 1.5rem 5rem;
    height: 84px;
}

.logo-text {
    font-size: 1.5em;

    span {
        color: #00dc82;
    }
}

.content {
    display: flex;
    height: calc(100vh - 84px);
    margin: 0 auto;
    border: 1px solid #ccc;

    width: 100%;
    color: darkslategray;
}

.user-container {
    min-width: 20rem;
    background-color: #f4f4f4;
    border-right: 1px solid #ccc;
    padding: 1rem 1rem 1rem 5rem;
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;

        display: flex;
        flex-direction: column;

        .my-message {
            float: right;
        }
    }

    .textbox {
        display: flex;
        border-top: 1px solid #ccc;
        padding: 20px;

        .text-input {
            width: 100%;
            background-color: #f4f4f4;
            margin-right: .5rem;

            >* {
                color: darkslategray;
            }

        }
    }
}
</style>