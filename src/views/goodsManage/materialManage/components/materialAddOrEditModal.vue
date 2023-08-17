<template>
  <n-modal
    v-model:show="showModal"
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
    <template #header> 添加原料 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="原料名称" path="name">
        <cn-input v-model:value="formDataRef.name" />
      </n-form-item>
      <n-form-item label="单位" path="unit">
        <cn-input v-model:value="formDataRef.unit" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-button type="info">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import useForm from '@/hooks/useForm';

  const showModal = ref(false);
  const formRef$ = ref();

  const { formDataRef } = useForm<{
    name: string | null;
    unit: string | null;
  }>(
    {
      name: null,
      unit: null,
    },
    formRef$
  );

  const rules = {
    name: {
      required: true,
      message: '请输入商品名称',
      trigger: ['blur'],
    },
    unit: {
      required: true,
      message: '请输入单位',
      trigger: ['blur'],
    },
  };

  function open() {
    showModal.value = true;
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
