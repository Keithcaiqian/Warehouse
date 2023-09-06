<template>
  <NConfigProvider :locale="zhCN" :theme-overrides="themeOverrides" :date-locale="dateZhCN">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { zhCN, dateZhCN } from 'naive-ui';
  import { AppProvider } from '@/components/Application';
  import useTheme from '@/theme';

  const { themeOverrides } = useTheme();
</script>

<style lang="less">
  @import 'styles/index.less';
</style>
