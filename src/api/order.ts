import { http } from '@/utils/http/axios';

/**
 * @description: 获取原料列表
 */
export function getOrderList(params: any) {
  return http.request({
    url: '/order/list',
    method: 'post',
    params,
  });
}

/**
 * @description: 获取订单详情
 */
export function getOrderDetail(id: string) {
  return http.request({
    url: `/order/detail/${id}`,
    method: 'get',
  });
}

/**
 * @description: 取消订单
 */
export function cancelOrderById(params: any) {
  return http.request({
    url: `/order/cancel`,
    method: 'post',
    params,
  });
}
