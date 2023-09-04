import { http } from '@/utils/http/axios';

/**
 * @description: 根据商品名称获取成品库存列表
 */
export function getInventoryProductList() {
  return http.request({
    url: '/inventory/product/list/productId',
    method: 'get',
  });
}

/**
 * @description: 获取库存中单个成品库存列表
 */
export function getInventoryProductDetail(id: string) {
  return http.request({
    url: `/inventory/product/detail/${id}`,
    method: 'get',
  });
}

/**
 * @description: 获取库存中成品库存列表
 */
export function getInventoryProductListAll() {
  return http.request({
    url: `/inventory/product/list/all`,
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
    url: `/inventory/product/loss/edit`,
    method: 'post',
    params,
  });
}

/**
 * @description: 成品损耗列表
 */
export function lossInventoryProduct() {
  return http.request({
    url: `/inventory/product/loss`,
    method: 'get',
  });
}

/**
 * @description: 获取库存原料列表
 */
export function getInventoryMaterialList() {
  return http.request({
    url: `/inventory/material/list/materialId`,
    method: 'get',
  });
}

/**
 * @description: 获取库存中单个原料库存列表
 */
export function getInventoryMaterialDetail(id: string) {
  return http.request({
    url: `/inventory/material/detail/${id}`,
    method: 'get',
  });
}

/**
 * @description: 根据原料ids获取原料库存
 */
export function getInventoryMaterialListByIds(params: any) {
  return http.request({
    url: `/inventory/material/list/ids`,
    method: 'post',
    params,
  });
}

/**
 * @description: 设置原料损耗数量
 */
export function editInventoryMaterial(params: any) {
  return http.request({
    url: `/inventory/material/loss/edit`,
    method: 'post',
    params,
  });
}

/**
 * @description: 原料损耗列表
 */
export function lossInventoryMaterial() {
  return http.request({
    url: `/inventory/material/loss`,
    method: 'get',
  });
}
