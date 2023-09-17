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
    <template #header> 添加用户 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="用户名" path="username">
        <cn-input v-model:value="formDataRef.username" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <cn-input
          type="password"
          show-password-on="mousedown"
          :clearable="false"
          v-model:value="formDataRef.password"
        />
      </n-form-item>
      <n-form-item label="手机号" path="phone">
        <cn-input v-model:value="formDataRef.phone" :allow-input="onlyNumber" :maxlength="11" />
      </n-form-item>
      <n-form-item label="角色" path="role_code">
        <n-select
          v-model:value="formDataRef.role_code"
          :options="roleListFilter"
          label-field="name"
          value-field="code"
        />
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

  import { registerUser } from '@/api/system/user';

  const emit = defineEmits(['confirm']);

  // 去掉超级管理员
  const roleListFilter = roleList.filter((item) => item.code !== RoleEnum.SUPERADMIN);

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, reset, validate } = useForm<{
    username: string | null;
    password: string | null;
    phone: string | null;
    role_code: RoleEnum | null;
  }>(
    {
      username: null,
      password: null,
      phone: null,
      role_code: 'user',
    },
    formRef$
  );

  const rules = {
    username: {
      required: true,
      message: '请输入用户名',
      trigger: ['input', 'blur'],
    },
    password: {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
    phone: {
      required: false,
      message: '请输入手机号',
      trigger: ['input', 'blur'],
    },
    role_code: {
      required: true,
      message: '请选择角色',
      trigger: ['change'],
    },
  };

  function handleConfirm() {
    validate().then(() => {
      loading.value = true;
      registerUser({
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

  function open() {
    reset();
    loading.value = false;
    showModal.value = true;
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
