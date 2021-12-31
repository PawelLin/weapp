<template>
    <view class="">
        <text>123</text>
        <canvas :style="style" canvas-id="myCanvas"></canvas>
    </view>
</template>

<script setup>
import { reactive, getCurrentInstance  } from 'vue'
const data = [
    { name: "questions", value: 17 },
    { name: "schools", value: 25 },
    { name: "philosophers", value: 35 }
]
const chartWidth = 300
const chartHeight = 300
const margin = 15
const containerWidth = chartWidth + margin * 2
const containerHeight = chartHeight + margin * 2

const names = Array.from(data, item => item.name)
const values = Array.from(data, item => item.value)
const indices = Array.from(data, (item, index) => index)

const step = chartWidth / names.length
const barWidth = step * 0.8
const xs = Array.from(indices, index => index * step)
const y = chartHeight

const vmax = Math.max(...values)
const barHeights = Array.from(values, value => chartHeight * (value / vmax))
console.log(barHeights)
const nameColor = {
    questions: "#5B8FF9",
    philosophers: "#61DDAA",
    schools: "#65789B"
}
const colors = Array.from(names, name => nameColor[name])
const instance = getCurrentInstance()
const style = reactive({ width: '400px', height: '200px' })
function drawBar () {
    style.width = containerWidth + 'px'
    style.height = containerHeight + 'px'
    const ctx = uni.createCanvasContext('myCanvas', instance)
    // ctx.translate(margin, margin)
    for (const index of indices) {
        const color = colors[index]
        const x = xs[index]
        const barHeight = barHeights[index]
        const value = values[index]
        ctx.setFillStyle(color)
        ctx.fillRect(x, y - barHeight, barWidth, barHeight)
        
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.setFillStyle('white')
        ctx.setFontSize(30)
        ctx.fillText(value, x + barWidth / 2, y - barHeight / 2)
    }
    ctx.draw()
}
function drawRect () {
    const ctx = uni.createCanvasContext('myCanvas', instance)
    ctx.setFillStyle('red')
    ctx.setStrokeStyle('yellow')
    ctx.setLineWidth(10)
    ctx.strokeRect(0, 0, 100, 100)
    ctx.fillRect(5, 5, 95, 95)
    ctx.setFillStyle('black')
    ctx.setFontSize(26)
    ctx.fillText('hellow', 150, 100)
    ctx.draw()
}
function drawTranslate () {
    const ctx = uni.createCanvasContext('myCanvas', instance)
    ctx.setFillStyle('red')
    ctx.fillRect(0, 0, 50, 50)
    ctx.setFillStyle('blue')
    ctx.translate(50, 50)
    ctx.rotate(-Math.PI / 6)
    ctx.scale(2, 3)
    ctx.fillRect(0, 0, 50, 50)
    ctx.draw()
}
defineExpose({
    init: () => {
        // drawRect()
        // drawTranslate()
        drawBar()
    }
})

</script>

<style>
</style>
