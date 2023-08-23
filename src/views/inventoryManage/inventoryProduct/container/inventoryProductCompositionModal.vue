<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '1100px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header> 原料组成 </template>

    <div class="content">
      <vxe-grid ref="table$" v-bind="table" />
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import useVxeTable from '@/hooks/useVxeTable';

  import { getInventoryProductComposition } from '@/api/inventory';

  const showModal = ref(false);

  const { table, table$ } = useVxeTable({
    loading: false,
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'code', title: '编码', resizable: true },
      { field: 'name', title: '原料名称', resizable: true },
      { field: 'num', title: '组成数量', resizable: true },
      { field: 'purchase_price', title: '进货单价（元）', resizable: true },
      { field: 'purchase_amount', title: '成本总额（元）', resizable: true },
      { field: 'unit', title: '单位', resizable: true },
    ],
    data: [],
  });

  function getInventoryProductCompositionApi(id: string) {
    table.loading = true;
    getInventoryProductComposition(id)
      .then((res) => {
        table.loading = false;
        table.data = res;
      })
      .catch(() => {
        table.loading = false;
      });
  }

  function open(id: string) {
    showModal.value = true;
    getInventoryProductCompositionApi(id);
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
