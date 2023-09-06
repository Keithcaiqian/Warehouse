<template>
    <n-input 
        :allow-input="noSideSpace" 
        clearable
        placeholder=""
        v-bind="$attrs"
    >
        <template v-for="(value, name) in $slots" #[name] = "slotData">
            <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
    </n-input>
</template>

<script lang='ts' setup>
    import { noSideSpace } from '@/utils/nativeAllowInput';
</script>

<style scoped lang='less'>

</style>