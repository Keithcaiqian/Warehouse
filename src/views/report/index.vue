<template>
  <div class="main-page">
    <n-h1>报表</n-h1>

    <n-card class="card" hoverable>
      <div class="priceWrap">
        <div class="priceItem"
          >成本总额：￥<span class="price">{{ priceReactive.purchase_amount }}</span></div
        >
        <div class="priceItem"
          >销售总额：￥<span class="price">{{ priceReactive.sell_amount }}</span></div
        >
        <div class="priceItem"
          >总利润：￥<span class="price">{{ priceReactive.profit }}</span></div
        >
      </div>
    </n-card>

    <n-space>
      <div class="dateChoose">
        <div
          class="dateItem"
          :class="{
            active: dateRef === item.code,
          }"
          v-for="item in dateChoose"
          :key="item.code"
          @click="handleChangeData(item.code)"
        >
          {{ item.name }}
        </div>
      </div>
      <n-date-picker
        v-model:value="state.datetime"
        type="daterange"
        @confirm="dateRef = null"
        style="width: 270px"
      />
      <n-form-item label="销售者" label-placement="left">
        <cn-input v-model:value="state.buyer" style="width: 100px" />
      </n-form-item>
      <n-form-item label="商品分类" label-placement="left">
        <n-select
          v-model:value="state.category"
          :options="categoryList"
          label-field="name"
          value-field="id"
          placeholder=""
          style="width: 150px"
          clearable
        />
      </n-form-item>
      <n-form-item label="商品名称" label-placement="left">
        <cn-input v-model:value="state.product_name" style="width: 150px" />
      </n-form-item>
      <n-form-item label="编码" label-placement="left">
        <cn-input v-model:value="state.code" style="width: 150px" />
      </n-form-item>
      <n-button @click="handleSearch" type="info">查询</n-button>
    </n-space>

    <vxe-grid ref="table$" v-bind="table">
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { Search } from '@vicons/ionicons5';
  import useVxeTable from '@/hooks/useVxeTable';
  import { useProductCategory } from '@/hooks/useProductCategory';

  import ProductAddOrEditModal from './container/productAddOrEditModal.vue';
  import ProductCategoryManageModal from './container/productCategoryManageModal.vue';
  import AssemblySettingModal from './container/assemblySettingModal.vue';

  import { getReportList } from '@/api/report';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  // 商品分类
  const { categoryList, categoryMap, getProductCategoryListApi } = useProductCategory();

  const state = reactive({
    datetime: getDateTimeByCode('month'),
    buyer: null,
    code: null,
    category: null,
    product_name: null,
  });

  // 今日，本周，本月
  const dateChoose = [
    {
      code: 'day',
      name: '今日',
    },
    {
      code: 'week',
      name: '本周',
    },
    {
      code: 'month',
      name: '本月',
    },
  ];
  const dateRef = ref('month');

  function handleChangeData(code: string) {
    dateRef.value = code;
    state.datetime = getDateTimeByCode(code);
  }

  function getDateTimeByCode(code: string) {
    switch (code) {
      case 'day':
        return [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()];
        break;
      case 'week':
        return [dayjs().startOf('week').valueOf(), dayjs().endOf('day').valueOf()];
        break;
      case 'month':
        return [dayjs().startOf('month').valueOf(), dayjs().endOf('day').valueOf()];
        break;
    }
  }

  const priceReactive = reactive({
    purchase_amount: 0,
    sell_amount: 0,
    profit: 0,
  });

  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    getReportListApi();
  }

  function handleSearch() {
    handlePageChange({ currentPage: 1, pageSize: tablePage.pageSize });
  }

  const { table, table$ } = useVxeTable({
    loading: false,
    showFooter: true,
    seqConfig: {
      seqMethod({ rowIndex }) {
        return rowIndex + 1 + (tablePage.currentPage - 1) * tablePage.pageSize;
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60, fixed: 'left' },
      { field: 'product_name', title: '商品名称', fixed: 'left', resizable: true },
      { field: 'code', title: '编码', fixed: 'left', resizable: true },
      { field: 'num', title: '出货数量', resizable: true },
      { field: 'purchase_price', title: '进货单价', resizable: true },
      { field: 'purchase_amount', title: '进货总额', resizable: true },
      { field: 'advise_price', title: '建议零售价', resizable: true },
      { field: 'advise_amount', title: '建议销售总额', resizable: true },
      { field: 'sell_price', title: '售卖单价', resizable: true },
      { field: 'sell_amount', title: '售卖总价', resizable: true },
      {
        field: 'category_id',
        title: '商品品类',
        resizable: true,
        formatter({ cellValue }) {
          return categoryMap.value[cellValue] || cellValue;
        },
      },
      { field: 'create_time', title: '创建时间', resizable: true },
      { field: 'create_user', title: '销售者', resizable: true },
      { field: 'profit', title: '总利润', resizable: true, fixed: 'right' },
    ],
    data: [],
  });

  function getReportListApi() {
    table.loading = true;
    getReportList({
      currentPage: tablePage.currentPage,
      pageSize: tablePage.pageSize,
      params: {
        start_time: dayjs(state.datetime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_time: dayjs(state.datetime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        product_name: state.product_name,
        category_id: state.category,
        create_user: state.buyer,
        code: state.code,
      },
    })
      .then((res) => {
        table.loading = false;
        table.data = res.list;
        tablePage.total = res.total;

        priceReactive.purchase_amount = res.purchase_amount;
        priceReactive.sell_amount = res.sell_amount;
        priceReactive.profit = res.profit;
      })
      .catch(() => {
        table.loading = false;
      });
  }

  onMounted(() => {
    table.loading = true;
    getProductCategoryListApi()
      .then(() => {
        table.loading = false;
        getReportListApi();
      })
      .catch(() => {
        table.loading = false;
      });
  });
</script>

<style lang="less" scoped>
  .main-page {
    background-color: #fff;
    padding: 16px;
    .card {
      margin-bottom: 10px;
    }

    .dateChoose {
      display: flex;
      .dateItem {
        height: 34px;
        line-height: 34px;
        padding: 0 6px;
        cursor: pointer;
        background-color: #e9e9e9;
        border-right: 1px solid #ccc;
        &.active {
          background-color: #2080f0;
          color: #fff;
        }
      }
    }

    .priceWrap {
      display: flex;
      cursor: default;
      .priceItem {
        font-size: 20px;
        padding-right: 20px;
        .price {
          color: #f40;
        }
      }
    }
  }
</style>
