import type { App } from 'vue';
import { components } from '@/components/NaiveUIComponents/index';
export function setupCNaive(app: App) {
  for (const key in components) {
    app.component(key, components[key]);
  }
}
