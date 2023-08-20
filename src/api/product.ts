import { http } from '@/utils/http/axios';

/**
 * @description: 获取商品品类列表
 */
export function getProductCategoryList() {
  return http.request({
    url: '/product/category/list',
    method: 'get',
  });
}

/**
 * @description: 添加商品品类
 */
export function addProductCategory(params: any) {
  return http.request({
    url: '/product/category/add',
    method: 'post',
    params,
  });
}

/**
 * @description: 删除商品品类
 */
export function deleteProductCategory(id: string) {
  return http.request({
    url: `/product/category/delete/${id}`,
    method: 'delete',
  });
}

/**
 * @description: 获取成品管理列表
 */
export function getProductManageList() {
  return http.request({
    url: '/product/manage/list',
    method: 'get',
  });
}

/**
 * @description: 添加商品
 */
export function addProduct(params: any) {
  return http.request({
    url: '/product/manage/add',
    method: 'post',
    params,
  });
}

/**
 * @description: 编辑商品
 */
export function editProduct(params: any) {
  return http.request({
    url: '/product/manage/edit',
    method: 'post',
    params,
  });
}

/**
 * @description: 编辑商品
 */
export function deleteProduct(id: string) {
  return http.request({
    url: `/product/manage/delete/${id}`,
    method: 'delete',
  });
}
