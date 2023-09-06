import { reactive, toRefs } from 'vue';
import { defineStore } from 'pinia';
import { createPinia } from 'pinia';
import { storage } from '@/utils/Storage';
import { getUserInfo as getUserInfoApi, login } from '@/api/user';
import { ResultEnum } from '@/enums/httpEnum';
import { ACCESS_TOKEN, CURRENT_USER } from '@/store/mutation-types';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: any;
}

export const useUserInfoStoreStore = defineStore('sceneNavRecommend', () => {
  const state = reactive<{
    userInfo: any; //用户信息
    token: string;
    permissions: any[];
  }>({
    userInfo: storage.get(CURRENT_USER, {}),
    token: storage.get(ACCESS_TOKEN, ''),
    permissions: [],
  });

  const methods = {
    setToken(token: string) {
      state.token = token;
    },
    getToken(): string {
      return state.token;
    },
    setPermissions(permissions) {
      state.permissions = permissions;
    },
    getPermissions(): any[] {
      return state.userInfo?.permissions || [];
    },
    setUserInfo(userInfo) {
      state.userInfo = userInfo;
    },
    getUserInfo() {
      return state.userInfo;
    },
    // 登录
    async login(params: any) {
      // const response = await login(params);
      const response = {
        code: 200,
        result: {
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiZjZiN2E0OTI1N2MwNGRhMDljZjdkMWMzNTYyYmZkNjYiLCJ1c2VySWQiOiIxNjQ1NjUyNjg3MzIwNjIxMDYwIiwidXNlcm5hbWUiOiIxOTkzIiwibmlja05hbWUiOiLliJjpkasiLCJkaW5nVXNlcklkIjoiMTk5MyIsImVmZmVjdGl2ZVRpbWUiOjIwLCJzY29wZSI6IldpbmRvd3MifQ.2Nobhrp06mmhWEUdf4jdiOxunNa5kl2hF87vGHzM_5U',
        },
        message: 'ok',
        type: 'success',
      };
      const { result, code } = response;
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, result.token, ex);
        methods.setToken(result.token);
      }
      return response;
    },
    // 获取用户信息
    async getInfo() {
      // const result = await getUserInfoApi();
      const result = {
        id: '1645652687320621060',
        revision: 1,
        createBy: null,
        createTime: '2023-04-11T04:59:10.070+00:00',
        updateBy: null,
        updateTime: '2023-04-11T04:59:10.070+00:00',
        dataStatus: 1,
        manageType: null,
        username: '1993',
        nickName: '刘鑫',
        email: null,
        mobile: '15232769131',
        readonly: false,
        state: true,
        projectId: '1642846245986738177',
        projectName: '开放体验项目',
        gangId: '1642844530386378754',
        memberId: '1651528212923961346',
        applicationId: null,
        application: null,
        dolphinCode: '9099474228896',
        dolphinId: '0041',
        roles: ['1642846333677051906', '1656464290497867777'],
        assertAuthorities: [],
      };
      methods.setPermissions([]);
      methods.setUserInfo(result);
      storage.set(CURRENT_USER, result);
      return result;
    },
    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({
        roles: [],
        projectId: '',
        username: '',
        id: '',
      });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  };

  return {
    ...toRefs(state),
    ...methods,
  };
});

// Need to be used outside the setup
export function useUser() {
  return useUserInfoStoreStore(createPinia());
}
