<template>
  <div class="main-page">
    <h1>原料管理</h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-button @click="openMaterialAddOrEditModal" type="info">添加原料</n-button>
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

    <MaterialAddOrEditModal ref="materialAddOrEditModal$" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Search } from '@vicons/ionicons5';

  import MaterialAddOrEditModal from './components/materialAddOrEditModal.vue';

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
    data: [
      {
        name: 'ceshi',
        unit: 'ceshi',
        update_time: 'ceshi',
        create_time: 'ceshi',
      },
    ],
  });

  const materialAddOrEditModal$ = ref();
  function openMaterialAddOrEditModal() {
    materialAddOrEditModal$.value.open();
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
