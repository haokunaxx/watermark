<template>
  <div style="height: 100%;display: flex;justify-content: space-around;align-items: center;">
    <WaterMarkDemo />
  </div>
</template>

<script>
import WaterMarkDemo from './views/WaterMarkDemo.vue';
export default {
  name: 'App',
  components: {
    WaterMarkDemo
  },
}
</script>

<style>
html,
body {
  height: 100%;
}
</style>
