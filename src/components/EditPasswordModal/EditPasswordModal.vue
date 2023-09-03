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
    <template #header> 修改密码 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="本账号密码" path="password">
        <cn-input
          type="password"
          show-password-on="mousedown"
          :clearable="false"
          v-model:value="formDataRef.password"
        />
      </n-form-item>
      <n-form-item label="要修改的新密码" path="user_password">
        <cn-input
          type="password"
          show-password-on="mousedown"
          :clearable="false"
          v-model:value="formDataRef.user_password"
          @input="handlePasswordInput"
        />
      </n-form-item>
      <n-form-item label="重复新密码" path="repassword">
        <cn-input
          type="password"
          show-password-on="mousedown"
          :clearable="false"
          v-model:value="formDataRef.repassword"
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
  import { changePassword } from '@/api/system/user';

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, setFormData, validate } = useForm<{
    user_id: string | null;
    password: string | null;
    user_password: string | null;
    repassword: string | null;
  }>(
    {
      user_id: null,
      password: null,
      user_password: null,
      repassword: null,
    },
    formRef$
  );

  const rules = {
    password: {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
    user_password: {
      required: true,
      message: '请输入要修改用户的新密码',
      trigger: ['input', 'blur'],
    },
    repassword: {
      required: true,
      trigger: ['blur', 'password-input'],
      validator(_rule: any, value: string) {
        if (!value) {
          return new Error('请输入要修改用户的新密码');
        } else if (value !== formDataRef.value.user_password) {
          return new Error('两次密码输入不一致');
        }
        return true;
      },
    },
  };

  function handlePasswordInput() {
    if (formDataRef.value.repassword) {
      formRef$.value?.validate({ trigger: 'password-input' });
    }
  }

  function handleConfirm() {
    validate().then(() => {
      loading.value = true;
      changePassword({
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
