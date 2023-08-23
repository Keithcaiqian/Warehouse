import { http } from '@/utils/http/axios';

/**
 * @description: 获取成品库存列表
 */
export function getInventoryProductList() {
  return http.request({
    url: '/inventory/product/list',
    method: 'get',
  });
}

/**
 * @description: 获取库存单个成品品详情列表
 */
export function getInventoryProductDetail(id: string) {
  return http.request({
    url: `/inventory/product/detail/${id}`,
    method: 'get',
  });
}

/**
 * @description: 获取组成成品的原料列表
 */
export function getInventoryProductComposition(id: string) {
  return http.request({
    url: `/inventory/product/composition/${id}`,
    method: 'get',
  });
}

/**
 * @description: 设置成品损耗数量
 */
export function editInventoryProduct(params: any) {
  return http.request({
    url: `/inventory/product/edit`,
    method: 'post',
    params,
  });
}
