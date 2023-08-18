import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DashboardOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'putWarehouse';
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
    path: '/putWarehouse',
    name: routeName,
    redirect: '/putWarehouse/productPut',
    component: Layout,
    meta: {
      title: '入库',
      icon: renderIcon(DashboardOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'productPut',
        name: `${routeName}_productPut`,
        meta: {
          title: '成品入库',
        },
        component: () => import('@/views/putWarehouse/productPut/productPut.vue'),
      },
      {
        path: 'materialPut',
        name: `${routeName}_materialPut`,
        meta: {
          title: '原料入库',
        },
        component: () => import('@/views/putWarehouse/materialPut/materialPut.vue'),
      },
    ],
  },
];

export default routes;
