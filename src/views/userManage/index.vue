<template>
  <div class="main-page">
    <h1>人员管理</h1>
    <vxe-grid ref="table$" v-bind="table">
      <!--将表单放在工具栏中-->
      <template #toolbar_buttons>
        <n-button @click="openAddUserModal" type="info">添加用户</n-button>
      </template>

      <template #status_default="{ row }: any">
        <n-popconfirm @positive-click="handleChangeStatus(row)" @negative-click="() => {}">
          <template #trigger>
            <n-switch
              :value="row.status"
              :loading="switchLoading"
              @click="handleStatusClick(row.status)"
              checked-value="y"
              unchecked-value="n"
            >
              <template #checked> 已启用 </template>
              <template #unchecked> 已禁用 </template>
            </n-switch>
          </template>
          确定{{ targetStatus === 'n' ? '禁用' : '启用' }}该用户吗？
        </n-popconfirm>
      </template>

      <template #options_default="{ row }: any">
        <n-space>
          <n-button @click="openEditPasswordModal(row.id)" size="small" type="info"
            >修改密码</n-button
          >
          <n-button @click="openUserInfoModal(row)" size="small" type="info">修改信息</n-button>
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

    <AddUserModal ref="addUserModal$" @confirm="getUserListApi" />
    <EditPasswordModal ref="editPasswordModal$" @confirm="getUserListApi" />
    <EditUserInfoModal ref="editUserInfoModal$" @confirm="getUserListApi" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';

  import useVxeTable from '@/hooks/useVxeTable';
  import EditPasswordModal from '@/components/EditPasswordModal/EditPasswordModal.vue';
  import EditUserInfoModal from './container/editUserInfoModal.vue';
  import AddUserModal from './container/addUserModal.vue';

  import { roleMap } from '@/enums/roleEnum/';
  import { getUserList, changeUserInfo } from '@/api/system/user';

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
      {
        field: 'role_code',
        title: '角色',
        formatter({ cellValue }) {
          return roleMap[cellValue];
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

  // 添加用户
  const addUserModal$ = ref();

  function openAddUserModal() {
    addUserModal$.value.open();
  }

  // 启用禁用
  const switchLoading = ref(false);
  const targetStatus = ref<'y' | 'n'>('y');

  function handleStatusClick(status: 'y' | 'n') {
    targetStatus.value = status === 'y' ? 'n' : 'y';
  }

  function handleChangeStatus(data: any) {
    console.log('data', data);
    switchLoading.value = true;
    changeUserInfo({
      user_id: data.id,
      status: targetStatus.value,
    })
      .then(() => {
        switchLoading.value = false;
        getUserListApi();
      })
      .catch(() => {
        switchLoading.value = false;
      });
  }

  //   修改密码
  const editPasswordModal$ = ref();

  function openEditPasswordModal(id: string) {
    editPasswordModal$.value.open(id);
  }

  //   修改用户信息
  const editUserInfoModal$ = ref();

  function openUserInfoModal(row: any) {
    editUserInfoModal$.value.open({
      ...row,
    });
  }

  onMounted(() => {
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
