<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '1200px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header>成品转化：{{ product.name }}</template>
    <div class="main-page">
      <n-spin :show="loading">
        <vxe-grid ref="materialTable$" v-bind="materialTable">
          <template #toolbar_buttons>
            <n-h1>可组成成品数量：</n-h1>
          </template>

          <template #options_default="{ row }">
            <n-input-number v-model:value="row.selectNum" :min="0" :max="row.num" size="small" />
          </template>
        </vxe-grid>
        <div class="composition">
          <n-space class="item">
            <div>一个成品所需原料配比: </div>
            <n-tag type="info" v-for="item in product.composition" :key="item.id">
              {{ item.name }} x {{ item.num }}
            </n-tag>
          </n-space>
        </div>
      </n-spin>
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-popconfirm @positive-click="handleConfirm" @negative-click="() => {}">
          <template #trigger>
            <n-button :loading="btnLoading" type="info">确认</n-button>
          </template>
          确定转化吗？
        </n-popconfirm>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import useVxeTable from '@/hooks/useVxeTable';

  import { getProductAssembly } from '@/api/product';
  import { getInventoryMaterialListByIds } from '@/api/inventory';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const showModal = ref(false);
  const loading = ref(false);
  const btnLoading = ref(false);

  const product = ref<{
    id: string;
    name: string;
    composition: any[]; //原料组成配置
    [props: string]: any;
  }>({
    id: '',
    name: '',
    composition: [],
  });

  const { table: materialTable, table$: materialTable$ } = useVxeTable({
    loading: false,
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
      },
    },
    columns: [
      {
        title: '原料库存',
        children: [
          { type: 'seq', title: '序号', width: 60 },
          { field: 'code', title: '编码', resizable: true },
          { field: 'name', title: '原料名称', resizable: true },
          { field: 'num', title: '库存数量', resizable: true },
          { field: 'unit', title: '单位', resizable: true },
          { field: 'create_time', title: '入库时间', resizable: true },
          {
            field: 'options',
            title: '选择数量',
            width: 200,
            slots: {
              default: 'options_default',
            },
          },
        ],
      },
    ],
    data: [],
  });

  function handleConfirm() {
    console.log('dataok', materialTable.data);
  }

  function open(data) {
    console.log('data', data);
    materialTable.data = [];
    showModal.value = true;
    product.value = { ...data };

    loading.value = true;
    getProductAssembly(data.id)
      .then((res) => {
        product.value.composition = res;
        getInventoryMaterialListByIds(res.map((item) => item.id))
          .then((result) => {
            loading.value = false;
            console.log('result', result);
            materialTable.data = result.map((item) => ({
              ...item,
              selectNum: 0,
            }));
          })
          .catch(() => {
            loading.value = false;
          });
      })
      .catch(() => {
        loading.value = false;
      });
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped>
  .main-page {
    .composition {
      margin-top: 10px;
    }
  }
</style>
