<template>
  <div class="main-page">
    <h1>成品管理</h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-space>
          <n-button @click="openProductCategoryManageModal" type="info">商品品类管理</n-button>
          <n-button @click="openAddOrEditProductModal(null)" :loading="addLoading" type="info"
            >添加成品</n-button
          >
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

      <template #options_default="{ row }: any">
        <n-space>
          <n-button @click="openAddOrEditProductModal(row)" size="small" type="info">修改</n-button>
          <n-popconfirm @positive-click="handleDeleteProduct(row.id)" @negative-click="() => {}">
            <template #trigger>
              <n-button size="small" type="error">删除</n-button>
            </template>
            确定删除吗？
          </n-popconfirm>
          <n-button v-if="row.is_assemble === 'y'" size="small" type="success"> 原料转化 </n-button>
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

    <!-- 添加修改商品 -->
    <ProductAddOrEditModal
      ref="productAddOrEditModal$"
      :category="categoryList"
      @confirm="
        (type) => {
          getProductManageListApi(type === 'add' ? 1 : tablePage.currentPage);
        }
      "
    />
    <!-- 商品品类管理 -->
    <ProductCategoryManageModal ref="productCategoryManageModal$" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import useVxeTable from '@/hooks/useVxeTable';

  import ProductAddOrEditModal from './container/productAddOrEditModal.vue';
  import ProductCategoryManageModal from './container/productCategoryManageModal.vue';

  import { getProductManageList, deleteProduct } from '@/api/product';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  // 成品列表
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
        return rowIndex + 1 + (tablePage.currentPage - 1) * 10;
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'name', title: '商品名称' },
      { field: 'advise_price', title: '建议零售价（元）' },
      { field: 'unit', title: '单位' },
      {
        field: 'category_name',
        title: '商品品类',
      },
      { field: 'update_time', title: '修改日期' },
      { field: 'create_time', title: '创建日期' },
      {
        field: 'options',
        title: '操作',
        width: 220,
        fixed: 'right',
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getProductManageListApi(currentPage = 1) {
    return new Promise((resolve, reject) => {
      table.loading = true;
      getProductManageList()
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

  //   添加或编辑商品
  const addLoading = ref(false);
  const editLoading = ref(false);
  const productAddOrEditModal$ = ref();

  function openAddOrEditProductModal(
    data: null | {
      [prop: string]: any;
    }
  ) {
    if (data) {
      editLoading.value = true;
    } else {
      addLoading.value = true;
    }

    productCategoryManageModal$.value
      .getCategoryList()
      .then((res) => {
        if (data) {
          editLoading.value = false;
        } else {
          addLoading.value = false;
        }
        categoryList.value = res;

        productAddOrEditModal$.value.open(data);
      })
      .catch(() => {
        if (data) {
          editLoading.value = false;
        } else {
          addLoading.value = false;
        }
      });
  }

  // 删除成品
  function handleDeleteProduct(id: string) {
    table.loading = true;
    deleteProduct(id)
      .then(() => {
        table.loading = false;
        getProductManageListApi(tablePage.currentPage).then(() => {
          message.success('删除成功！');
        });
      })
      .catch(() => {
        table.loading = false;
      });
  }

  //  商品品类管理
  const categoryList = ref([]);
  const productCategoryManageModal$ = ref();

  function openProductCategoryManageModal() {
    productCategoryManageModal$.value.open();
  }

  onMounted(() => {
    getProductManageListApi();
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
