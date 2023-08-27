<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header> 添加/编辑订单 </template>
    <div class="wrap">
      <n-spin :show="spin">
        <div class="content">
          <div class="content-left">
            <vxe-grid ref="table$" v-bind="table">
              <template #toolbar_tools>
                <n-input
                  v-model:value="searchRef"
                  placeholder="搜索商品名称"
                  style="width: 200px"
                  clearable
                  @keyup.enter="handleSearch"
                >
                  <template #prefix>
                    <n-icon @click="handleSearch" size="18" color="#808695" style="cursor: pointer">
                      <Search />
                    </n-icon>
                  </template>
                </n-input>
              </template>
              <template #options_default="{ row }">
                <n-input-number
                  :value="inventoryMap[row.id].selectNum"
                  @update:value="
                    (value) => {
                      handleChangeSelectNum(row.id, value);
                    }
                  "
                  :min="0"
                  :max="inventoryMap[row.id].num"
                  size="small"
                />
              </template>

              <template #pager>
                <!--使用 pager 插槽-->
                <vxe-pager
                  :layouts="[
                    'Sizes',
                    'PrevJump',
                    'PrevPage',
                    'Number',
                    'NextPage',
                    'NextJump',
                    'FullJump',
                    'Total',
                  ]"
                  v-model:current-page="tablePage.currentPage"
                  v-model:page-size="tablePage.pageSize"
                  :total="tablePage.total"
                  @page-change="handlePageChange"
                />
              </template>
            </vxe-grid>
          </div>
          <div class="content-right">
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
            <vxe-grid ref="productTable$" v-bind="productTable">
              <!-- 成本 -->
              <template #purchase_amount_default="{ row }">
                {{ NP.times(row.purchase_price, inventoryMap[row.id].selectNum) }}
              </template>
              <!-- 售卖总价 -->
              <template #sell_amount_default="{ row }">
                {{
                  row.sell_price ? NP.times(row.sell_price, inventoryMap[row.id].selectNum) : null
                }}
              </template>
              <!-- 利润 -->
              <template #profit_default="{ row }">
                {{
                  row.sell_price
                    ? NP.times(
                        NP.minus(row.sell_price - row.purchase_price),
                        inventoryMap[row.id].selectNum
                      )
                    : null
                }}
              </template>
              <!-- 售卖单价 -->
              <template #sell_price_default="{ row }">
                <n-input-number v-model:value="row.sell_price" :min="0" size="small" />
              </template>
              <!-- 数量 -->
              <template #out_num_default="{ row }">
                <n-input-number
                  :value="inventoryMap[row.id].selectNum"
                  @update:value="
                    (value) => {
                      handleChangeSelectNum(row.id, value);
                    }
                  "
                  :min="0"
                  :max="inventoryMap[row.id].num"
                  size="small"
                />
              </template>
            </vxe-grid>
          </div>
        </div>
      </n-spin>
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
  import { ref, reactive, h } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import NP from 'number-precision';
  import useVxeTable from '@/hooks/useVxeTable';
  import useForm from '@/hooks/useForm';
  import { onlyNumber } from '@/utils/nativeAllowInput';

  import { createOrder, getOrderDetail, editOrder } from '@/api/order';
  import { getInventoryProductListAll } from '@/api/inventory';

  import { useMessage, useDialog } from 'naive-ui';
  const message = useMessage();
  const dialog = useDialog();

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const formRef$ = ref();
  const spin = ref(false);
  const loading = ref(false);
  const inventoryMap = ref<{
    [id: string]: {
      [props: string]: any;
    };
  }>({}); //库存map

  // 库存列表
  const originData = ref([]); //存一份原始列表数据
  const listRef = ref([]); //列表所有数据
  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  function handlePageChange({ currentPage, pageSize }) {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    table.data = listRef.value.filter(
      (_item, index) =>
        index >= (tablePage.currentPage - 1) * tablePage.pageSize &&
        index < tablePage.currentPage * tablePage.pageSize
    );
  }
  // 搜索
  const searchRef = ref<null | string>(null);
  let searchFilter: null | string = null;

  function setListDataBySearchWord() {
    if (searchFilter) {
      listRef.value = originData.value.filter((item: any) =>
        (item.name || '').toUpperCase().includes(searchFilter!.toUpperCase())
      );
    } else {
      listRef.value = originData.value;
    }

    tablePage.total = listRef.value.length;
  }

  function handleSearch() {
    searchFilter = searchRef.value;
    setListDataBySearchWord();
    handlePageChange({ currentPage: 1, pageSize: tablePage.pageSize });
  }

  const { table, table$ } = useVxeTable({
    toolbarConfig: {
      slots: {
        tools: 'toolbar_tools',
      },
    },
    seqConfig: {
      seqMethod({ rowIndex }) {
        return rowIndex + 1 + (tablePage.currentPage - 1) * tablePage.pageSize;
      },
    },
    columns: [
      { type: 'seq', title: '序号', width: 60, fixed: 'left' },
      { field: 'name', title: '商品名称', resizable: true, fixed: 'left' },
      { field: 'code', title: '编码', resizable: true },

      { field: 'num', title: '库存数量', resizable: true },
      { field: 'advise_price', title: '建议零售价（元）', resizable: true },
      { field: 'purchase_price', title: '进货单价（元）', resizable: true },
      { field: 'unit', title: '单位', resizable: true },
      { field: 'create_time', title: '入库时间', resizable: true },
      {
        field: 'options',
        title: '已选',
        width: 120,
        fixed: 'right',
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getInventoryProductListAllApi(currentPage = 1) {
    return new Promise((resolve, reject) => {
      getInventoryProductListAll()
        .then((res) => {
          originData.value = res;
          res.forEach((item) => {
            inventoryMap.value[item.id] = {
              ...item,
              selectNum: 0,
            };
          });
          setListDataBySearchWord();
          handlePageChange({ currentPage, pageSize: tablePage.pageSize });

          resolve(res);
        })
        .catch(() => {
          reject();
        });
    });
  }

  // 获取订单详情
  function getOrderDetailApi(id: string) {
    spin.value = true;
    getOrderDetail(id)
      .then((res) => {
        console.log('res', res);
        spin.value = false;
        setFormData(res);

        const list: any[] = []; //存放已选商品列表
        const warningList: string[] = []; //存放警告信息

        for (let i = 0; i < res.product_list.length; i++) {
          const element = res.product_list[i];

          if (!inventoryMap.value[element.id]) {
            warningList.push(`编码为 ${element.code} 的 ${element.name} 已没有库存;`);
            continue;
          }

          let num = element.out_num;
          if (inventoryMap.value[element.id].num < element.out_num) {
            num = inventoryMap.value[element.id].num;
            warningList.push(
              `编码为 ${element.code} 的 ${element.name} 库存已不足 ${element.out_num};`
            );
          }

          inventoryMap.value[element.id].selectNum = num;
          const inventory = inventoryMap.value[element.id];
          list.push({
            id: inventory.id,
            name: inventory.name,
            code: inventory.code,
            advise_price: inventory.advise_price,
            purchase_price: inventory.purchase_price,
            purchase_amount: null,
            sell_amount: null,
            profit: null,
            sell_price: element.sell_price,
          });
        }

        if (warningList.length > 0) {
          dialog.warning({
            title: '警告',
            content: () => {
              return h(
                'div',
                warningList.map((item) => h('div', item))
              );
            },
            positiveText: '已自动处理相关数据',
          });
        }

        productTable.data = list;
      })
      .catch(() => {
        spin.value = false;
      });
  }

  // 订单信息
  const { formDataRef, setFormData } = useForm<{
    id: string | null;
    buyer: string | null;
    buyer_phone: string | null;
    remark: string | null;
  }>(
    {
      id: null,
      buyer: null,
      buyer_phone: null,
      remark: null,
    },
    formRef$
  );

  const rules = {};

  const { table: productTable, table$: productTable$ } = useVxeTable({
    loading: false,
    columns: [
      { field: 'code', title: '商品编码', width: 150, resizable: true, fixed: 'left' },
      { field: 'name', title: '商品名称', width: 150, resizable: true, fixed: 'left' },
      { field: 'advise_price', title: '建议零售价', resizable: true, fixed: 'left' },
      { field: 'purchase_price', title: '进货单价', resizable: true },
      {
        field: 'purchase_amount',
        title: '成本',
        resizable: true,
        slots: {
          default: 'purchase_amount_default',
        },
      },
      {
        field: 'sell_amount',
        title: '售卖总价',
        resizable: true,
        slots: {
          default: 'sell_amount_default',
        },
      },
      {
        field: 'profit',
        title: '利润',
        resizable: true,
        slots: {
          default: 'profit_default',
        },
      },
      {
        field: 'sell_price',
        title: '售卖单价',
        width: 120,
        fixed: 'right',
        slots: {
          default: 'sell_price_default',
        },
      },
      {
        field: 'out_num',
        title: '数量',
        width: 120,
        fixed: 'right',
        slots: {
          default: 'out_num_default',
        },
      },
    ],
    data: [],
  });

  function handleChangeSelectNum(id: string, value) {
    const inventory = inventoryMap.value[id];
    inventory.selectNum = value;

    // 是否已选
    const isExist = productTable.data!.find((item: any) => item.id === id);

    if (isExist) {
      if (!value || value === 0) {
        productTable.data = productTable.data!.filter((item: any) => item.id !== id);
      }
    } else {
      if (value && value > 0) {
        productTable.data?.push({
          id,
          name: inventory.name,
          code: inventory.code,
          advise_price: inventory.advise_price,
          purchase_price: inventory.purchase_price,
          purchase_amount: null,
          sell_amount: null,
          profit: null,
          sell_price: null,
        });
      }
    }
  }

  function open(id: string) {
    showModal.value = true;
    setFormData({
      id,
    });

    spin.value = true;
    getInventoryProductListAllApi()
      .then(() => {
        spin.value = false;
        if (id) {
          getOrderDetailApi(id);
        }
      })
      .catch(() => {
        spin.value = false;
      });
  }

  function handleConfirm() {
    const list: any[] = [];
    for (let i = 0; i < productTable.data!.length; i++) {
      const data = productTable.data![i];
      if (!data.sell_price) {
        return message.error('售卖单价不能为空');
      }
      list.push({
        id: data.id,
        out_num: inventoryMap.value[data.id].selectNum,
        sell_price: data.sell_price,
      });
    }
    if (list.length === 0) {
      return message.error('请选择商品');
    }

    const fn = formDataRef.value.id ? editOrder : createOrder;
    loading.value = true;
    fn({
      ...formDataRef.value,
      product_list: list,
    })
      .then(() => {
        loading.value = false;
        message.success(`${formDataRef.value.id ? '编辑' : '创建'}订单成功！`);
        showModal.value = false;
        emit('confirm');
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
  .wrap {
    width: 100%;
  }
  .content {
    display: flex;
    .content-left {
      width: 40%;
      flex-shrink: 0;
      padding: 0 10px;
      border-right: 1px solid #e9e9e9;
    }
    .content-right {
      width: 60%;
      flex-shrink: 0;
      padding: 0 10px;
    }
  }
</style>
