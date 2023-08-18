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
          <n-button @click="handleAddCategoryModal" type="info">添加品类管理</n-button>
        </template>

        <template #options_default="{ row }">
          <n-button size="small" type="error">删除</n-button>
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
          <n-form-item label="商品品类" path="categoryName">
            <cn-input v-model:value="formDataRef.categoryName" />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showAddModal = false">关闭</n-button>
            <n-button type="info">确认</n-button>
          </n-space>
        </template>
      </n-modal>
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-button type="info">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';

  import useVxeTable from '@/hooks/useVxeTable';
  import useForm from '@/hooks/useForm';

  const showModal = ref(false);

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
      { field: 'category', title: '商品品类' },
      {
        field: 'options',
        title: '操作',
        width: 100,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [
      {
        category: 'ceshi',
      },
    ],
  });

  // 添加商品品类
  const showAddModal = ref(false);
  const formRef$ = ref();

  const { formDataRef, reset } = useForm<{
    categoryName: string | null;
  }>(
    {
      categoryName: null,
    },
    formRef$
  );

  const rules = {
    categoryName: {
      required: true,
      message: '请输入商品品类名称',
      trigger: ['blur'],
    },
  };

  function handleAddCategoryModal() {
    reset();
    showAddModal.value = true;
  }

  function open() {
    showModal.value = true;
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
