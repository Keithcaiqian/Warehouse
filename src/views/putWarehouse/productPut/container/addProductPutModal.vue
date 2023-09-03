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
    <template #header> 添加成品入库 </template>

    <n-form
      ref="formRef$"
      :model="formDataRef"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="商品" path="product_id">
        <n-select
          v-model:value="formDataRef.product_id"
          :options="product"
          filterable
          label-field="name"
          value-field="id"
        />
      </n-form-item>
      <n-form-item label="编码" path="code">
        <cn-input v-model:value="formDataRef.code" />
      </n-form-item>
      <n-form-item label="进货数量" path="purchase_num">
        <cn-input v-model:value="formDataRef.purchase_num" :allow-input="onlyNumber" />
      </n-form-item>
      <n-form-item label="进货单价（元）" path="purchase_price">
        <cn-input v-model:value="formDataRef.purchase_price" :allow-input="onlyNumber" />
      </n-form-item>
      <n-form-item label="备注" path="remark">
        <cn-input type="textarea" v-model:value="formDataRef.remark" maxlength="255" />
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

  import { addProductPut } from '@/api/product';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const emit = defineEmits(['confirm']);
  defineProps<{
    product: any[];
  }>();

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);

  const { formDataRef, reset, validate } = useForm<{
    product_id: string | null;
    code: string | null;
    purchase_num: number | null;
    purchase_price: number | null;
    remark: string | null;
  }>(
    {
      product_id: null,
      code: null,
      purchase_num: null,
      purchase_price: null,
      remark: null,
    },
    formRef$
  );

  const rules = {
    product_id: {
      required: true,
      message: '请选择商品',
      trigger: ['change'],
      validator(_rule: any, value: string) {
        return !!value;
      },
    },
    code: {
      required: true,
      message: '请输入编码',
      trigger: ['input', 'blur'],
    },
    purchase_num: {
      required: true,
      message: '请输入数量',
      trigger: ['input', 'blur'],
    },
    purchase_price: {
      required: true,
      message: '请输入价格',
      trigger: ['input', 'blur'],
    },
  };

  function open() {
    reset();
    showModal.value = true;
  }

  function handleConfirm() {
    validate().then(() => {
      loading.value = true;
      addProductPut({
        ...formDataRef.value,
        purchase_num: +formDataRef.value.purchase_num!,
        purchase_price: priceTrans.save(formDataRef.value.purchase_price!),
      })
        .then(() => {
          loading.value = false;
          message.success('添加成功');
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
