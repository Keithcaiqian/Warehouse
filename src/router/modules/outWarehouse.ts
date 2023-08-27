import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { UnorderedListOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'outWarehouse';
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
    path: '/outWarehouse',
    name: routeName,
    redirect: '/outWarehouse/productPut',
    component: Layout,
    meta: {
      title: '出库',
      icon: renderIcon(UnorderedListOutlined),
      sort: 3,
    },
    children: [
      {
        path: 'orderList',
        name: `${routeName}_orderList`,
        meta: {
          title: '订单列表',
        },
        component: () => import('@/views/outWarehouse/orderList/orderList.vue'),
      },
      {
        path: 'orderReview',
        name: `${routeName}_orderReview`,
        meta: {
          title: '订单审核',
        },
        component: () => import('@/views/outWarehouse/orderReview/orderReview.vue'),
      },
    ],
  },
];

export default routes;
