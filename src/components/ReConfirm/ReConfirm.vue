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
    <template #header> 操作确认 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="top"
      label-width="auto"
    >
      <n-form-item :label="`请输入:'${text}'`" path="text">
        <cn-input v-model:value="formDataRef.text" />
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

  const props = defineProps<{
    text: string;
    confirm: (props: any) => void;
    remove: () => void;
  }>();

  const showModal = ref(true);
  const formRef$ = ref();

  const { formDataRef, reset, validate } = useForm<{
    text: string | null;
  }>(
    {
      text: null,
    },
    formRef$
  );

  const rules = ref({
    text: {
      required: true,
      trigger: ['input', 'blur'],
      validator(_rule, value: string) {
        console.log('value', value, formDataRef.value.text);
        if (!value) {
          return new Error('不能为空');
        } else if (value !== props.text) {
          return new Error('输入不一致');
        }
        return true;
      },
    },
  });

  function handleConfirm() {
    validate().then(() => {
      props.confirm();
      showModal.value = false;
      props.remove();
    });
  }
</script>

<style lang="less" scoped></style>
