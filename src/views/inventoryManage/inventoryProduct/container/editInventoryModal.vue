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
    <template #header> 盘库 </template>

    <div class="content">
      <vxe-grid ref="table$" v-bind="table">
        <template #loss_num_default="{ row }">
          <cn-input v-model:value="row.loss_num" :allow-input="onlyNumber" />
        </template>

        <template #loss_reason_default="{ row }">
          <cn-input v-model:value="row.loss_reason" clearable />
        </template>
      </vxe-grid>
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-popconfirm @positive-click="handleConfirm" @negative-click="() => {}">
          <template #trigger>
            <n-button :loading="loading" size="small" type="info">修改</n-button>
          </template>
          确定修改吗
        </n-popconfirm>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import useVxeTable from '@/hooks/useVxeTable';
  import { onlyNumber } from '@/utils/nativeAllowInput';

  import { editInventoryProduct } from '@/api/inventory';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const loading = ref(false);

  const { table, table$ } = useVxeTable({
    loading: false,
    columns: [
      { field: 'code', title: '编码', resizable: true },
      { field: 'name', title: '商品名称', resizable: true },
      { field: 'num', title: '库存数量', width: 100, resizable: true },
      {
        field: 'loss_num',
        title: '损耗数量',
        resizable: true,
        width: 100,
        slots: {
          default: 'loss_num_default',
        },
      },
      {
        field: 'loss_reason',
        title: '损耗原因',
        resizable: true,
        width: 300,
        slots: {
          default: 'loss_reason_default',
        },
      },
    ],
    data: [],
  });

  function open(data) {
    showModal.value = true;
    table.data = data.map((item) => ({
      ...item,
      loss_num: 0,
      loss_reason: null,
    }));
  }

  function handleConfirm() {
    const editData: any[] = [];
    for (let i = 0; i < table.data.length; i++) {
      const data = table.data[i];
      if (data.loss_num) {
        if (data.loss_num > data.num) {
          return message.error('损耗数量不能超过库存数量');
        } else {
          editData.push({
            id: data.id,
            loss_num: data.loss_num,
            loss_reason: data.loss_reason,
          });
        }
      }
    }

    if (editData.length === 0) {
      return message.error('损耗数量不能为空');
    }

    loading.value = true;
    editInventoryProduct(editData)
      .then(() => {
        loading.value = false;
        message.success('修改成功！');
        showModal.value = false;
        emit('confirm');
      })
      .catch(() => {
        loading.value = false;
      });
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
