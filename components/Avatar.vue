<template>
    <UAvatar :class="`avatar ${active ? 'active' : ''}`" :src="`https://robohash.org/${username}`" alt="Avatar" />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    username: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    }
})
</script>

<style scoped>
.avatar {
    background-color: white;
    border: #0f172929 solid 1px;

    &.active {
        border: #00dc82 solid 1px !important;
    }
}
</style>