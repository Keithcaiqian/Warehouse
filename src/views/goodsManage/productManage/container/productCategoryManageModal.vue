<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '600px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header> 商品品类管理 </template>

    <div>
      <vxe-grid ref="table$" v-bind="table">
        <!--将表单放在工具栏中-->
        <template #toolbar_buttons>
          <n-button @click="handleOpenAddCategoryModal" type="info">添加品类管理</n-button>
        </template>

        <template #options_default="{ row }: any">
          <n-popconfirm @positive-click="handleDelete(row.id)" @negative-click="() => {}">
            <template #trigger>
              <n-button size="small" type="error">删除</n-button>
            </template>
            确定删除吗？
          </n-popconfirm>
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

      <n-modal
        v-model:show="showAddModal"
        :auto-focus="false"
        size="small"
        preset="card"
        :style="{
          width: '400px',
        }"
        segmented
        bordered
        :mask-closable="false"
      >
        <template #header> 添加商品品类 </template>

        <n-form
          ref="formRef$"
          :model="formDataRef"
          :rules="rules"
          label-placement="left"
          label-width="auto"
        >
          <n-form-item label="商品品类" path="name">
            <cn-input v-model:value="formDataRef.name" />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showAddModal = false">关闭</n-button>
            <n-button @click="handleAddCategory" type="info">确认</n-button>
          </n-space>
        </template>
      </n-modal>
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';

  import useVxeTable from '@/hooks/useVxeTable';
  import useForm from '@/hooks/useForm';

  import { getProductCategoryList, addProductCategory, deleteProductCategory } from '@/api/product';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const listRef = ref([]); //列表所有数据
  const showModal = ref(false);
  const loading = ref(false);

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

  const { table, table$ } = useVxeTable({
    loading: false,
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
      },
    },
    seqConfig: {
      seqMethod({ rowIndex }) {
        return rowIndex + 1 + (tablePage.currentPage - 1) * 10;
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'name', title: '商品品类' },
      {
        field: 'options',
        title: '操作',
        width: 100,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  // 添加商品品类
  const showAddModal = ref(false);
  const formRef$ = ref();

  const { formDataRef, reset, validate } = useForm<{
    name: string | null;
  }>(
    {
      name: null,
    },
    formRef$
  );

  const rules = {
    name: {
      required: true,
      message: '请输入商品品类名称',
      trigger: ['input', 'blur'],
    },
  };

  function handleOpenAddCategoryModal() {
    reset();
    showAddModal.value = true;
  }

  function handleAddCategory() {
    validate().then(() => {
      loading.value = true;
      addProductCategory({
        ...formDataRef.value,
      })
        .then(() => {
          loading.value = false;
          showAddModal.value = false;
          message.success('添加成功');
          getProductCategoryListApi();
        })
        .catch(() => {
          loading.value = false;
        });
    });
  }

  // 删除商品品类
  function handleDelete(id: string) {
    table.loading = true;
    deleteProductCategory(id)
      .then(() => {
        table.loading = false;
        message.success('删除成功');
        getProductCategoryListApi(tablePage.currentPage);
      })
      .catch(() => {
        table.loading = false;
      });
  }

  // 获取列表
  function getProductCategoryListApi(currentPage = 1) {
    table.loading = true;
    getProductCategoryList()
      .then((res) => {
        table.loading = false;
        listRef.value = res;
        tablePage.total = res.length;

        handlePageChange({ currentPage, pageSize: tablePage.pageSize });
      })
      .catch(() => {
        table.loading = false;
      });
  }

  function open() {
    showModal.value = true;
    getProductCategoryListApi();
  }

  defineExpose({
    open,
    // 父组件获取列表 如果获取过则从缓存中获取，没有则调用接口
    getCategoryList() {
      return new Promise((resolve, reject) => {
        if (listRef.value.length === 0) {
          getProductCategoryList()
            .then((res) => {
              listRef.value = res;
              resolve([...res]);
            })
            .catch(() => {
              reject();
            });
        } else {
          resolve([...listRef.value]);
        }
      });
    },
  });
</script>

<style lang="less" scoped></style>
