<template>
    <view class="skin">
        <scroll-view scroll-y="true" class="tabs">
            <view v-for="item in tabs" @click="setActive(item.key)" class="tabs-item" :key="item.key">
                <text :class="item.key === active ? 'active' : null">{{item.name}}</text>
            </view>
        </scroll-view>
        <scroll-view v-if="datas" class="contain" :scroll-into-view="active" scroll-y>
            <view v-for="({ types, key }) in tabs" class="list" :key="key" :id="key">
                <view v-for="({ data, type }, index) in types" :key="index">
                    <view class="images">
                        <image v-for="src in data" :src="datas[src].logo" class="image" mode="" :key="src"></image>
                    </view>
                    <image v-if="type" src="" class="type" mode=""></image>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import { QUALITY, POSITION } from '../../utils/enums.js'
import { tabs } from './enums.js'

const QUALITY_OBJ = QUALITY.reduce((item, { key, value }) => (item[key] = value) && item || item, {})
const POSITION_OBJ = POSITION.reduce((item, { key, value }) => (item[key] = value) && item || item, {})
const datas = ref(null)
onReady(() => {
    uniCloud.callFunction({
        name: 'skin'
    }).then(res => {
        const result = res.result.data
        const _datas = {}
        result.forEach(item => {
            _datas[`${item.number}${item.order}`] = item
        })
        datas.value = _datas
    })    
})
const active = ref('self')
const setActive = key => {
    active.value = key
}
</script>

<style lang="scss">
page {
    height: 100%;
}
.skin {
    display: flex;
    height: 100%;
    .tabs {
        width: 80px;
        color: #666666;
        text-align: center;
        &-item {
            padding: 8px 10px;
            .active {
                border: 1px solid #666666;
                border-radius: 5px;
            }
        }
    }
    .contain {
        flex: 1;
        .list {
            padding-top: 5px;
            min-height: 100%;
            box-sizing: border-box;
        }
        .image {
            margin: 5px 5px 0 0;
            width: 40px;
            height: 40px;
        }
    }
}
</style>
