<template>
  <div
    class="loading"
    :style="{
      width: width,
      height: height,
      position: position,
    }"
  >
    <n-spin size="large" />
  </div>
</template>

<script lang="ts" setup>
  withDefaults(
    defineProps<{
      width: string;
      height: string;
      position: 'fixed' | 'absolute';
    }>(),
    {
      position: 'fixed',
    }
  );
</script>

<style scoped lang="less">
  .loading {
    z-index: 10000;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.1);
  }
</style>
