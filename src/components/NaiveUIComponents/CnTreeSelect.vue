<template>
  <n-tree-select
    placeholder=""
    :render-label="renderLabel"
    :clearable="true"
    filterable
    v-bind="$attrs"
  ></n-tree-select>
</template>

<script lang='ts' setup>
    import { TreeSelectOption } from 'naive-ui';
    import { h, useAttrs } from 'vue'

    const attrs = useAttrs();

    function renderLabel(info: { option: TreeSelectOption, checked: boolean, selected: boolean }){
        return h('div', {
            style: {
                wordBreak: 'keep-all',
            },
            onclick: labelClick
        }, info.option[attrs['label-field'] as string ||'label'])
    }

    function labelClick(e: any){
        // 勾选策略为子元素
        if(attrs['check-strategy'] !== 'child'){
            return;
        }
        let targetDom = e.target;
        while(targetDom){
            if(targetDom.className.split(' ').includes('n-tree-node')){
                targetDom = targetDom.getElementsByClassName('n-tree-node-switcher')[0];
                break;
            }else {
                targetDom = targetDom.parentNode
            }
        }
        targetDom.click()
    }
</script>

<style scoped lang='less'>

</style>