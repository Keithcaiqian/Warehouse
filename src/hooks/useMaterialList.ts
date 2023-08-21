import { ref } from 'vue';
import { getMaterialManageList } from '@/api/material';

export function useMaterialList() {
  const materialList = ref([]);
  const materialMap = ref({});

  function getMaterialListApi(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      getMaterialManageList()
        .then((res) => {
          materialList.value = res;

          const map = {};
          res.forEach((item) => {
            map[item.id] = { ...item };
          });
          materialMap.value = map;

          resolve([...res]);
        })
        .catch(() => {
          reject();
        });
    });
  }

  return {
    materialList,
    materialMap,
    getMaterialListApi,
  };
}
