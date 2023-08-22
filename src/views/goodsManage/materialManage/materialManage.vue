<template>
  <div class="main-page">
    <h1>原料管理</h1>

    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-button @click="openMaterialAddOrEditModal(null)" type="info">添加原料</n-button>
      </template>

      <template #toolbar_tools>
        <n-input
          v-model:value="searchRef"
          placeholder="搜索原料名称"
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
        <n-space>
          <n-button @click="openMaterialAddOrEditModal(row)" size="small" type="info"
            >修改</n-button
          >
          <n-popconfirm @positive-click="handleDeleteMeterial(row.id)" @negative-click="() => {}">
            <template #trigger>
              <n-button size="small" type="error">删除</n-button>
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

    <MaterialAddOrEditModal
      ref="materialAddOrEditModal$"
      @confirm="
        (type) => {
          getMaterialManageListApi(type === 'add' ? 1 : tablePage.currentPage);
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import useVxeTable from '@/hooks/useVxeTable';

  import MaterialAddOrEditModal from './container/materialAddOrEditModal.vue';

  import { getMaterialManageList, deleteMaterial } from '@/api/material';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

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
      { field: 'name', title: '原料名称' },
      { field: 'unit', title: '单位' },
      { field: 'update_time', title: '修改日期' },
      { field: 'create_time', title: '创建日期' },
      {
        field: 'options',
        title: '操作',
        fixed: 'right',
        width: 220,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getMaterialManageListApi(currentPage = 1) {
    return new Promise((resolve, reject) => {
      table.loading = true;
      getMaterialManageList()
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

  // 添加或编辑原料
  const materialAddOrEditModal$ = ref();

  function openMaterialAddOrEditModal(
    data: null | {
      [prop: string]: any;
    }
  ) {
    materialAddOrEditModal$.value.open(data);
  }

  // 删除原料
  function handleDeleteMeterial(id: string) {
    table.loading = true;
    deleteMaterial(id)
      .then(() => {
        table.loading = false;
        getMaterialManageListApi(tablePage.currentPage).then(() => {
          message.success('删除成功！');
        });
      })
      .catch(() => {
        table.loading = false;
      });
  }

  onMounted(() => {
    getMaterialManageListApi();
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
