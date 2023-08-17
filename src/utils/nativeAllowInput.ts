// nativeUi的输入框的输入限制

// 只能输入数字
export function onlyNumber(value: string) {
  return !value || /^\d+$/.test(value);
}

// 只能输入正整数
export function onlyPositiveNumber(value: string) {
  return !value || /^[1-9]+[0-9]*$/.test(value);
}

// 只能输入字母
export function onlyChar(value: string) {
  return !value || /^[a-zA-Z]+$/.test(value);
}

// 只能输入大写字母
export function onlyUpperChar(value: string) {
  return !value || /^[A-Z]+$/.test(value);
}

// 没有前后空格
export function noSideSpace(value: string) {
  return !value.startsWith(' ') && !value.endsWith(' ');
}

// 字母、数字和下划线（_）
export function includes_Char_Num_Underscores(value: string) {
  return !value || /^[a-zA-Z0-9_]+$/.test(value);
}

// 大写字母、数字和下划线（_）
export function includes_UpperChar_Num_Underscores(value: string) {
  return !value || /^[A-Z0-9_]+$/.test(value);
}

// 包含汉字、字母、数字或下划线（_）或短划线（-）
export function includes_Cn_Char_Num_Underscores_Dash(value: string) {
  return !value || /^[a-zA-Z0-9_\u4e00-\u9fa5/-]+$/.test(value);
}

// 不能输入中文
export function not_Zh(value: string) {
  return !value || /^[^\u4e00-\u9fa5]+$/.test(value);
}
