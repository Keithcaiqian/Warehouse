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

/**
 * @description: 创建订单
 */
export function createOrder(params: any) {
  return http.request({
    url: `/order/create`,
    method: 'post',
    params,
  });
}

/**
 * @description: 获取订单审核列表
 */
export function getOrderCheckList(params: any) {
  return http.request({
    url: `/order/check/list`,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除订单
 */
export function deleteOrder(id: string) {
  return http.request({
    url: `/order/delete/${id}`,
    method: 'delete',
  });
}

/**
 * @description: 编辑订单
 */
export function editOrder(params: any) {
  return http.request({
    url: `/order/edit`,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改订单状态
 */
export function editOrderStatus(params: any) {
  return http.request({
    url: `/order/edit/status`,
    method: 'post',
    params,
  });
}

/**
 * @description: 修改订单状态历史
 */
export function getOrderStatusHistory(id: string) {
  return http.request({
    url: `/order/status/history/${id}`,
    method: 'get',
  });
}
