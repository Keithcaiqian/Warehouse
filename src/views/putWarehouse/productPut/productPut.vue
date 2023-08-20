<template>
  <div class="main-page">
    <h1>成品入库</h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-space>
          <n-button @click="openMaterialAddOrEditModal" type="info">添加入库</n-button>
          <n-date-picker v-model:value="datetime" type="daterange" @confirm="handleChangeTime" />
        </n-space>
      </template>

      <template #toolbar_tools>
        <n-input
          v-model:value="searchRef"
          placeholder="搜索"
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

      <template #options_default="{ row }">
        <n-button size="small" type="info">修改</n-button>
        <n-button size="small" type="error" style="margin-left: 6px">删除</n-button>
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import dayjs from 'dayjs';

  import useVxeTable from '@/hooks/useVxeTable';

  import { getProductPutList } from '@/api/product';
  import { onMounted } from 'vue';

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
        return rowIndex + 1 + (tablePage.currentPage - 1) * 10;
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'name', title: '原料名称' },
      { field: 'unit', title: '单位' },
      { field: 'update_time', title: '修改日期' },
      { field: 'create_time', title: '创建日期' },
      {
        field: 'options',
        title: '操作',
        width: 220,
        slots: {
          default: 'options_default',
        },
      },
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

  const materialAddOrEditModal$ = ref();
  function openMaterialAddOrEditModal() {
    materialAddOrEditModal$.value.open();
  }

  onMounted(() => {
    getProductPutListApi();
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
