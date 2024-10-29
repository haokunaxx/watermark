<template>
  <div ref="containerElRef" :style="{ position: 'relative' }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import Watermark from 'watermark-core'
import { WatermarkOptions } from 'watermark-core';
type WatermarkComponentOptions = Omit<WatermarkOptions, 'getContainer'>

const props = defineProps<{
  options: WatermarkComponentOptions
}>()

const containerElRef = ref<HTMLElement | null>(null)

const computedOptions = computed(() => {
  return {
    ...props.options,
    getContainer: containerElRef.value
  }
})

let watermark: any
watch(() => computedOptions.value, (newVal) => {
  if (!watermark || !newVal) return;
  watermark.draw({
    ...newVal,
    getContainer: () => newVal.getContainer
  })
}, {
  immediate: true
})

onMounted(() => {
  watermark = new Watermark({
    ...computedOptions.value,
    getContainer: () => computedOptions.value.getContainer
  })
})

onUnmounted(() => {
  watermark && watermark.destroy()
})

defineExpose({
  draw: (options: WatermarkOptions) => { watermark.draw(options) },
  destroy: () => { watermark?.destroy() }
})
</script>

<style scoped></style>