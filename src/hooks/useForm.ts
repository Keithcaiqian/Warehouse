import { ref } from 'vue';
import type { Ref } from 'vue';
import { cloneDeep } from 'lodash-es';

export default function useForm<T extends {}>(defaultFormData: T, formRef?: Ref<any>) {
  let originData: T = cloneDeep(defaultFormData);
  const formDataRef = ref<T>(cloneDeep(originData));

  // 重置成初始数据
  function reset() {
    formDataRef.value = cloneDeep(originData);
  }

  // 获取初始数据
  function getResetFormData() {
    return cloneDeep(originData);
  }

  // 改变初始数据
  function setResetValue(data: T) {
    originData = cloneDeep(data);
  }

  // 赋值数据，如果没有的字段则赋值为初始数据的相应字段
  function setFormData(data: { [key: string]: any }) {
    formDataRef.value = getDataByTemplate(data);
  }

  // 获取数据（如果传进来这个字段就用这个，否则用初始数据的）
  function getDataByTemplate(data: { [key: string]: any }): T {
    const target: T = {} as T;
    for (const prop in originData) {
      if (prop in data) {
        if (typeof originData[prop] === 'object') {
          target[prop] = cloneDeep(data[prop]);
        } else {
          target[prop] = data[prop];
        }
      } else {
        target[prop] = originData[prop];
      }
    }
    return target;
  }

  function validate() {
    return new Promise((resolve, reject) => {
      formRef?.value.validate((err: any) => {
        if (!err) {
          resolve(err);
        } else {
          reject(err);
        }
      });
    });
  }

  function restoreValidation() {
    formRef?.value.restoreValidation();
  }

  return {
    formDataRef,
    reset,
    getResetFormData,
    getDataByTemplate,
    setResetValue,
    setFormData,
    validate,
    restoreValidation,
  };
}
