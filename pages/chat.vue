<template>
    <div class="content">
        <div class="user-container">
            <h2 class="mb-3">Users</h2>
            <span class="sidebar-user" v-for="name in usernames">
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

useHead({ title: 'NuxtChat' })
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
watch([data, users], async () => {
    let temp = [store.username]
    if (users.value.length > 0) {
        temp = temp.concat(...users.value)
    } else {
        temp = temp.concat(...data.value)
    }
    usernames.value = [...new Set(temp.sort())]
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
    border: 1px solid #ccc;

    width: 100%;
    color: darkslategray;
}

.user-container {
    min-width: 15rem;
    background-color: white;
    border-right: 1px solid #ccc;
    padding: 1rem 1rem 1rem 5rem;

    h2 {
        font-weight: bold;
    }

    .sidebar-user {
        display: flex;
        align-items: center;
        margin-bottom: .5rem;

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