import { http } from '@/utils/http/axios';

/**
 * @description: 获取原料列表
 */
export function getMaterialManageList() {
  return http.request({
    url: '/material/manage/list',
    method: 'get',
  });
}

/**
 * @description: 添加原料
 */
export function addMaterial(params: any) {
  return http.request({
    url: '/material/manage/add',
    method: 'post',
    params,
  });
}

/**
 * @description: 修改原料
 */
export function editMaterial(params: any) {
  return http.request({
    url: '/material/manage/edit',
    method: 'post',
    params,
  });
}

/**
 * @description: 修改原料
 */
export function deleteMaterial(id: string) {
  return http.request({
    url: `/material/manage/delete/${id}`,
    method: 'delete',
  });
}

/**
 * @description: 获取入库原料列表
 */
export function getMaterialPutList(params: any) {
  return http.request({
    url: `/material/put/list`,
    method: 'post',
    params,
  });
}

/**
 * @description: 添加原料入库
 */
export function addMaterialPut(params: any) {
  return http.request({
    url: `/material/put/add`,
    method: 'post',
    params,
  });
}

/**
 * @description: 删除原料入库
 */
export function deleteMaterialPut(id: string) {
  return http.request({
    url: `/material/put/delete/${id}`,
    method: 'delete',
  });
}
