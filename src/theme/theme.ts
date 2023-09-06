// 基本样式
const base = {
  themeColor: '#165DFF',
  borderColor: '#f2f3f5',
  highLightColor: '#C9CDD4', // 文字特别浅的颜色
  lightColor: '#86909C', // 文字浅色
  textColorHover: '#165DFF', //文字hover颜色
  colorHover: '#E8F3FF', //背景hover颜色
  checkedGreen: '#23c343', //checkbox选中的绿色
  checkedRed: '#f76560', //checkbox选中的红色
  checkedOrange: '#ff9a2e', //checkbox选中的橙色
};

export const getCustomTheme = (theme: string | undefined) => {
  //form表单样式
  const labelTextColor = theme === undefined ? '#1d2129' : '';
  const feedbackTextColorError = '#f53f3f';
  const labelPaddingVertical = '0 0 4px 0';
  const asteriskColor = '#f53f3f';
  const labelFontSizeTopMedium = '14px';

  //input和select样式
  const border = theme === undefined ? 'none' : '';
  const color = theme === undefined ? '#F2F3F5' : '';
  const placeholderColor = theme === undefined ? base.lightColor : '';
  const heightMedium = '32px';
  const borderRadius = '2px';
  const borderError = '1px solid #f53f3f';
  const textColor = theme === undefined ? '#1d2129' : ''; //input select card modal

  // DropDown样式
  const optionColorHover = theme === undefined ? base.colorHover : '';
  const optionTextColorHover = theme === undefined ? base.textColorHover : '';

  //checkbox样式
  const checkboxBorder = '2px solid #a7a9b0';
  const colorChecked = base.textColorHover;
  const borderChecked = `2px solid ${base.textColorHover}`;
  const borderFocus = `1px solid ${base.textColorHover}`;
  const boxShadowFocus = '0 0 0 2px rgba(22, 93, 255, 0.3)';

  //transfer样式
  const headerColor = theme === undefined ? '#f7f8fa' : '';
  const transferColor = theme === undefined ? '#f2f3f5' : '';
  const transferColorDisabled = theme === undefined ? '#f7f8fa ' : '';
  const transferTextColor = theme === undefined ? '#4e5969' : '';
  const transferButtonPaddingMedium = '7px';
  const transferButtonBorderRadiusMedium = '28px';

  const themeOverrides = {
    base,
    common: {
      primaryColor: base.themeColor,
      infoColor: base.themeColor,
      primaryColorHover:  '#529AFF',
      primaryColorPressed: '#1759D4',
    },
    Card: {
      textColor,
    },
    Modal: {
      textColor,
      peers: {
        Dialog: {
          titleTextColor: textColor,
        },
      },
      header: { padding: '16px 18px' },
      content: { margin: 0, padding: '16px 20px', backgroundColor: '#f2f3f5' },
      footer: { padding: '12px 24px', margin: 0 },
      area: { backgroundColor: '#fff', padding: '16px 20px 0', marginBottom: '16px' },
    },
    Input: {
      heightMedium,
      border,
      color,
      placeholderColor,
      borderRadius,
      borderError,
      textColor,
    },
    Select: {
      peers: {
        InternalSelection: {
          heightMedium,
          border,
          color,
          placeholderColor,
          borderRadius,
          borderError,
        },
        InternalSelectMenu: {
          optionTextColorActive: base.textColorHover,
        },
      },
    },
    TreeSelect: {
      peers: {
        InternalSelection: {
          heightMedium,
          border,
          color,
          placeholderColor,
          borderRadius,
          borderError,
        },
        InternalSelectMenu: {
          optionTextColorActive: base.textColorHover,
        },
      },
    },
    Dropdown: {
      optionColorHover,
      optionTextColorHover,
    },
    Descriptions: {
      labelStyle: {
        width: '140px',
        height: '48px',
        'font-size': '14px',
        background: '#F7F8FA',
      },
      contentStyle: {
        'max-width': '215px',
        height: '48px',
        'font-size': '14px',
        color: '#86909C',
      },
    },
    Form: {
      labelTextColor,
      feedbackTextColorError,
      labelPaddingVertical,
      labelFontSizeTopMedium,
      asteriskColor,
    },
    Checkbox: {
      border: checkboxBorder,
      colorChecked,
      borderChecked,
      borderFocus,
      boxShadowFocus,
    },
    Transfer: {
      headerColor,
      peers: {
        Button: {
          color: transferColor,
          colorDisabled: transferColorDisabled,
          textColor: transferTextColor,
          paddingMedium: transferButtonPaddingMedium,
          borderRadiusMedium: transferButtonBorderRadiusMedium,
        },
      },
    },
  };
  return themeOverrides;
};

export const buttonTheme = {
  Button: {
    paddingMedium: '7px 24px',
    borderRadiusMedium: '2px',
    heightMedium: '32px',
    colorSecondary: '#f2f3f5',
  },
};

export const tabsTheme = {
  Tabs: {
    tabTextColorActiveLine: base.textColorHover,
    tabTextColorHoverLine: base.textColorHover,
    barColor: base.textColorHover,
  },
};
