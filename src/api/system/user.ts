import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 注册用户
 */
export function registerUser(params) {
  return http.request({
    url: '/admin/register',
    method: 'POST',
    params,
  });
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request({
    url: '/user/getUserInfo',
    method: 'get',
  });
}

/**
 * @description: 验证用户
 */
export function userVerify() {
  return http.request({
    url: '/user/verify',
    method: 'POST',
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/common/login',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 修改用户密码
 */
export function changePassword(params) {
  return http.request({
    url: `/user/edit/password`,
    method: 'POST',
    params,
  });
}

/**
 * @description: 修改用户信息
 */
export function changeUserInfo(params) {
  return http.request({
    url: `/admin/edit/info`,
    method: 'POST',
    params,
  });
}

/**
 * @description: 获取用户列表
 */
export function getUserList() {
  return http.request({
    url: '/admin/list',
    method: 'GET',
  });
}
