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
    <template #header> 取消订单 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="top"
      label-width="auto"
    >
      <n-form-item label="取消原因" path="reason">
        <cn-input type="textarea" v-model:value="formDataRef.reason" maxlength="255" />
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
  import { cancelOrderById } from '@/api/order';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, setFormData, validate } = useForm<{
    id: string | null;
    reason: string | null;
  }>(
    {
      id: null,
      reason: null,
    },
    formRef$
  );

  const rules = {
    reason: {
      required: true,
      message: '请输入原因',
      trigger: ['input', 'blur'],
    },
  };

  function open(id: string) {
    setFormData({
      id,
    });
    showModal.value = true;
  }

  function handleConfirm() {
    validate().then(() => {
      loading.value = true;
      cancelOrderById({
        ...formDataRef.value,
      })
        .then(() => {
          loading.value = false;
          message.success('取消成功');
          showModal.value = false;
          emit('confirm');
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
