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
      <n-form-item label="角色" path="role_code">
        <n-select
          v-model:value="formDataRef.role_code"
          :options="roleListFilter"
          label-field="name"
          value-field="code"
        />
      </n-form-item>
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
  import { RoleEnum, roleList } from '@/enums/roleEnum';

  import { changeUserInfo } from '@/api/system/user';

  const emit = defineEmits(['confirm']);

  // 去掉超级管理员
  const roleListFilter = roleList.filter((item) => item.code !== RoleEnum.SUPERADMIN);

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, setFormData, validate } = useForm<{
    user_id: string | null;
    phone: string | null;
    role_code: string | null;
  }>(
    {
      user_id: null,
      phone: null,
      role_code: null,
    },
    formRef$
  );

  const rules = {
    role_code: {
      required: true,
      message: '请选择角色',
      trigger: ['change'],
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

  function open(userInfo: any) {
    setFormData({
      user_id: userInfo.id,
      phone: userInfo.phone,
      role_code: userInfo.role_code,
    });
    console.log('formDataRef', formDataRef.value);
    loading.value = false;
    showModal.value = true;
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
