// 通用的modal样式

interface IParam {
  headerTitle?: any;
  width?: string;
  headerStyle?: object;
  contentStyle?: object;
  footerStyle?: object;
  segmented?: object;
}

export default function useModalStyle({
  width = '700px',
  headerTitle = {
    color: '#1D2129',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  headerStyle = {
    padding: '14px 20px',
  },
  contentStyle = {
    margin: 0,
    padding: '28px 20px',
  },
  footerStyle = {
    margin: 0,
    padding: '12px 24px',
  },
  segmented = {
    content: 'soft',
    footer: 'soft',
  },
}: IParam) {
  // modal宽度
  const style = {
    width,
  };

  // border隔开
  return {
    style,
    headerTitle,
    headerStyle,
    contentStyle,
    footerStyle,
    segmented,
  };
}
