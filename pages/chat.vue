<template>
    <div class="content">
        <div class="user-container">
            <h2 class="mb-3">Users</h2>
            <span :class="`sidebar-user ${name == store.username ? 'active' : ''}`" v-for="name in usernames">
                <Avatar :username="name" active />
                <p class="ml-3">{{ name }}</p>
            </span>
        </div>

        <div class="chat-container">
            <div class="messages">
                <span v-for="message in messages">
                    <ChatBox class="mb-5" :active="usernames.includes(message.username)" :username="message.username"
                        :message="message.message" :self="store.username == message.username" />
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
import { useWebSocket } from '~/composables/useWebSocket'
import ChatBox from '~/components/ChatBox.vue'
import Avatar from '~/components/Avatar.vue'
import { ref } from 'vue'
import { useHead } from '@unhead/vue'

useHead({ title: 'NuxtChat - ' + store.username })
watchEffect(() => {
    if (store.username == '') navigateTo('/')
})

const { connect, sendMessage, users, messages } = useWebSocket({
    master: true,
    username: store.username
});
const { data, refresh } = await useFetch('/api/getUsers')

onMounted(() => {
    connect()
    refresh()
})

let usernames = ref([]);
watch([users], async () => {
    if (users.value.length == 0) return;
    usernames.value = [...new Set([store.username, ...users.value].sort())]
});
watch([data], async () => {
    usernames.value = [...new Set([store.username, ...data.value].sort())]
});

const inputValue = ref('')
const onInputSubmit = () => {
    if (inputValue.value == '') return
    sendMessage(inputValue.value)
    inputValue.value = ''
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

    .logo-text {
        font-size: 1.5em;

        span {
            color: #00dc82;
        }
    }
}

.content {
    display: flex;
    height: calc(100vh - 84px);
    margin: 0 auto;

    width: 100%;
    color: darkslategray;
}

.user-container {
    min-width: 15rem;
    background-color: rgb(250, 250, 250);
    border-right: 1px solid #ccc;
    padding: 1rem 0 1rem 0;

    h2 {
        margin-left: 5rem;
        font-weight: bold;
    }

    .sidebar-user {
        display: flex;
        align-items: center;
        padding-left: 5rem;
        margin-bottom: .5rem;
        padding-top: .5rem;
        border-top: rgba(119, 119, 119, 0.073) solid 2px;

        &:last-of-type {
            padding-bottom: .5rem;
            border-bottom: rgba(119, 119, 119, 0.073) solid 2px;
        }

        &.active {
            background-color: rgba(238, 238, 238, 0.355);

            p {
                color: #00b86b;
                font-size: large;
            }
        }

        img {
            border: #00dc82 solid 3px !important;
        }
    }
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
        border-top: 1px solid #0f1729;
        padding: 20px;
        background-color: #0f1729;

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