import { http } from '@/utils/http/axios';

/**
 * @description: 获取报表列表
 */
export function getReportList(params: any) {
  return http.request({
    url: '/report/list',
    method: 'post',
    params,
  });
}
