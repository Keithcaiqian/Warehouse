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
    <template #header> 修改手机号 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="手机号" path="phone">
        <cn-input v-model:value="formDataRef.phone" :allow-input="onlyNumber" :maxlength="11" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-button @click="handleConfirm" type="info">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import useForm from '@/hooks/useForm';
  import { onlyNumber } from '@/utils/nativeAllowInput';

  import { changeUserInfo } from '@/api/system/user';

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, setFormData, validate } = useForm<{
    user_id: string | null;
    phone: string | null;
  }>(
    {
      user_id: null,
      phone: null,
    },
    formRef$
  );

  const rules = {
    phone: {
      required: true,
      message: '请输入手机号',
      trigger: ['blur'],
    },
  };

  function handleConfirm() {
    validate().then(() => {
      loading.value = true;
      changeUserInfo({
        ...formDataRef.value,
      })
        .then(() => {
          loading.value = false;
          showModal.value = false;
          emit('confirm');
        })
        .catch(() => {
          loading.value = false;
        });
    });
  }

  function open(user_id: string) {
    setFormData({
      user_id,
    });
    loading.value = false;
    showModal.value = true;
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
