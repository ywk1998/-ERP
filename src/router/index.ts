import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台' },
      },
      {
        path: 'equipment',
        redirect: '/equipment/machinery',
        children: [
          {
            path: 'machinery',
            name: 'EquipmentMachinery',
            component: () => import('@/views/equipment/machinery.vue'),
            meta: { title: '机械设备' },
          },
          {
            path: 'machinery/environment',
            name: 'MachineryEnvironment',
            component: () =>
              import('@/views/equipment/machinery/environment.vue'),
            meta: { title: '环保信息管理' },
          },
          {
            path: 'machinery/refuel',
            name: 'MachineryRefuel',
            component: () => import('@/views/equipment/machinery/refuel.vue'),
            meta: { title: '设备加油管理' },
          },
          {
            path: 'machinery/maintenance',
            name: 'MachineryMaintenance',
            component: () =>
              import('@/views/equipment/machinery/maintenance.vue'),
            meta: { title: '机械设备保养管理' },
          },
          {
            path: 'office',
            name: 'EquipmentOffice',
            component: () => import('@/views/equipment/office.vue'),
            meta: { title: '办公设备' },
          },
        ],
      },
      {
        path: 'base',
        name: 'Base',
        component: () => import('@/views/base/index.vue'),
        meta: { title: '基础数据' },
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统设置' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/** 免登录白名单 */
const WHITE_LIST = ['/login']

router.beforeEach((to) => {
  const userStore = useUserStore()
  document.title = to.meta.title ? `${to.meta.title} - 天衢ERP` : '天衢ERP'

  // 已登录访问登录页 → 跳转首页
  if (WHITE_LIST.includes(to.path)) {
    return userStore.isLoggedIn ? { path: '/' } : true
  }
  // 未登录访问其他页面 → 跳转登录页并记录来源
  if (!userStore.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
