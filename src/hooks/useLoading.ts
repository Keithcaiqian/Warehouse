import { ref } from 'vue';

export default function useLoading() {
  const loading = ref<boolean>(false);
  let loadingTimes = 0;

  function showLoading() {
    loadingTimes++;
    loading.value = true;
  }

  function hideLoading() {
    loadingTimes = loadingTimes > 0 ? loadingTimes - 1 : 0;
    if (loadingTimes === 0) {
      loading.value = false;
    }
  }

  return {
    loading,
    showLoading,
    hideLoading,
  };
}
