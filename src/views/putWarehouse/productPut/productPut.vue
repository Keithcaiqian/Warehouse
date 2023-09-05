<template>
  <div class="main-page">
    <h1>成品入库</h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-space>
          <n-button @click="openAddProductPutModal" type="info">添加入库</n-button>
          <n-date-picker v-model:value="datetime" type="daterange" @confirm="handleChangeTime" />
        </n-space>
      </template>

      <template #toolbar_tools>
        <n-input
          v-model:value="searchRef"
          placeholder="搜索商品名称"
          style="width: 200px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <n-icon @click="handleSearch" size="18" color="#808695" style="cursor: pointer">
              <Search />
            </n-icon>
          </template>
        </n-input>
      </template>

      <template #is_assemble_default="{ row }">
        <n-tag :type="row.is_assemble === 'y' ? 'info' : 'warning'">
          {{ row.is_assemble === 'y' ? '是' : '否' }}
        </n-tag>
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

    <AddProductPutModal
      ref="addProductPutModal$"
      :product="productList"
      @confirm="
        () => {
          tablePage.currentPage = 1;
          getProductPutListApi();
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import dayjs from 'dayjs';
  import priceTrans from '@/utils/priceTransform';
  import useVxeTable from '@/hooks/useVxeTable';
  import { useProductList } from '@/hooks/useProductList';

  import AddProductPutModal from './container/addProductPutModal.vue';

  import { getProductPutList } from '@/api/product';

  // 商品列表
  const { productList, getProductListApi } = useProductList();

  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    getProductPutListApi();
  }

  // 默认取了一年的时间戳
  const datetime = ref([dayjs().subtract(1, 'year').valueOf(), Date.now()]);

  function handleChangeTime() {
    tablePage.currentPage = 1;
    getProductPutListApi();
  }

  // 搜索
  const searchRef = ref<null | string>(null);
  let searchFilter: null | string = null;

  function handleSearch() {
    searchFilter = searchRef.value;
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
      { type: 'seq', title: '序号', width: 60, resizable: true, fixed: 'left' },
      {
        field: 'product_name',
        title: '商品名称',
        resizable: true,
        fixed: 'left',
      },
      { field: 'code', title: '编码', width: 150, resizable: true, fixed: 'left' },
      { field: 'purchase_num', title: '进货数量', resizable: true },
      {
        field: 'purchase_price',
        title: '进货单价（元）',
        resizable: true,
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'purchase_amount',
        title: '进货总价（元）',
        resizable: true,
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'advise_price',
        title: '建议零售价（元）',
        resizable: true,
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
      {
        field: 'is_assemble',
        title: '是否组装品',
        resizable: true,
        slots: {
          default: 'is_assemble_default',
        },
      },
      { field: 'unit', title: '单位', resizable: true },
      {
        field: 'category_name',
        title: '商品品类',
        resizable: true,
      },
      {
        field: 'remark',
        title: '备注',
        resizable: true,
      },
      { field: 'create_time', title: '创建日期', resizable: true },
    ],
    data: [],
  });

  function getProductPutListApi() {
    table.loading = true;
    getProductPutList({
      currentPage: tablePage.currentPage,
      pageSize: tablePage.pageSize,
      params: {
        start_time: dayjs(datetime.value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_time: dayjs(datetime.value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        keyword: searchFilter,
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

  // 添加入库
  const addProductPutModal$ = ref();
  function openAddProductPutModal() {
    addProductPutModal$.value.open();
  }

  onMounted(() => {
    table.loading = true;
    getProductListApi()
      .then(() => {
        table.loading = false;
        getProductPutListApi();
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
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
  }
</style>
