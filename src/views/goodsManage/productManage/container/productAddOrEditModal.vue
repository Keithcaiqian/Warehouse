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
    <template #header> {{ formDataRef.id ? '编辑' : '添加' }}成品 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="成品名称" path="name">
        <cn-input v-model:value="formDataRef.name" />
      </n-form-item>
      <n-form-item label="建议零售价（元）" path="advise_price">
        <cn-input v-model:value="formDataRef.advise_price" :allow-input="onlyNumber" />
      </n-form-item>
      <n-form-item label="单位" path="unit">
        <cn-input v-model:value="formDataRef.unit" />
      </n-form-item>
      <n-form-item label="是否为组装商品" path="isAssemble">
        <n-radio-group v-model:value="formDataRef.isAssemble" name="isAssemble">
          <n-space>
            <n-radio value="y"> 是 </n-radio>
            <n-radio value="n"> 否 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="商品品类" path="category" v-show="formDataRef.isAssemble === 'n'">
        <n-select
          v-model:value="formDataRef.category"
          :options="category"
          clearable
          label-field="name"
          value-field="id"
        />
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
  import { onlyNumber } from '@/utils/nativeAllowInput';
  import { addProduct, editProduct } from '@/api/product';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const emit = defineEmits(['confirm']);
  defineProps<{
    category: any[];
  }>();

  const showModal = ref(false);
  const loading = ref(false);
  const formRef$ = ref();

  const { formDataRef, reset, setFormData, validate } = useForm<{
    id: string | null;
    name: string | null;
    advise_price: number | null;
    unit: string | null;
    isAssemble: 'y' | 'n';
    category: string | null;
  }>(
    {
      id: null,
      name: null,
      advise_price: null,
      unit: null,
      isAssemble: 'n',
      category: null,
    },
    formRef$
  );

  const rules = {
    name: {
      required: true,
      message: '请输入商品名称',
      trigger: ['input', 'blur'],
    },
    advise_price: {
      required: true,
      message: '请输入建议零售价（元）',
      trigger: ['input', 'blur'],
    },
    unit: {
      required: true,
      message: '请输入单位',
      trigger: ['input', 'blur'],
    },
  };

  function handleConfirm() {
    validate().then(() => {
      let fn;
      let type;
      loading.value = true;
      // 编辑
      if (formDataRef.value.id) {
        fn = editProduct;
        type = 'edit';
      }
      // 添加
      else {
        fn = addProduct;
        type = 'add';
      }
      fn({
        ...formDataRef.value,
        advise_price: +formDataRef.value.advise_price!,
        category: formDataRef.value.isAssemble === 'y' ? null : formDataRef.value.category,
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

  function open(data) {
    console.log('data', data);
    if (data) {
      setFormData({
        ...data,
        advise_price: data.advise_price.toString(),
      });
    } else {
      reset();
    }
    showModal.value = true;
  }

  defineExpose({
    open,
  });
</script>

<style lang="less" scoped></style>
