import { h, createApp } from 'vue';
import ReConfirm from './ReConfirm.vue';

export default function useReconfirm() {
  let vm: any;

  function unmount() {
    if (vm) {
      vm.unmount();
      vm = null;
    }
  }
  return {
    show(props: any) {
      unmount();
      const container = document.createElement('div');
      // 获取组件的DOM，将其挂载到body上
      vm = createApp(ReConfirm, {
        ...props,
        remove: unmount,
      });
      vm.mount(container);
    },
    unmount,
  };
}
