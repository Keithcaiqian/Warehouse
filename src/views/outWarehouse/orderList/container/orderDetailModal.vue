<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '1000px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header> 订单详情 </template>

    <div class="content">
      <n-spin :show="loading">
        <n-form label-placement="left" :label-width="150" :show-feedback="false">
          <n-form-item label="订单号：">
            <div>{{ formDataRef.order_no }}</div>
          </n-form-item>
          <n-form-item label="买家姓名：">
            <div>{{ formDataRef.buyer }}</div>
          </n-form-item>
          <n-form-item label="创建者：">
            <div>{{ formDataRef.create_user }}</div>
          </n-form-item>
          <n-form-item label="买家手机号：">
            <div>{{ formDataRef.buyer_phone }}</div>
          </n-form-item>
          <n-form-item label="订单成本（元）：">
            <div>{{ formDataRef.purchase_amount }}</div>
          </n-form-item>
          <n-form-item label="订单总额（元）：">
            <div>{{ formDataRef.sell_amount }}</div>
          </n-form-item>
          <n-form-item label="订单利润（元）：">
            <div>{{ formDataRef.profit }}</div>
          </n-form-item>
          <n-form-item label="订单状态：">
            <div>{{ OrderStatusMap[formDataRef.status] }}</div>
          </n-form-item>
          <n-form-item label="备注：">
            <div class="textarea">{{ formDataRef.remark }}</div>
          </n-form-item>
          <n-form-item v-if="formDataRef.status === OrderStatusEnum.CANCEL" label="取消原因：">
            <div class="textarea">{{ formDataRef.cancel_reason }}</div>
          </n-form-item>
          <n-form-item label="商品列表：">
            <div style="width: 750px">
              <vxe-grid ref="table$" v-bind="table" />
            </div>
          </n-form-item>
        </n-form>
      </n-spin>
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
  import useForm from '@/hooks/useForm';
  import { getOrderDetail } from '@/api/order';

  import { OrderStatusEnum, OrderStatusMap } from '@/enums/orderStatusEnum';

  defineProps<{
    material: any[];
  }>();

  const showModal = ref(false);
  const loading = ref(false);

  const { formDataRef, reset, setFormData } = useForm<{
    order_no: string | null;
    buyer: string | null;
    buyer_phone: string | null;
    purchase_amount: number | null;
    sell_amount: number | null;
    profit: number | null;
    status: string | null;
    remark: string | null;
    cancel_reason: string | null;
    create_user: string | null;
  }>({
    order_no: null,
    buyer: null,
    buyer_phone: null,
    purchase_amount: null,
    sell_amount: null,
    profit: null,
    status: null,
    remark: null,
    cancel_reason: null,
    create_user: null,
  });

  const { table, table$ } = useVxeTable({
    loading: false,
    columns: [
      { field: 'product_name', title: '商品名称', width: 150, resizable: true },
      {
        field: 'out_num',
        title: '卖出数量',
      },
      { field: 'purchase_price', title: '商品单价（元）' },
      { field: 'purchase_amount', title: '成本（元）' },
      { field: 'sell_price', title: '售卖单价（元）' },
      { field: 'sell_amount', title: '售卖总价（元）' },
      { field: 'profit', title: '利润（元）' },
    ],
    data: [],
  });

  function open(id: string) {
    reset();
    table.data = [];
    showModal.value = true;

    loading.value = true;
    getOrderDetail(id)
      .then((res) => {
        loading.value = false;
        setFormData(res);
        table.data = res.product_list;
      })
      .catch(() => {
        loading.value = false;
      });
  }

  function handleConfirm() {}

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped>
  .textarea {
    word-break: break-all;
    margin-bottom: 14px;
  }
</style>
