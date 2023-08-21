import { ref } from 'vue';
import { getProductCategoryList } from '@/api/product';

export function useProductCategory() {
  const categoryList = ref([]);
  const categoryMap = ref({});

  function getProductCategoryListApi(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      getProductCategoryList()
        .then((res) => {
          categoryList.value = res;

          const map = {};
          res.forEach((item) => {
            map[item.id] = { ...item };
          });
          categoryMap.value = map;

          resolve([...res]);
        })
        .catch(() => {
          reject();
        });
    });
  }

  return {
    categoryList,
    categoryMap,
    getProductCategoryListApi,
  };
}
