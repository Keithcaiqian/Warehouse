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
    <template #header> 库存详情 </template>

    <div class="content">
      <n-button @click="openEditInventoryModal" type="info" style="margin-bottom: 10px"
        >盘库</n-button
      >
      <vxe-grid ref="table$" v-bind="table">
        <template #is_assemble_default="{ row }">
          <n-tag :type="row.is_assemble ? 'info' : 'warning'">
            {{ row.is_assemble ? '是' : '否' }}
          </n-tag>
        </template>

        <template #options_default="{ row }">
          <n-space>
            <n-button
              v-if="row.is_assemble"
              @click="openInventoryProductCompositionModal(row.id)"
              size="small"
              type="info"
              >原料组成</n-button
            >
          </n-space>
        </template>
      </vxe-grid>

      <InventoryProductCompositionModal ref="inventoryProductCompositionModal$" />
      <EditInventoryModal ref="editInventoryModal$" @confirm="refreshParent" />
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

  import InventoryProductCompositionModal from './inventoryProductCompositionModal.vue';
  import EditInventoryModal from './editInventoryModal.vue';

  import { getInventoryProductDetail } from '@/api/inventory';
  import { useMessage } from 'naive-ui';
  const message = useMessage();
  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const loading = ref(false);

  const { table, table$ } = useVxeTable({
    loading: false,
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'code', title: '编码', resizable: true },
      { field: 'name', title: '商品名称', resizable: true },
      { field: 'category_name', title: '商品分类', resizable: true },
      {
        field: 'is_assemble',
        title: '是否组装品',
        resizable: true,
        slots: {
          default: 'is_assemble_default',
        },
      },
      { field: 'num', title: '库存数量', resizable: true },
      { field: 'advise_price', title: '建议零售价（元）', resizable: true },
      { field: 'purchase_price', title: '进货单价（元）', resizable: true },
      { field: 'purchase_amount', title: '成本总额（元）', resizable: true },
      { field: 'unit', title: '单位', resizable: true },
      {
        field: 'options',
        title: '操作',
        fixed: 'right',
        width: 100,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getInventoryProductDetailApi(id: string) {
    table.loading = true;
    getInventoryProductDetail(id)
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
    getInventoryProductDetailApi(id);
  }

  // 原料组成
  const inventoryProductCompositionModal$ = ref();

  function openInventoryProductCompositionModal(id: string) {
    inventoryProductCompositionModal$.value.open(id);
  }

  // 盘库
  const editInventoryModal$ = ref();

  function openEditInventoryModal() {
    editInventoryModal$.value.open(table.data);
  }

  function refreshParent() {
    showModal.value = false;
    emit('confirm');
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
