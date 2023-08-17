<template>
    <n-input 
        :allow-input="noSideSpace" 
        clearable
        placeholder=""
        v-bind="$attrs"
    />
</template>

<script lang='ts' setup>
    import { noSideSpace } from '@/utils/nativeAllowInput';

</script>

<style scoped lang='less'>

</style>