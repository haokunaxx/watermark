<script setup lang="ts">
import { ref } from 'vue';
import WaterMarkDemo from './views/WaterMarkDemo.vue';
const visible = ref(true)
</script>

<template>
  <div style="height: 100%;display: flex;justify-content: space-around;align-items: center;">
    <button @click="visible = false">close</button>
    <WaterMarkDemo v-if="visible" />
    <WaterMarkDemo />
  </div>
</template>