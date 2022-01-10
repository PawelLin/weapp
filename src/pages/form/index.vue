<template>
    <view class="form">
        <form>
            <view class="form-item">
                <view class="label required">名称</view>
                <input v-model="form.name" class="item" placeholder="请输入" />
            </view>
            <view class="form-item">
                <view class="label required">图标</view>
                <view class="item">
                    <view @click="uploadImg('logo')" class="logo" :style="{ backgroundImage: form.logo && `url(${form.logo})` }"></view>
                </view>
            </view>
            <view class="form-item">
                <view class="label required">编号</view>
                <input v-model="form.number" class="item" placeholder="请输入" />
            </view>
            <view class="form-item">
                <view class="label required">序号</view>
                <input v-model="form.order" class="item" placeholder="请输入" />
            </view>
            <view class="form-item">
                <view class="label required">品质</view>
                <radio-group @change="qualityChange" name="quality" class="item">
                    <label v-for="({ key, value }) in QUALITY" class="radio-list" :key="key">
                        <radio :value="key" :checked="form.quality === key" />
                        <view class="radio-view">{{key}}{{value}}</view>
                    </label>
                </radio-group>
            </view>
            <view v-show="isHero" class="form-item">
                <view class="label required">位置</view>
                <radio-group @change="positionChange" name="position" class="item">
                    <label v-for="({ key, value }) in POSITION" class="radio-list" :key="key">
                        <radio :value="key" :checked="form.position === key" />
                        <view class="radio-view">{{key}}{{value}}</view>
                    </label>
                </radio-group>
            </view>
            <view v-show="isHero" class="form-item">
                <view class="label required">内容</view>
                <textarea v-model="form.content" class="item" placeholder="请输入"></textarea>
            </view>
            <button @click="submit" type="default">提交</button>
            <view class="form-item">
                <view class="label required">类型</view>
                <radio-group @change="typeChange" name="type" class="item">
                    <label v-for="item in types" class="radio-list" :key="item.key">
                        <radio :value="item.key" :checked="form.type === item.key" />
                        {{item.key}}
                        <view class="radio-view radio-image" :style="{ backgroundImage: `url(${item.url})` }"></view>
                    </label>
                    <view @click="uploadImg('type')" class="image-add">新增</view>
                </radio-group>
            </view>
        </form>
    </view>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { QUALITY, POSITION } from '../../utils/enums.js'
const form = reactive({})
const types = ref([])
const isHero = computed(() => form.quality === '0')
const qualityChange = data => {
    const value = data.detail.value
    form.quality = value
    if (value === '0') {
        form.type = '0'
    } else {
        form.position = ''
        form.content = ''
    }
}
const positionChange = data => {
    form.position = data.detail.value
}
const typeChange = data => {
    form.type = data.detail.value
}
const getTypes = async () => {
    const res = await uniCloud.callFunction({
        name: 'image',
        data: {
            type: 'type'
        }
    })
    return res.result.data
}
onLoad(async () => {
    types.value = await getTypes()
})
const submit = async () => {
    console.log(form)
    const result = await uniCloud.callFunction({
        name: 'skin-add',
        data: form
    })
    uni.showToast({
        title: '提交成功'
    })
    console.log(result)
}
const uploadImg = type => {
    uni.chooseImage({ count: 1 }).then(async res => {
        if (res.tempFilePaths.length) {
            const cloudPath = res.tempFiles[0].name
            form.number = cloudPath.replace(/(.*)-.*-.*/, '$1')
            form.order = cloudPath.replace(/.*-.*-(\d*).*/, '$1')
            const filePath = res.tempFilePaths[0]
            const checkResult = await uniCloud.callFunction({
                name: 'image',
                data: { name: cloudPath }
            })
            if (checkResult.result.isExist) {
                if (type === 'logo') {
                    form.logo = checkResult.result.data[0].url
                }
                uni.showToast({
                    title: '图片已存在',
                    icon: 'error'
                })
                return
            }
            const { fileID } = await uniCloud.uploadFile({
                filePath,
                cloudPath
            })
            const result = await uniCloud.callFunction({
                name: 'image-add',
                data: {
                    key: cloudPath.split('.')[0],
                    name: cloudPath,
                    url: fileID,
                    type,
                }
            })
            uni.showToast({
                title: '上传成功'
            })
            if (type === 'type') {
                types.value = await getTypes()
            }
            if (type === 'logo') {
                form.logo = fileID
            }
        }
    })
}
</script>

<style lang="scss">
.form {
    padding: 20rpx;
    .form-item {
        display: flex;
        & + .form-item {
            margin-top: 20rpx;
        }
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
        display: flex;
        flex-wrap: wrap;
    }
    .logo {
        width: 80rpx;
        height: 80rpx;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        border: 1px solid #d1d1d1;
        border-top-left-radius: 8rpx;
        border-bottom-right-radius: 8rpx;
    }
    .radio-list {
        display: flex;
        align-items: center;
        width: 33.33%;
    }
    .radio-view {
        width: 140rpx;
    }
    .radio-image {
        height: 70rpx;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
    .image-add {
        margin-left: 80rpx;
        width: 120rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-decoration: underline;
    }
    view[hidden] {
        display: none;
    }
}
</style>
