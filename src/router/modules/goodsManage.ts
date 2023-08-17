import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DashboardOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'goodsManage';
/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/goodsManage',
    name: routeName,
    redirect: '/goodsManage/productManage',
    component: Layout,
    meta: {
      title: '商品管理',
      icon: renderIcon(DashboardOutlined),
      sort: 0,
    },
    children: [
      {
        path: 'productManage',
        name: `${routeName}_productManage`,
        meta: {
          title: '成品管理',
        },
        component: () => import('@/views/goodsManage/productManage/productManage.vue'),
      },
      {
        path: 'materialManage',
        name: `${routeName}_goodsManage`,
        meta: {
          title: '原料管理',
        },
        component: () => import('@/views/goodsManage/materialManage/materialManage.vue'),
      },
    ],
  },
];

export default routes;
