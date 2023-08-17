import { App } from 'vue';

import VXETable from './vxe-table';

import { setupCNaive } from './cnaive';

export function globalRegister(app: App): void {
  app.use(VXETable());
  // 二次封装的naive
  setupCNaive(app);
}
