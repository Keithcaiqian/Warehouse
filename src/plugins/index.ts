import { App } from 'vue';
import { setupNaive } from '@/plugins/naive';
import { setupNaiveDiscreteApi } from '@/plugins/naiveDiscreteApi';
import { setupDirectives } from '@/plugins/directives';
import { setupCNaive } from '@/plugins/cnaive';
import VXETable from '@/plugins/vxe-table';
import 'remixicon/fonts/remixicon.css'; //图标库的样式

export function globalRegister(app: App): void {
  // 注册全局常用的 naive-ui 组件
  setupNaive(app);

  // 挂载 naive-ui 脱离上下文的 Api
  setupNaiveDiscreteApi();

  // 二次封装的naive
  setupCNaive(app);

  // vxe-table
  app.use(VXETable());

  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app);
}
