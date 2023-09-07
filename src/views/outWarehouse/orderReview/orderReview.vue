<template>
  <div class="main-page">
    <n-h1>订单审核列表</n-h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-space>
          <n-button @click="openAddOrEditOrderModal(null)" type="info">添加订单</n-button>
          <n-date-picker
            v-model:value="datetime"
            type="daterange"
            @update:value="handleChangeTime"
          />
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
            :options="UnOrderStatusList"
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
          class="tag"
          v-if="row.status === OrderStatusEnum.WAIT"
          @click="openOrderStatusHistoryModal(row.id)"
          type="info"
        >
          {{ OrderStatusMap[row.status] }}
        </n-tag>
        <n-tag
          class="tag"
          v-else-if="row.status === OrderStatusEnum.REJECT"
          @click="openOrderStatusHistoryModal(row.id)"
          type="error"
        >
          {{ OrderStatusMap[row.status] }}
        </n-tag>
      </template>

      <template #options_default="{ row }">
        <n-space>
          <n-button @click="openOrderDetailModal(row.id)" size="small" type="success"
            >详情</n-button
          >
          <n-button @click="openOrderCheckModal(row.id)" size="small" type="warning">审核</n-button>
          <n-popconfirm
            v-if="row.status === OrderStatusEnum.REJECT"
            @positive-click="handleSubmitOrderCheck(row.id)"
            @negative-click="() => {}"
          >
            <template #trigger>
              <n-button size="small" type="warning">提交审核</n-button>
            </template>
            确定提交审核吗？
          </n-popconfirm>
          <n-button @click="openAddOrEditOrderModal(row.id)" size="small" type="info"
            >修改</n-button
          >
          <n-popconfirm @positive-click="handleDeleteOrder(row.id)" @negative-click="() => {}">
            <template #trigger>
              <n-button :loading="deleteLoading" size="small" type="error">删除</n-button>
            </template>
            确定删除吗？
          </n-popconfirm>
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

    <OrderDetailModal ref="orderDetailModal$" @confirm="getOrderCheckListApi" />

    <OrderCheckModal ref="orderCheckModal$" @confirm="getOrderCheckListApi" />

    <OrderStatusHistory ref="orderStatusHistory$" />

    <AddOrEditOrderModal
      ref="addOrEditOrderModal$"
      @confirm="
        () => {
          tablePage.currentPage = 1;
          getOrderCheckListApi();
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import priceTrans from '@/utils/priceTransform';
  import useVxeTable from '@/hooks/useVxeTable';
  import { OrderStatusEnum, OrderStatusMap, UnOrderStatusList } from '@/enums/orderStatusEnum';
  import OrderDetailModal from '../components/OrderDetailModal.vue';
  import AddOrEditOrderModal from '../components/AddOrEditOrderModal.vue';
  import OrderCheckModal from '../components/OrderCheckModal.vue';
  import OrderStatusHistory from '../components/OrderStatusHistory.vue';

  import { getOrderCheckList, deleteOrder, editOrderStatus } from '@/api/order';

  import { useMessage } from 'naive-ui';

  const message = useMessage();

  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    getOrderCheckListApi();
  }

  // 默认取了一年的时间戳
  const datetime = ref([dayjs().subtract(1, 'year').valueOf(), Date.now()]);

  function handleChangeTime() {
    tablePage.currentPage = 1;
    getOrderCheckListApi();
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
      {
        field: 'sell_amount',
        title: '订单总额',
        resizable: true,
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
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
        width: 300,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getOrderCheckListApi() {
    table.loading = true;
    getOrderCheckList({
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

  // 添加或修改订单
  const addOrEditOrderModal$ = ref();

  function openAddOrEditOrderModal(id: null | string) {
    addOrEditOrderModal$.value.open(id);
  }

  // 删除订单
  const deleteLoading = ref(false);
  function handleDeleteOrder(id: string) {
    deleteLoading.value = true;
    deleteOrder(id)
      .then(() => {
        deleteLoading.value = false;
        message.success('删除成功！');
        getOrderCheckListApi();
      })
      .catch(() => {
        deleteLoading.value = false;
      });
  }

  // 修改订单状态
  const orderCheckModal$ = ref();

  function openOrderCheckModal(id: string) {
    orderCheckModal$.value.open(id);
  }

  // 订单状态历史
  const orderStatusHistory$ = ref();

  function openOrderStatusHistoryModal(id: string) {
    orderStatusHistory$.value.open(id);
  }

  // 提交审核（只有拒绝状态且订单创建者本人可以提交审核）
  function handleSubmitOrderCheck(id: string) {
    table.loading = true;
    editOrderStatus({
      id,
      status: OrderStatusEnum.WAIT,
    })
      .then(() => {
        table.loading = false;
        message.success('提交审核成功！');
        getOrderCheckListApi();
      })
      .catch(() => {
        table.loading = false;
      });
  }

  onMounted(() => {
    getOrderCheckListApi();
  });
</script>

<style lang="less" scoped>
  .main-page {
    background-color: #fff;
    padding: 16px;
    .tag {
      cursor: pointer;
    }
  }
</style>
