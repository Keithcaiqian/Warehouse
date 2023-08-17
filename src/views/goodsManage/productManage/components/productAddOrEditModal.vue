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
    <template #header> 添加商品 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="商品名称" path="name">
        <cn-input v-model:value="formDataRef.name" />
      </n-form-item>
      <n-form-item label="建议零售价（元）" path="price">
        <cn-input v-model:value="formDataRef.price" :allow-input="onlyPositiveNumber" />
      </n-form-item>
      <n-form-item label="单位" path="unit">
        <cn-input v-model:value="formDataRef.unit" />
      </n-form-item>
      <n-form-item label="是否为组装商品" path="isAssemble">
        <n-radio-group v-model:value="formDataRef.isAssemble" name="isAssemble">
          <n-space>
            <n-radio value="Y"> 是 </n-radio>
            <n-radio value="N"> 否 </n-radio>
          </n-space>
        </n-radio-group>
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
  import { onlyPositiveNumber } from '@/utils/nativeAllowInput';

  const showModal = ref(false);
  const formRef$ = ref();

  const { formDataRef } = useForm<{
    name: string | null;
    price: number | null;
    unit: string | null;
    isAssemble: 'Y' | 'N';
  }>(
    {
      name: null,
      price: null,
      unit: null,
      isAssemble: 'N',
    },
    formRef$
  );

  const rules = {
    name: {
      required: true,
      message: '请输入商品名称',
      trigger: ['blur'],
    },
    price: {
      required: true,
      message: '请输入建议零售价（元）',
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
