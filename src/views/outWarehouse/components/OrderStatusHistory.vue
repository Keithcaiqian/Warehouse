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
    <template #header> 订单状态修改历史 </template>

    <div>
      <n-spin :show="loading">
        <n-timeline>
          <n-timeline-item
            v-for="item in list"
            :key="item.id"
            :type="getType(item.status)"
            :title="OrderStatusMap[item.status]"
            :time="item.create_time"
          >
            <template #default>
              <div class="content">
                <div class="description">{{ item.description }}</div>
                <div>{{ item.create_user }}</div>
              </div>
            </template>
          </n-timeline-item>
        </n-timeline>
      </n-spin>
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { OrderStatusMap } from '@/enums/orderStatusEnum';

  import { getOrderStatusHistory } from '@/api/order';

  const showModal = ref(false);
  const loading = ref(false);
  const list = ref<any[]>([]);

  function getType(prop: string) {
    switch (prop) {
      case 'wait':
        return 'warning';
      case 'reject':
        return 'error';
      case 'complete':
        return 'success';
      case 'cancel':
        return 'default';
      default:
        return 'default';
    }
  }

  function open(id: string) {
    showModal.value = true;
    list.value = [];
    loading.value = true;
    getOrderStatusHistory(id)
      .then((res) => {
        loading.value = false;
        list.value = res;
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
  .description {
    margin-bottom: 10px;
  }
  .textarea {
    word-break: break-all;
    margin-bottom: 14px;
  }
</style>
