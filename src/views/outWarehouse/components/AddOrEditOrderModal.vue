<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '800px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header> 添加/编辑订单 </template>
    <div class="content">
      <n-form
        ref="formRef$"
        :model="formDataRef"
        :rules="rules"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="买家姓名" path="buyer">
          <cn-input v-model:value="formDataRef.buyer" />
        </n-form-item>
        <n-form-item label="手机号" path="buyer_phone">
          <cn-input
            v-model:value="formDataRef.buyer_phone"
            max-length="11"
            :allow-input="onlyNumber"
          />
        </n-form-item>
        <n-form-item label="备注" path="remark">
          <cn-input v-model:value="formDataRef.remark" type="textarea" max-length="255" />
        </n-form-item>
      </n-form>

      <!-- <n-transfer
        v-model:value="value1"
        virtual-scroll
        :options="options1"
        source-filterable
        source-title=""
        :render-source-label="renderSourceLabel"
      /> -->
    </div>

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
  import { useProductList } from '@/hooks/useProductList';
  import { onlyNumber } from '@/utils/nativeAllowInput';
  import { cancelOrderById } from '@/api/order';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const emit = defineEmits(['confirm']);

  // 商品列表
  const { productList, getProductListApi } = useProductList();

  const showModal = ref(false);
  const formRef$ = ref();
  const spin = ref(false);
  const loading = ref(false);

  const { formDataRef, setFormData, validate } = useForm<{
    id: string | null;
    buyer: string | null;
    buyer_phone: string | null;
  }>(
    {
      id: null,
      buyer: null,
      buyer_phone: null,
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

    spin.value = true;
    getProductListApi()
      .then(() => {
        spin.value = false;
        console.log('productList', productList.value);
      })
      .catch(() => {
        spin.value = false;
      });
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
