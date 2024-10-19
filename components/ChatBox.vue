<template>
    <div v-if="self" class="chat-box self">
        <div class="chat-content">
            <div class="chat-header">
                <span class="username">{{ username }}</span>
                <span class="chat-date">{{ formattedDate }}</span>
            </div>
            <div class="chat-message">
                {{ message }}
            </div>
        </div>
    </div>
    <div v-else class="chat-box">
        <div class="avatar">
            <Avatar :active="active" :username="username" />
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="username">{{ username }}</span>
                <span class="chat-date">{{ formattedDate }}</span>
            </div>
            <div class="chat-message">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from '~/components/Avatar.vue';
import { ref } from 'vue'

const props = defineProps({
    active: {
        type: Boolean,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
    },
    self: {
        type: Boolean,
        required: true,
    }
})

const formattedDate = ref(new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
}).format(props.dateCreated ?? new Date()))
</script>

<style scoped>
.chat-box {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(72, 72, 72, 0.2), 0 6px 20px 0 rgba(74, 74, 74, 0.19);
    max-width: 70%;

    &.self {
        background-color: #00dc82;
        border-bottom: 1px solid #00dc82;
        margin-left: auto;
    }
}

.avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.chat-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: .5rem
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.username {
    font-weight: bold;
    margin-right: 10px;
}

.chat-date {
    font-size: 0.8rem;
    color: gray;
}

.chat-message {
    line-height: 1.5;
    font-size: .9em;
    margin-top: .5rem;
    margin-bottom: .5rem;
}
</style>