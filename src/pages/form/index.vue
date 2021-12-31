<template>
    <view class="form">
        <form>
            <view class="form-item">
                <view class="label required">名称</view>
                <input v-model="form.name" class="item" placeholder="请输入" />
            </view>
            <view class="form-item">
                <view class="label required">图标</view>
            </view>
            <view class="form-item">
                <view class="label required">编号</view>
                <input v-model="form.number" class="item" placeholder="请输入" />
            </view>
            <view class="form-item">
                <view class="label required">品质</view>
                <radio-group name="quality" class="item">
                    <label v-for="({ key, value }) in QUALITY" :key="key">
                        <radio :value="key" :checked="form.quality === key" /><text>{{value}}</text>
                    </label>
                </radio-group>
            </view>
            <view class="form-item">
                <view class="label required">类型</view>
                <view class="item form-item-types">
                    <view v-for="item in types" :style="{ backgroundImage: `url(${item.url})` }" :key="item.name" class="type"></view>
                    <view @click="uploadImg" class="type">新增</view>
                </view>
            </view>
            <view class="form-item">
                <view class="label">位置</view>
                <input v-model="form.position" class="item" placeholder="请输入" />
            </view>
            <view class="form-item">
                <view class="label">内容</view>
                <textarea v-model="form.content" class="item" placeholder="请输入"></textarea>
            </view>
        </form>
    </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { QUALITY } from '../../utils/enums.js'
const form = reactive({})
const types = ref([])
const getTypes = async () => {
    const res = await uniCloud.callFunction({
        name: 'image'
    })
    return res.result.data
}
onLoad(async () => {
    types.value = await getTypes()
})

const uploadImg = () => {
    uni.chooseImage({ count: 1 }).then(async res => {
        if (res.tempFilePaths.length) {
            const cloudPath = res.tempFiles[0].name
            const filePath = res.tempFilePaths[0]
            const { fileID } = await uniCloud.uploadFile({
                filePath,
                cloudPath
            })
            const result = await uniCloud.callFunction({
                name: 'image-add',
                data: {
                    name: cloudPath,
                    url: fileID,
                    type: 'type',
                }
            })
            uni.showToast({
                title: '上传成功'
            })
            types.value = await getTypes()
        }
    })
}
</script>

<style lang="scss">
.form {
    .form-item {
        display: flex;
    }
    .label {
        min-width: 100rpx;
        &.required {
            &::before {
                content: '*';
                color: red;
            }
        }
    }
    .item {
        flex: 1;
    }
    .form-item-types {
        display: flex;
        flex-wrap: wrap;
    }
    .type {
        width: 140rpx;
        height: 70rpx;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
}
</style>
