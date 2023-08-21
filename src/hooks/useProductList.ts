import { ref } from 'vue';
import { getProductManageList } from '@/api/product';

export function useProductList() {
  const productList = ref([]);
  const productMap = ref({});

  function getProductListApi(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      getProductManageList()
        .then((res) => {
          productList.value = res;

          const map = {};
          res.forEach((item) => {
            map[item.id] = { ...item };
          });
          productMap.value = map;

          resolve([...res]);
        })
        .catch(() => {
          reject();
        });
    });
  }

  return {
    productList,
    productMap,
    getProductListApi,
  };
}
