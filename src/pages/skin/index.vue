<template>
    <view class="skin">
        <scroll-view class="tabs" scroll-y>
            <view v-for="item in tabs" @click="setActive(item)" class="tabs-item" :key="item.key">
                <text :class="{ active: item.key === active, loading: item.key === loading }">{{item.name}}</text>
            </view>
        </scroll-view>
        <scroll-view class="contain" scroll-y>
            <template v-for="({ types, key }) in tabs" :key="key">
                <view v-if="activeList.includes(key)" v-show="active === key" class="list">
                    <view v-for="({ data, type }, index) in types" class="images-list" :key="index">
                        <view class="images">
                            <view v-for="src in data" class="image-view" :key="src">
                                <image v-if="datas[src]" :src="datas[src].logo" class="image" mode="" :key="src" lazy-load></image>
                            </view>
                        </view>
                        <image v-if="type && typePics[type]" :src="typePics[type]" class="type" mode="widthFix"></image>
                    </view>
                </view>
            </template>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import { tabs } from './enums.js'

const datas = reactive({})
const typePics = ref({})
const activeList = ref([])
const active = ref('anniversary')
const loading = ref('')
const setActive = async item => {
    const { key, types } = item
    active.value = key
    if (!activeList.value.includes(key)) {
        loading.value = key
        activeList.value.push(key)
        const { result: { data } } = await uniCloud.callFunction({
            name: 'skin',
            data: { keys: types.reduce((total, { data }) => total.concat(data), []) }
        })
        Object.assign(datas, data.reduce((result, item) => (result[`${item.number}${item.order}`] = item) && result || result, {}))
        loading.value = ''
    }
}
onReady(() => {
     uniCloud.callFunction({
        name: 'image',
        data: {
            type: 'type'
        }
    }).then(({ result: { data } }) => {
        typePics.value = data.reduce((result, item) => (result[item.key] = item.url) && result || result, {})
    }).catch(() => {})
    setActive(tabs.filter(item => item.key === active.value)[0])
})
</script>

<style lang="scss">
page {
    height: 100%;
}
$mainColor: #666666;
.skin {
    display: flex;
    height: 100%;
    .tabs {
        width: 80px;
        color: $mainColor;
        text-align: center;
        &-item {
            padding: 8px 10px;
            .active {
                border: 1px solid $mainColor;
                border-radius: 5px;
            }
            .loading {
                padding: 1px;
                border: 0;
                border-radius: 0;
                @keyframes linearGradientMove {
                    100% {
                        background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
                    }
                }
                background: 
                    linear-gradient(90deg, $mainColor 50%, transparent 0) repeat-x,
                    linear-gradient(90deg, $mainColor 50%, transparent 0) repeat-x,
                    linear-gradient(0deg, $mainColor 50%, transparent 0) repeat-y,
                    linear-gradient(0deg, $mainColor 50%, transparent 0) repeat-y;
                background-size: 4px 1px, 4px 1px, 1px 4px, 1px 4px;
                background-position: 0 0, 0 100%, 0 0, 100% 0;
                animation: linearGradientMove .3s infinite linear;
            }
        }
    }
    .contain {
        flex: 1;
        .list {
            padding: 5px 0;
            min-height: 100%;
            box-sizing: border-box;
        }
        .images-list {
            display: flex;
            align-items: center;
        }
        .images {
            display: flex;
            flex-wrap: wrap;
        }
        .image-view {
            position: relative;
            margin: 5px 5px 0 0;
            width: 40px;
            height: 40px;
            background-color: #ddd;
            background-image: linear-gradient(to right, transparent 0, transparent 5px, #fff 0, #fff 35px, transparent 0, transparent 40px);
            background-size: 100% 30px;
            background-repeat: no-repeat;
            background-position: center;
            box-sizing: border-box;
            overflow: hidden;
            &::before {
                content: '';
                position: absolute;
                top: 9px;
                right: 9px;
                width: 8px;
                height: 8px;
                background-color: #ddd;
                border-radius: 50%;
            }
            &::after {
                content: '';
                position: absolute;
                top: 16px;
                left: 20px;
                width: 23px;
                height: 60px;
                background-color: #ddd;
                transform: skew(15deg) rotate(-39deg);
            }
        }
        .image {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            z-index: 1;
        }
        .type {
            flex: 1;
            max-width: 95px;
            margin: auto 0;
        }
    }
}
</style>
