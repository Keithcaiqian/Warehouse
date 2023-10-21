import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  username: string;
  email: string;
  [prop: string]: any;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

const ex = 7 * 24 * 60 * 60;

const permissionsRoute = {
  super_admin: ['super_admin', 'goodsManage', 'putWarehouse', 'report', 'userManage'],
  admin: ['admin', 'goodsManage', 'putWarehouse', 'report', 'userManage'],
  user: [],
};

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { result, code } = response;
      if (code === ResultEnum.SUCCESS) {
        storage.set(ACCESS_TOKEN, result.token, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(result.token);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const result = await getUserInfoApi();
      storage.set(CURRENT_USER, result.userInfo, ex);
      storage.set(CURRENT_USER, result.token, ex);
      this.setUserInfo(result.userInfo);
      this.setAvatar(result.userInfo.avatar);
      this.setPermissions(
        permissionsRoute[result.userInfo.role_code].map((item) => ({ value: item }))
      );
      return {
        ...result.userInfo,
        permissions: this.getPermissions,
      };
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ username: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
