<template>
    <view class="index">
        <bar ref="barRef" />
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import bar from './bar.vue'
const barRef = ref(null)
onReady(() => {
    barRef.value.init()
})
    
</script>

<style>
</style>
