<template>
  <div ref="containerElRef" style="position: relative; height: 520px; width: 666px; border: 1px solid #ddd;">
    <WaterMark ref="waterMarkRef" :containerEl="containerElRef" :options="options">
      <h1> nadhladhahdkahdkhakd </h1>
      <button @click="changeWaterMark1">修改水印按钮 1</button>
      <button @click="changeWaterMark2">修改水印按钮 2</button>
      <button @click="showWaterMark">显示水印</button>
      <button @click="hiddenWaterMark">隐藏水印水印</button>
      <button @click="destroyWaterMark">销毁水印</button>
    </WaterMark>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WaterMark from '../components/WaterMark.vue'
import { WaterMarkOptions } from 'watermark-core';

type WaterMarkComponentOptions = Omit<WaterMarkOptions, 'getContainer'>

const containerElRef = ref<HTMLElement | null>(null)
const waterMarkRef = ref<{
  refresh: (options: WaterMarkOptions) => void
  draw: () => void
  hidden: () => void
  show: () => void
  destroy: () => void
} | null>(null)

const defaultOptions: WaterMarkComponentOptions = {
  // zIndex: 999999,
  rotate: -20,
  // gap: [24, 24],
  // offset: [0, 0],
  // // image: 'https://i2.hdslb.com/bfs/face/976d631ab78c2c668e3b42dde7aaefebc1045df6.jpg@240w_240h_1c_1s_!web-avatar-nav.avif',
  textAlign: 'center',
  // fontStyle: {
  //   fontSize: '16px',
  //   color: 'rgba(0, 0, 0, 0.15)',
  //   fontFamily: 'sans-serif',
  //   fontWeight: 'normal',
  // },
};

const options = ref<WaterMarkComponentOptions>({
  ...defaultOptions,
  content: ['jannkjdhachaoohkbcancmamc',
    '哈啰 hello hi Halo 哈喽',
    '你好我是？？',
    '你好我有一个帽衫']
})

const changeWaterMark1 = () => {
  options.value = {
    ...options.value,
    content: ['许鑫 北京神州云动科技股份有限公司', 'xuxin 199801', 'abcdefghijklmn']
  }
  // waterMarkRef.value.draw()
}
const changeWaterMark2 = () => {
  if (!waterMarkRef.value) return;
  options.value = {
    ...options.value,
    content: ['你好，再见！']
  }
  // waterMarkRef.value.draw()
}

const hiddenWaterMark = () => {
  waterMarkRef.value?.hidden()
}

const showWaterMark = () => {
  waterMarkRef.value?.show()
}

const destroyWaterMark = () => {
  waterMarkRef.value?.destroy()
}
</script>

<style scoped></style>