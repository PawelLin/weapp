<template>
    <view class="skin">
        <view v-for="(items, index) in data" class="list" :key="index">
            <view v-if="!index" class="item">
                <view class="logo"></view>
                <view class="name">名称</view>
                <view class="number">编号</view>
                <view class="type">类型</view>
                <view class="quality">品质</view>
                <view class="position">位置</view>
            </view>
            <view v-for="item in items" class="item" :key="item.number + item.order">
                <image class="logo" :src="item.logo" mode="widthFix"></image>
                <view class="name">{{item.name}}</view>
                <view class="number">{{item.number}}-{{item.order}}</view>
                <view class="type">{{item.type}}</view>
                <view class="quality">{{item.quality}}</view>
                <view class="position">{{item.position}}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { QUALITY, POSITION } from '../../utils/enums.js'
const QUALITY_OBJ = QUALITY.reduce((item, { key, value }) => (item[key] = value) && item || item, {})
const POSITION_OBJ = POSITION.reduce((item, { key, value }) => (item[key] = value) && item || item, {})
const data = ref([])
uniCloud.callFunction({
    name: 'skin'
}).then(res => {
    const result = res.result.data
    const _data = []
    const _dataIndex = []
    result.forEach(item => {
        const name = item.name.split('-')[0]
        const index = _dataIndex.indexOf(name)
        item.position = POSITION_OBJ[item.position]
        item.quality = item.quality + QUALITY_OBJ[item.quality]
        if (index > -1) {
            _data[index].push(item)
        } else {
            _dataIndex.push(name)
            _data.push([item])
        }
    })
    data.value = _data.reverse()
})
</script>

<style lang="scss">
.skin {
    .list + .list {
        margin-top: 20rpx;
    }
    .item {
        display: flex;
        align-items: center;
    }
    .name {
        margin-left: 20rpx;
        min-width: 260rpx;
    }
    .number {
        min-width: 130rpx;
    }
    .type {
        min-width: 70rpx;
    }
    .quality {
        min-width: 90rpx;
    }
    .logo {
        width: 80rpx;
    }
}
</style>