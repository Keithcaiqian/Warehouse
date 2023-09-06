import { getCustomTheme } from './theme';

export default function useTheme() {
  //主题颜色设置
  const themeOverrides = getCustomTheme(undefined);
  return {
    themeOverrides,
  };
}
