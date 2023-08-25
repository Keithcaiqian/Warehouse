import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DashboardOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'inventoryManage';
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
    path: '/inventoryManage',
    name: routeName,
    redirect: '/inventoryManage/productPut',
    component: Layout,
    meta: {
      title: '库存管理',
      icon: renderIcon(DashboardOutlined),
      sort: 4,
    },
    children: [
      {
        path: 'inventoryProduct',
        name: `${routeName}_inventoryProduct`,
        meta: {
          title: '成品库存',
        },
        component: () => import('@/views/inventoryManage/inventoryProduct/inventoryProduct.vue'),
      },
      {
        path: 'inventoryMaterial',
        name: `${routeName}_inventoryMaterial`,
        meta: {
          title: '原料库存',
        },
        component: () => import('@/views/inventoryManage/inventoryMaterial/inventoryMaterial.vue'),
      },
      {
        path: 'lossProduct',
        name: `${routeName}_lossProduct`,
        meta: {
          title: '成品损耗',
        },
        component: () => import('@/views/inventoryManage/lossProduct/lossProduct.vue'),
      },
      {
        path: 'lossMaterial',
        name: `${routeName}_lossMaterial`,
        meta: {
          title: '原料损耗',
        },
        component: () => import('@/views/inventoryManage/lossMaterial/lossMaterial.vue'),
      },
    ],
  },
];

export default routes;
