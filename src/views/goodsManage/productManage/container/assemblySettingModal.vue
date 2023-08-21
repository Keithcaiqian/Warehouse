<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    size="small"
    preset="card"
    :style="{
      width: '600px',
    }"
    segmented
    bordered
    :mask-closable="false"
  >
    <template #header> 成品组装配置 </template>
    <div class="main-page">
      <h1>{{ product.name }}</h1>
      <div>绑定对应消耗原料关系：</div>

      <div class="list">
        <n-space class="item" v-for="item in meterialList" :key="item.id">
          <n-tag type="info" closable @close="handleClose(item.id)">
            {{ meterialMap[item.id]?.name || item.id }}
          </n-tag>
          <span class="num">数量：</span>
          <n-input-number v-model:value="item.num" :min="1" size="small" />
        </n-space>
      </div>

      <vxe-grid ref="table$" v-bind="table">
        <template #toolbar_tools>
          <n-input
            v-model:value="searchRef"
            placeholder="搜索"
            style="width: 200px"
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
          <n-space>
            <n-button
              @click="handleChooseMeterial(row.id)"
              :disabled="meterialMap[row.id].choose"
              size="small"
              :type="meterialMap[row.id].choose ? 'tertiary' : 'info'"
              >{{ meterialMap[row.id].choose ? '已选' : '选择' }}</n-button
            >
          </n-space>
        </template>

        <template #pager>
          <!--使用 pager 插槽-->
          <vxe-pager
            :layouts="['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Total']"
            v-model:current-page="tablePage.currentPage"
            v-model:page-size="tablePage.pageSize"
            :total="tablePage.total"
            @page-change="handlePageChange"
          />
        </template>
      </vxe-grid>
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
  import { ref, reactive } from 'vue';
  import { Search } from '@vicons/ionicons5';
  import useVxeTable from '@/hooks/useVxeTable';

  import { getMaterialManageList } from '@/api/material';
  import { getProductAssembly, setProductAssembly } from '@/api/product';

  import { useMessage } from 'naive-ui';
  const message = useMessage();

  const showModal = ref(false);
  const loading = ref(false);

  // 原料列表
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
    loading: false,
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
      { type: 'seq', title: '序号', width: 60 },
      { field: 'name', title: '原料名称' },
      { field: 'unit', title: '单位', width: 100 },
      {
        field: 'options',
        title: '操作',
        width: 100,
        slots: {
          default: 'options_default',
        },
      },
    ],
    data: [],
  });

  function getMaterialManageListApi(currentPage = 1) {
    return new Promise((resolve, reject) => {
      table.loading = true;
      getMaterialManageList()
        .then((res) => {
          table.loading = false;
          originData.value = res;

          const map = {};
          originData.value.forEach((item: any) => {
            map[item.id] = {
              name: item.name,
              choose: false,
            };
          });
          meterialMap.value = map;

          setListDataBySearchWord();
          handlePageChange({ currentPage, pageSize: tablePage.pageSize });

          resolve('success');
        })
        .catch(() => {
          table.loading = false;
          reject();
        });
    });
  }

  // 已选的原料列表
  const meterialList = ref<
    {
      id: string;
      num: number;
    }[]
  >([]);
  const meterialMap = ref({}); //原料选择map字典

  function handleChooseMeterial(id: string) {
    meterialList.value.push({
      id,
      num: 1,
    });
    meterialMap.value[id].choose = true;
  }

  function handleClose(id: string) {
    meterialList.value = meterialList.value.filter((item: any) => item.id !== id);
    meterialMap.value[id].choose = false;
  }

  function handleConfirm() {
    console.log('meterialList', meterialList.value);
    loading.value = true;
    setProductAssembly({
      id: product.value.id,
      meterialList: [...meterialList.value],
    })
      .then(() => {
        loading.value = false;
        message.success('配置成功！');
        showModal.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  }

  //商品信息
  const product = ref<{
    id: string;
    name: string;
    [props: string]: any;
  }>({
    id: '',
    name: '',
  });

  function open(data) {
    product.value = data;
    showModal.value = true;

    loading.value = true;
    getProductAssembly(data.id)
      .then((res) => {
        meterialList.value = [...res];
        loading.value = false;
        getMaterialManageListApi();
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
    h1 {
      font-size: 24px;
    }
    .list {
      margin-top: 8px;
      .item {
        padding: 6px;

        border-bottom: 1px solid #ccc;
        .num {
          line-height: 28px;
        }
      }
    }
  }
</style>
