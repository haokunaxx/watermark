<template>
  <Watermark ref="waterMarkRef" :containerEl="containerElRef" :options="options"
    style="height: 520px; width: 666px; border: 1px solid #ddd;">
    <h1> nadhladhahdkahdkhakd </h1>
    <button @click="changeWatermark1">修改水印按钮 1</button>
    <button @click="changeWatermark2">修改水印按钮 2</button>
    <button @click="showWatermark">显示水印</button>
    <button @click="hiddenWatermark">隐藏水印水印</button>
    <button @click="destroyWatermark">销毁水印</button>
  </Watermark>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WatermarkOptions } from 'watermark-core';
import Watermark from '../components/Watermark/index'
import { WatermarkExpose } from '../components/Watermark/src/type';

type WatermarkComponentOptions = Omit<WatermarkOptions, 'getContainer'>

const containerElRef = ref<HTMLElement | null>(null)
const waterMarkRef = ref<WatermarkExpose | null>(null)

const defaultOptions: WatermarkComponentOptions = {
  rotate: -20,
  textAlign: 'center',
};

const options = ref<WatermarkComponentOptions>({
  ...defaultOptions,
  content: ['jannkjdhachaoohkbcancmamc',
    '哈啰 hello hi Halo 哈喽',
    '你好我是？？',
    '你好我有一个帽衫']
})

const changeWatermark1 = () => {
  options.value = {
    ...options.value,
    content: ['adadaldadhahdkhakdha', 'xux 199801', 'abcdefghijklmn']
  }
}
const changeWatermark2 = () => {
  if (!waterMarkRef.value) return;
  options.value = {
    ...options.value,
    content: ['你好，再见！']
  }
}

const hiddenWatermark = () => {
  waterMarkRef.value?.destroy()
}

const showWatermark = () => {
  waterMarkRef.value?.draw()
}

const destroyWatermark = () => {
  waterMarkRef.value?.destroy()
}
</script>

<style scoped></style>