<template>
  <div class="main-page">
    <n-h1>原料库存</n-h1>

    <vxe-grid ref="table$" v-bind="table">
      <template #toolbar_buttons>
        <div class="price"
          >总成本：<span class="text">{{ price }}</span></div
        >
      </template>

      <template #toolbar_tools>
        <n-input
          v-model:value="searchRef"
          placeholder="搜索原料名称"
          style="width: 200px"
          @keyup.enter="handleSearch"
          clearable
        >
          <template #prefix>
            <n-icon @click="handleSearch" size="18" color="#808695" style="cursor: pointer">
              <Search />
            </n-icon>
          </template>
        </n-input>
      </template>

      <template #options_default="{ row }">
        <n-button @click="openInventoryMaterialDetailModal(row.id)" size="small" type="info"
          >详情</n-button
        >
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

    <InventoryMaterialDetailModal
      ref="inventoryMaterialDetailModal$"
      @confirm="getInventoryMaterialListApi(tablePage.currentPage)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import useVxeTable from '@/hooks/useVxeTable';
  import NP from 'number-precision';
  import priceTrans from '@/utils/priceTransform';

  import InventoryMaterialDetailModal from './container/inventoryMaterialDetailModal.vue';

  import { getInventoryMaterialList } from '@/api/inventory';

  // 总成本
  const price = computed(() => {
    const total =
      table.data?.reduce((accumulator, current) => {
        return NP.plus(accumulator, current.purchase_amount);
      }, 0) || 0;
    return NP.divide(total, 100);
  });

  // 原料列表
  const originData = ref([]); //存一份原始列表数据
  const listRef = ref([]); //列表所有数据

  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    table.data = listRef.value.filter(
      (_item, index) =>
        index >= (tablePage.currentPage - 1) * tablePage.pageSize &&
        index < tablePage.currentPage * tablePage.pageSize
    );
  }

  // 搜索
  const searchRef = ref<null | string>(null);
  let searchFilter: null | string = null;

  function setListDataBySearchWord() {
    if (searchFilter) {
      listRef.value = originData.value.filter((item: any) =>
        (item.name || '').toUpperCase().includes(searchFilter!.toUpperCase())
      );
    } else {
      listRef.value = originData.value;
    }

    tablePage.total = listRef.value.length;
  }

  function handleSearch() {
    searchFilter = searchRef.value;
    setListDataBySearchWord();
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
      { type: 'seq', title: '序号', width: 60 },
      { field: 'name', title: '原料名称', resizable: true },
      { field: 'num', title: '库存数量', resizable: true },
      {
        field: 'purchase_amount',
        title: '成本总额（元）',
        resizable: true,
        formatter({ cellValue }) {
          return priceTrans.show(cellValue);
        },
      },
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

  function getInventoryMaterialListApi(currentPage = 1) {
    return new Promise((resolve, reject) => {
      table.loading = true;
      getInventoryMaterialList()
        .then((res) => {
          table.loading = false;
          originData.value = res;

          setListDataBySearchWord();
          handlePageChange({ currentPage, pageSize: tablePage.pageSize });

          resolve('success');
        })
        .catch(() => {
          table.loading = false;
          reject();
        });
    });
  }

  // 打开详情
  const inventoryMaterialDetailModal$ = ref();
  function openInventoryMaterialDetailModal(id: string) {
    inventoryMaterialDetailModal$.value.open(id);
  }

  onMounted(() => {
    getInventoryMaterialListApi();
  });
</script>

<style lang="less" scoped>
  .main-page {
    background-color: #fff;
    padding: 16px;
    .price {
      font-size: 22px;
      .text {
        color: #f40;
      }
    }
  }
</style>
