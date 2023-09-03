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
      <n-form-item label="是否为组装商品" path="is_assemble">
        <n-radio-group
          v-model:value="formDataRef.is_assemble"
          name="is_assemble"
          :disabled="formDataRef.id"
        >
          <n-space>
            <n-radio value="y"> 是 </n-radio>
            <n-radio value="n"> 否 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="商品品类" path="category_id" v-show="formDataRef.is_assemble === 'n'">
        <n-select
          v-model:value="formDataRef.category_id"
          :options="category"
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
  import priceTrans from '@/utils/priceTransform';
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
    id: string | number | null;
    name: string | null;
    advise_price: number | null;
    unit: string | null;
    is_assemble: 'y' | 'n';
    category_id: string | number | null;
  }>(
    {
      id: null,
      name: null,
      advise_price: null,
      unit: null,
      is_assemble: 'n',
      category_id: null,
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
    category_id: {
      required: true,
      message: '请选择商品品类',
      trigger: ['change'],
      validator(_rule: any, value: string) {
        return !!value;
      },
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
        advise_price: priceTrans.save(formDataRef.value.advise_price!),
        category_id: formDataRef.value.is_assemble === 'y' ? null : formDataRef.value.category_id,
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
        advise_price: priceTrans.show(data.advise_price),
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
