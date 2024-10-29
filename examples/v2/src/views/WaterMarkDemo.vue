<template>
  <Watermark ref="waterMarkRef" :options="options" style="height: 520px; width: 666px; border: 1px solid #ddd;">
    <h1> nadhladhahdkahdkhakd </h1>
    <button @click="changeWatermark1">修改水印按钮 1</button>
    <button @click="changeWatermark2">修改水印按钮 2</button>
    <button @click="showWatermark">显示水印</button>
    <button @click="hiddenWatermark">隐藏水印水印</button>
    <button @click="destroyWatermark">销毁水印</button>
  </Watermark>
</template>

<script>
import Watermark from '../components/Watermark/index'

const defaultOptions = {
  rotate: -20,
  textAlign: 'center',
};

export default {
  name: 'WatermarkDemo',
  components: {
    Watermark
  },
  data() {
    return {
      options: {
        ...defaultOptions,
        content: ['jannkjdhachaoohkbcancmamc',
          '哈啰 hello hi Halo 哈喽',
          '你好我是？？',
          '你好我有一个帽衫']
      }
    }
  },
  methods: {
    changeWatermark1() {
      this.options = {
        ...this.options,
        content: ['adadaldadhahdkhakdha', 'xux 199801', 'abcdefghijklmn']
      }
    },
    changeWatermark2() {
      this.options = {
        ...this.options,
        content: ['你好，再见！']
      }
    },
    hiddenWatermark() {
      this.$refs.waterMarkRef?.destroy()
    },
    showWatermark() {
      this.$refs.waterMarkRef?.draw()
    },
    destroyWatermark() {
      this.$refs.waterMarkRef?.destroy()
    }
  }
}
</script>

<style scoped></style>