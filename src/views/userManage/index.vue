<template>
  <div class="main-page">
    <h1>人员管理</h1>
    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-button @click="openMaterialAddOrEditModal" type="info">添加用户</n-button>
      </template>

      <template #status_default="{ row }: any">
        <n-switch v-model:value="row.status" checked-value="y" unchecked-value="n">
          <template #checked> 已启用 </template>
          <template #unchecked> 已禁用 </template>
        </n-switch>
      </template>

      <template #options_default="{ row }: row">
        <n-space>
          <n-button @click="openEditPasswordModal(row.id)" size="small" type="info"
            >修改密码</n-button
          >
          <n-button @click="openEditPhoneModal(row.id)" size="small" type="info"
            >修改手机号</n-button
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

    <EditPasswordModal ref="editPasswordModal$" @confirm="getUserListApi" />
    <EditPhoneModal ref="editPhoneModal$" @confirm="getUserListApi" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';

  import useVxeTable from '@/hooks/useVxeTable';
  import EditPasswordModal from '@/components/EditPasswordModal/EditPasswordModal.vue';
  import EditPhoneModal from './container/editPhoneModal.vue';

  import { roleList } from '@/enums/roleEnum/';
  import { getUserList } from '@/api/system/user';

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
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'username', title: '用户名' },
      { field: 'phone', title: '手机号' },
      {
        field: 'status',
        title: '启用状态',
        slots: {
          default: 'status_default',
        },
      },
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

  function getUserListApi() {
    getUserList().then((res) => {
      table.data = res;
      tablePage.total = res.length;
      console.log('res', res);
    });
  }

  //   修改密码
  const editPasswordModal$ = ref();

  function openEditPasswordModal(id: string) {
    editPasswordModal$.value.open(id);
  }

  //   修改用户手机号
  const editPhoneModal$ = ref();

  function openEditPhoneModal(id: string) {
    editPhoneModal$.value.open(id);
  }

  onMounted(() => {
    console.log('roleList', roleList);
    getUserListApi();
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
