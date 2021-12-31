<template>
    <view class="skin">
        <view v-for="(item,index) in data" :key="index">
            {{item.name}}
            <image class="logo" :src="item.logo" mode="widthFix"></image>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
const data = ref([])
uniCloud.callFunction({
    name: 'skin'
}).then(res => {
    data.value = res.result.data
})
</script>

<style lang="scss">
.skin {
    .logo {
        width: 80rpx;
    }
}
</style>
