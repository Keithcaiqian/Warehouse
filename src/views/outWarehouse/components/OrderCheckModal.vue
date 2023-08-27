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
    <template #header> 订单审核 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="订单状态" path="status">
        <n-select
          v-model:value="formDataRef.status"
          :options="options"
          label-field="name"
          value-field="code"
        />
      </n-form-item>
      <n-form-item
        v-if="formDataRef.status === OrderStatusEnum.REJECT"
        label="拒绝原因"
        path="reject_reason"
      >
        <cn-input type="textarea" v-model:value="formDataRef.reject_reason" :max-length="255" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-button :loading="loading" @click="handleConfirm" type="info">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import useForm from '@/hooks/useForm';
  import { OrderStatusEnum } from '@/enums/orderStatusEnum';
  import { useMessage } from 'naive-ui';

  import { editOrderStatus } from '@/api/order';
  const message = useMessage();

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const loading = ref(false);

  const options = [
    {
      code: OrderStatusEnum.COMPLETE,
      name: '通过',
    },
    {
      code: OrderStatusEnum.REJECT,
      name: '拒绝',
    },
  ];

  const { formDataRef, reset, setFormData } = useForm<{
    id: string | null;
    status: OrderStatusEnum.COMPLETE | OrderStatusEnum.REJECT;
    reject_reason: string | null;
  }>({
    id: null,
    status: null,
    reject_reason: null,
  });

  const rules = {};

  function open(id: string) {
    setFormData({
      id,
      status: OrderStatusEnum.COMPLETE,
    });
    showModal.value = true;
  }

  function handleConfirm() {
    loading.value = true;
    editOrderStatus({
      ...formDataRef.value,
      reject_reason:
        formDataRef.value.status === OrderStatusEnum.REJECT
          ? formDataRef.value.reject_reason
          : null,
    })
      .then(() => {
        loading.value = false;
        message.success('修改状态成功');
        showModal.value = false;
        emit('confirm');
      })
      .catch(() => {
        loading.value = false;
      });
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped>
  .textarea {
    word-break: break-all;
    margin-bottom: 14px;
  }
</style>
