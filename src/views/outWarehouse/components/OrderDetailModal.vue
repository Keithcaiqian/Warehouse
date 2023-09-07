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
            <div>{{
              formDataRef.purchase_amount ? priceTrans.show(formDataRef.purchase_amount) : 0
            }}</div>
          </n-form-item>
          <n-form-item label="订单总额（元）：">
            <div>{{ formDataRef.sell_amount ? priceTrans.show(formDataRef.sell_amount) : 0 }}</div>
          </n-form-item>
          <n-form-item label="订单利润（元）：">
            <div>{{ formDataRef.profit ? priceTrans.show(formDataRef.profit) : 0 }}</div>
          </n-form-item>
          <n-form-item label="订单状态：">
            <div>{{ OrderStatusMap[formDataRef.status!] }}</div>
          </n-form-item>
          <n-form-item label="备注：">
            <div class="textarea">{{ formDataRef.remark }}</div>
          </n-form-item>
          <n-form-item v-if="formDataRef.status === OrderStatusEnum.CANCEL" label="取消原因：">
            <div class="textarea">{{ formDataRef.cancel_reason }}</div>
          </n-form-item>
          <n-form-item v-if="formDataRef.status === OrderStatusEnum.REJECT" label="拒绝原因：">
            <div class="textarea">{{ formDataRef.reject_reason }}</div>
          </n-form-item>
          <n-form-item label="商品列表：">
            <div style="width: 900px">
              <vxe-grid ref="table$" v-bind="table" />
            </div>
          </n-form-item>
        </n-form>
      </n-spin>

      <OrderCheckModal ref="orderCheckModal$" @confirm="handleConfirm" />
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-button
          v-if="
            formDataRef.status === OrderStatusEnum.WAIT ||
            formDataRef.status === OrderStatusEnum.REJECT
          "
          @click="openOrderCheckModal"
          type="info"
          >审核</n-button
        >
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import useVxeTable from '@/hooks/useVxeTable';
  import useForm from '@/hooks/useForm';
  import { OrderStatusEnum, OrderStatusMap } from '@/enums/orderStatusEnum';
  import priceTrans from '@/utils/priceTransform';
  import OrderCheckModal from './OrderCheckModal.vue';

  import { getOrderDetail } from '@/api/order';

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const loading = ref(false);

  const { formDataRef, reset, setFormData } = useForm<{
    id: string | null;
    order_no: string | null;
    buyer: string | null;
    buyer_phone: string | null;
    purchase_amount: number | null;
    sell_amount: number | null;
    profit: number | null;
    status: string | null;
    remark: string | null;
    cancel_reason: string | null;
    reject_reason: string | null;
    create_user: string | null;
  }>({
    id: null,
    order_no: null,
    buyer: null,
    buyer_phone: null,
    purchase_amount: null,
    sell_amount: null,
    profit: null,
    status: null,
    remark: null,
    cancel_reason: null,
    reject_reason: null,
    create_user: null,
  });

  const { table, table$ } = useVxeTable({
    loading: false,
    columns: [
      { field: 'code', title: '商品编码', width: 150, resizable: true },
      { field: 'name', title: '商品名称', width: 150, resizable: true },
      {
        field: 'out_num',
        title: '卖出数量',
      },
      {
        field: 'purchase_price',
        title: '商品单价（元）',
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'purchase_amount',
        title: '成本（元）',
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'sell_price',
        title: '售卖单价（元）',
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'sell_amount',
        title: '售卖总价（元）',
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'profit',
        title: '利润（元）',
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
    ],
    data: [],
  });

  function getOrderDetailApi() {
    loading.value = true;
    getOrderDetail(formDataRef.value.id!)
      .then((res) => {
        loading.value = false;
        setFormData(res);
        table.data = res.product_list;
      })
      .catch(() => {
        loading.value = false;
      });
  }

  function open(id: string) {
    reset();
    formDataRef.value.id = id;
    table.data = [];
    showModal.value = true;

    getOrderDetailApi();
  }

  // 修改订单状态
  const orderCheckModal$ = ref();

  function openOrderCheckModal() {
    orderCheckModal$.value.open(formDataRef.value.id);
  }

  function handleConfirm() {
    emit('confirm');
    getOrderDetailApi();
  }

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
