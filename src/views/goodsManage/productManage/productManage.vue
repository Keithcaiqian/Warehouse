<template>
  <div class="main-page">
    <h1>成品管理</h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-button @click="openProductCategoryManageModal" type="info">商品品类管理</n-button>
        <n-button @click="openAddProductModal" type="info" style="margin-left: 10px"
          >添加商品</n-button
        >
      </template>

      <template #toolbar_tools>
        <n-input placeholder="搜索" style="width: 200px">
          <template #prefix>
            <n-icon size="18" color="#808695" style="cursor: pointer">
              <Search />
            </n-icon>
          </template>
        </n-input>
      </template>

      <template #options_default="{ row }">
        <n-button size="small" type="info">修改</n-button>
        <n-button size="small" type="success" style="margin-left: 6px"> 原料转化 </n-button>
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

    <!-- 添加修改商品 -->
    <ProductAddOrEditModal ref="productAddOrEditModal$" />
    <!-- 商品品类管理 -->
    <ProductCategoryManageModal ref="productCategoryManageModal$" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Search } from '@vicons/ionicons5';

  import ProductAddOrEditModal from './container/productAddOrEditModal.vue';
  import ProductCategoryManageModal from './container/productCategoryManageModal.vue';

  import useVxeTable from '@/hooks/useVxeTable';

  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
  }

  const { table, table$ } = useVxeTable({
    loading: false,
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
        tools: 'toolbar_tools',
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'name', title: '商品名称' },
      { field: 'price', title: '建议零售价（元）' },
      { field: 'unit', title: '单位' },
      { field: 'category', title: '商品品类' },
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
    data: [
      {
        name: 'ceshi',
        price: 'ceshi',
        unit: 'ceshi',
        category: 'ceshi',
        create_time: 'ceshi',
      },
    ],
  });

  //   添加编辑商品
  const productAddOrEditModal$ = ref();

  function openAddProductModal() {
    productAddOrEditModal$.value.open();
  }

  //  商品品类管理
  const productCategoryManageModal$ = ref();

  function openProductCategoryManageModal() {
    productCategoryManageModal$.value.open();
  }
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
