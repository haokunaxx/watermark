<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { watch, onMounted, computed, onUnmounted } from 'vue';
import WaterMark from 'watermark-core'
import { WaterMarkOptions } from 'watermark-core';

type WaterMarkComponentOptions = Omit<WaterMarkOptions, 'getContainer'>

const props = defineProps<{
  options: WaterMarkComponentOptions
  containerEl: HTMLElement | null
}>()

const computedOptions = computed(() => {
  return {
    ...props.options,
    getContainer: props.containerEl
  }
})

let waterMark: any

watch(() => computedOptions.value, (newVal) => {
  if (!waterMark || !newVal) return;
  waterMark.fresh({
    ...newVal,
    getContainer: () => newVal.getContainer
  })
}, {
  immediate: true
})

onMounted(() => {
  waterMark = new WaterMark({
    ...computedOptions.value,
    getContainer: () => computedOptions.value.getContainer
  })
})

onUnmounted(() => {
  waterMark && waterMark.destroy()
})

defineExpose({
  hidden() {
    waterMark?.hidden?.()
  },
  show() {
    waterMark?.show?.()
  },
  destroy() {
    waterMark?.destroy?.()
  }
})
</script>

<style scoped></style>