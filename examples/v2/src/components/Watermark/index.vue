<template>
  <div ref="containerElRef" :style="{ position: 'relative' }">
    <slot></slot>
  </div>
</template>

<script>
import Watermark from 'watermark-core'
export default {
  // eslint-disable-next-line
  name: 'Watermark',
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    computedOptions() {
      return {
        ...this.options,
        getContainer: () => this.$refs.containerElRef
      }
    }
  },
  watch: {
    computedOptions(newVal) {
      if (!this.watermark || !newVal) return;
      this.watermark.draw({ ...newVal })
    }
  },
  methods: {
    draw(options) {
      this.watermark.draw(options)
    },
    destroy() {
      this.watermark.destroy()
    }
  },
  created() {
    this.watermark = new Watermark({
      ...this.computedOptions,
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.watermark.draw()
    })
  },
  beforeDestroy() {
    this.watermark && this.watermark.destroy()
  }
}
</script>

<style scoped></style>