import { http } from '@/utils/http/axios';

/**
 * @description: 获取商品品类列表
 */
export function getProductCategoryList() {
  return http.request({
    url: `/product/category/list`,
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
export function getProductManageList(is_assemble: 'y' | 'n' = 'n') {
  return http.request({
    url: `/product/manage/list?is_assemble=${is_assemble}`,
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

/**
 * @description: 编辑商品组装配置
 */
export function setProductAssembly(params: any) {
  return http.request({
    url: `/product/manage/assembly/set`,
    method: 'post',
    params,
  });
}

/**
 * @description: 编辑商品组装配置
 */
export function getProductAssembly(id: string) {
  return http.request({
    url: `/product/manage/assembly/${id}`,
    method: 'get',
  });
}

/**
 * @description: 获取入库成品列表
 */
export function getProductPutList(params: any) {
  return http.request({
    url: `/product/put/list`,
    method: 'post',
    params,
  });
}

/**
 * @description: 添加成品入库
 */
export function addProductPut(params: any) {
  return http.request({
    url: `/product/put/add`,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除成品入库
 */
export function deleteProductPut(id: string) {
  return http.request({
    url: `/product/put/delete/${id}`,
    method: 'delete',
  });
}
