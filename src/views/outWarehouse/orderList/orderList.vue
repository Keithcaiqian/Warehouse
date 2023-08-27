<template>
  <div class="main-page">
    <n-h1>订单列表</n-h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-space>
          <n-button @click="openAddOrderModal" type="info">添加订单</n-button>
          <n-date-picker v-model:value="datetime" type="daterange" @confirm="handleChangeTime" />
        </n-space>
      </template>

      <template #toolbar_tools>
        <n-space>
          <cn-input v-model:value="state.buyer" placeholder="输入买家姓名" style="width: 150px" />
          <cn-input
            v-model:value="state.create_user"
            placeholder="输入创建者姓名"
            style="width: 150px"
          />
          <n-select
            v-model:value="state.status"
            :options="OrderStatusList"
            label-field="name"
            value-field="code"
            placeholder="选择订单状态"
            style="width: 150px"
            clearable
          />
          <n-button @click="handleSearch" type="info">查询</n-button>
        </n-space>
      </template>

      <template #status_default="{ row }">
        <n-tag
          @click="openOrderStatusHistoryModal"
          :type="row.status === OrderStatusEnum.COMPLETE ? 'success' : 'error'"
        >
          {{ OrderStatusMap[row.status] }}
        </n-tag>
      </template>

      <template #options_default="{ row }">
        <n-space>
          <n-button @click="openOrderDetailModal(row.id)" size="small" type="success"
            >详情</n-button
          >
          <n-button
            v-if="row.status === OrderStatusEnum.COMPLETE"
            @click="openOrderCancelModal(row.id)"
            size="small"
            type="error"
            >取消订单</n-button
          >
        </n-space>
      </template>

      <template #pager>
        <!--使用 pager 插槽-->
        <vxe-pager
          :layouts="[
            'Sizes',
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'FullJump',
            'Total',
          ]"
          v-model:current-page="tablePage.currentPage"
          v-model:page-size="tablePage.pageSize"
          :total="tablePage.total"
          @page-change="handlePageChange"
        />
      </template>
    </vxe-grid>

    <OrderDetailModal ref="orderDetailModal$" />
    <OrderCancelModal ref="orderCancelModal$" @confirm="getOrderListApi" />
    <OrderStatusHistory ref="orderStatusHistory$" />
    <AddOrEditOrderModal
      ref="addOrEditOrderModal$"
      @confirm="
        () => {
          tablePage.currentPage = 1;
          getOrderListApi();
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import dayjs from 'dayjs';

  import useVxeTable from '@/hooks/useVxeTable';
  import { OrderStatusEnum, OrderStatusMap, OrderStatusList } from '@/enums/orderStatusEnum';
  import OrderDetailModal from '../components/OrderDetailModal.vue';
  import OrderCancelModal from './container/orderCancelModal.vue';
  import AddOrEditOrderModal from '../components/AddOrEditOrderModal.vue';
  import OrderStatusHistory from '../components/OrderStatusHistory.vue';

  import { getOrderList } from '@/api/order';

  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    getOrderListApi();
  }

  // 默认取了一年的时间戳
  const datetime = ref([dayjs().subtract(1, 'year').valueOf(), Date.now()]);

  function handleChangeTime() {
    tablePage.currentPage = 1;
    getOrderListApi();
  }

  // 搜索
  const state = reactive<{
    buyer: string | null;
    create_user: string | null;
    status: OrderStatusEnum.COMPLETE | OrderStatusEnum.CANCEL | null;
  }>({
    buyer: null,
    create_user: null,
    status: null,
  });

  function handleSearch() {
    handlePageChange({ currentPage: 1, pageSize: tablePage.pageSize });
  }

  const { table, table$ } = useVxeTable({
    loading: false,
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
        tools: 'toolbar_tools',
      },
    },
    seqConfig: {
      seqMethod({ rowIndex }) {
        return rowIndex + 1 + (tablePage.currentPage - 1) * tablePage.pageSize;
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60, resizable: true },
      { field: 'order_no', title: '订单号', width: 150, resizable: true },
      {
        field: 'buyer',
        title: '买家姓名',
        resizable: true,
      },
      { field: 'buyer_phone', title: '买家手机号', resizable: true },
      { field: 'sell_amount', title: '订单总额（元）', resizable: true },
      {
        field: 'status',
        title: '订单状态',
        resizable: true,
        slots: {
          default: 'status_default',
        },
      },
      {
        field: 'remark',
        title: '备注',
        resizable: true,
      },
      { field: 'create_user', title: '创建者', resizable: true },
      { field: 'create_time', title: '创建日期', resizable: true },
      {
        field: 'options',
        title: '操作',
        fixed: 'right',
        width: 200,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getOrderListApi() {
    table.loading = true;
    getOrderList({
      currentPage: tablePage.currentPage,
      pageSize: tablePage.pageSize,
      params: {
        start_time: dayjs(datetime.value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_time: dayjs(datetime.value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        ...state,
      },
    })
      .then((res) => {
        table.loading = false;
        table.data = res.list;
        tablePage.total = res.total;
      })
      .catch(() => {
        table.loading = false;
      });
  }

  // 查看详情
  const orderDetailModal$ = ref();

  function openOrderDetailModal(id: string) {
    orderDetailModal$.value.open(id);
  }

  // 取消订单
  const orderCancelModal$ = ref();

  function openOrderCancelModal(id: string) {
    orderCancelModal$.value.open(id);
  }

  // 添加订单
  const addOrEditOrderModal$ = ref();

  function openAddOrderModal() {
    addOrEditOrderModal$.value.open();
  }

  // 订单状态历史
  const orderStatusHistory$ = ref();

  function openOrderStatusHistoryModal(id: string) {
    orderStatusHistory$.value.open(id);
  }

  onMounted(() => {
    getOrderListApi();
  });
</script>

<style lang="less" scoped>
  .main-page {
    background-color: #fff;
    padding: 16px;
  }
</style>
