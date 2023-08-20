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
