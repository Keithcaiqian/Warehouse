<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '1200px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header>成品转化：{{ product.name }}</template>
    <div class="main-page">
      <n-spin :show="loading">
        <n-form
          ref="formRef$"
          :model="product"
          :rules="rules"
          label-placement="left"
          label-width="auto"
        >
          <n-form-item label="转化的成品编码" path="code">
            <cn-input v-model:value="product.code" />
          </n-form-item>
          <n-form-item label="备注" path="remark">
            <cn-input type="textarea" :max-length="255" v-model:value="product.remark" />
          </n-form-item>
        </n-form>
        <vxe-grid ref="materialTable$" v-bind="materialTable">
          <template #toolbar_buttons>
            <n-h1
              >可组成成品数量：<span style="color: #f00">{{ assembleNum }}</span>
            </n-h1>
          </template>

          <template #options_default="{ row }">
            <n-input-number
              :value="row.selectNum"
              @update:value="
                (val) => {
                  row.selectNum = val;
                  calcAssembleNum();
                }
              "
              :min="0"
              :max="row.num"
              size="small"
            />
          </template>
        </vxe-grid>
        <div class="composition">
          <n-space class="item">
            <div>一个成品所需原料配比: </div>
            <n-tag type="info" v-for="item in product.composition" :key="item.id">
              {{ item.name }} x {{ item.num }}
            </n-tag>
          </n-space>
        </div>
      </n-spin>
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button @click="showModal = false">关闭</n-button>
        <n-popconfirm @positive-click="handleConfirm" @negative-click="() => {}">
          <template #trigger>
            <n-button :loading="btnLoading" type="info">确认</n-button>
          </template>
          确定转化吗？
        </n-popconfirm>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import useVxeTable from '@/hooks/useVxeTable';
  import useForm from '@/hooks/useForm';
  import NP from 'number-precision';
  import { getProductAssembly } from '@/api/product';
  import { getInventoryMaterialListByIds, materialTransformProduct } from '@/api/inventory';
  import { min } from 'lodash-es';
  import { useMessage } from 'naive-ui';

  const emit = defineEmits(['confirm']);

  const message = useMessage();

  const showModal = ref(false);
  const formRef$ = ref();
  const loading = ref(false);
  const btnLoading = ref(false);
  const assembleNum = ref(0);
  const isSave = ref(false); //是否可以保存（当选择原料比例不对时，为false）

  const compositionMap = ref<{
    [id: string]: number;
  }>({}); //配置map

  const { table: materialTable, table$: materialTable$ } = useVxeTable({
    loading: false,
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
      },
    },
    columns: [
      {
        title: '原料库存',
        children: [
          { type: 'seq', title: '序号', width: 60 },
          { field: 'code', title: '编码', resizable: true },
          { field: 'name', title: '原料名称', resizable: true },
          { field: 'num', title: '库存数量', resizable: true },
          { field: 'unit', title: '单位', resizable: true },
          { field: 'create_time', title: '入库时间', resizable: true },
          {
            field: 'options',
            title: '选择数量',
            width: 200,
            slots: {
              default: 'options_default',
            },
          },
        ],
      },
    ],
    data: [],
  });

  const {
    formDataRef: product,
    setFormData,
    validate,
  } = useForm<{
    product_id: string | null;
    name: string | null;
    code: string | null;
    remark: string | null;
    composition: any[]; //原料组成配置
  }>(
    {
      product_id: null,
      name: null,
      code: null,
      remark: null,
      composition: [],
    },
    formRef$
  );

  const rules = {
    code: {
      required: true,
      message: '请输入编码',
      trigger: ['input', 'blur'],
    },
  };

  // 计算组成数量
  function calcAssembleNum() {
    // 计算每种原料选择的数量
    const targetMap = {};
    for (const id in compositionMap.value) {
      targetMap[id] = 0;
    }
    materialTable.data!.forEach((item) => {
      if (item.material_id in targetMap) {
        targetMap[item.material_id] += item.selectNum;
      }
    });
    // 把各原料倍数存在数组中
    const numArr: number[] = [];
    isSave.value = true;
    for (const id in targetMap) {
      const divideValue = NP.divide(targetMap[id], compositionMap.value[id]);
      const rate = Math.floor(divideValue);

      // 不是整数比例时不可存
      if (divideValue !== rate) {
        isSave.value = false;
      }
      numArr.push(rate);
    }
    if (numArr.length === 0) {
      assembleNum.value = 0;
      isSave.value = false;
    } else {
      assembleNum.value = min(numArr);
      // 判断是否都是这个比例
      if (isSave.value) {
        isSave.value = numArr.every((item) => item === assembleNum.value);
      }
    }
  }

  function handleConfirm() {
    if (!isSave.value) {
      return message.warning('原料未按成品组成比例选择');
    }
    validate().then(() => {
      btnLoading.value = true;
      materialTransformProduct({
        product_id: product.value.product_id,
        code: product.value.code,
        purchase_num: assembleNum.value,
        remark: product.value.remark,
        materials: materialTable.data
          ?.filter((item) => item.selectNum > 0)
          .map((item) => ({
            id: item.id,
            num: item.selectNum,
          })),
      })
        .then(() => {
          btnLoading.value = false;
          message.success('转化成功');
          showModal.value = false;
          emit('confirm');
        })
        .catch(() => {
          btnLoading.value = false;
        });
    });
  }

  function open(data) {
    materialTable.data = [];
    showModal.value = true;
    setFormData(data);
    assembleNum.value = 0;
    loading.value = true;
    getProductAssembly(data.id)
      .then((res) => {
        product.value.composition = res;

        const map = {};
        res.forEach((item) => {
          map[item.material_id] = item.num;
        });
        compositionMap.value = map;

        getInventoryMaterialListByIds(res.map((item) => item.material_id))
          .then((result) => {
            loading.value = false;
            materialTable.data = result.map((item) => ({
              ...item,
              selectNum: 0,
            }));
          })
          .catch(() => {
            loading.value = false;
          });
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
  .main-page {
    .composition {
      margin-top: 10px;
    }
  }
</style>
