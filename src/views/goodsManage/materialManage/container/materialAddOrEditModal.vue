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
        <n-button :loading="loading" @click="handleConfirm" type="info">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import useForm from '@/hooks/useForm';
  import { addMaterial, editMaterial } from '@/api/material';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, reset, setFormData, validate } = useForm<{
    id: string | null;
    name: string | null;
    unit: string | null;
  }>(
    {
      id: null,
      name: null,
      unit: null,
    },
    formRef$
  );

  const rules = {
    name: {
      required: true,
      message: '请输入原料名称',
      trigger: ['input', 'blur'],
    },
    unit: {
      required: true,
      message: '请输入单位',
      trigger: ['input', 'blur'],
    },
  };

  function open(data) {
    if (data) {
      setFormData({
        ...data,
      });
    } else {
      reset();
    }
    showModal.value = true;
  }

  function handleConfirm() {
    validate().then(() => {
      let fn;
      let type;
      loading.value = true;
      // 编辑
      if (formDataRef.value.id) {
        fn = editMaterial;
        type = 'edit';
      }
      // 添加
      else {
        fn = addMaterial;
        type = 'add';
      }
      fn({
        ...formDataRef.value,
      })
        .then(() => {
          loading.value = false;
          showModal.value = false;
          message.success(type === 'add' ? '添加成功' : '修改成功');
          emit('confirm', type);
        })
        .catch(() => {
          loading.value = false;
        });
    });
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
