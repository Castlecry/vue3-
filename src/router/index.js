import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    // 新增注册路由 ↓
    {
      path: '/register',
      component: () => import('@/views/register/RegisterPage.vue')
    },
    // 新增注册路由 ↑
    { path: '/', redirect: '/login' },
    {
      path: '/student',
      component: () => import('@/views/student/layout/StuLayout.vue'),
      redirect: '/student/info',
      children: [
        {
          path: 'info',
          component: () => import('@/views/student/StuInfo.vue')
        },
        {
          path: 'aiol',
          component: () => import('@/views/student/OLai.vue')
        },
        {
          path: 'onlinepractise',
          component: () => import('@/views/student/OnlinePractise.vue')
        },
        {
          path: 'queryWork',
          component: () => import('@/views/student/QueryWork.vue')
        }
      ]
    },
    {
      path: '/teacher',
      component: () => import('@/views/teacher/layout/TeaLayout.vue'),
      redirect: '/teacher/info',
      children: [
        {
          path: 'info',
          component: () => import('@/views/teacher/TeaInfo.vue')
        },
        {
          path: 'situationassessment',
          component: () => import('@/views/teacher/SituAssess.vue')
        },
        {
          path: 'aimake',
          component: () => import('@/views/teacher/AiMake.vue')
        },
        {
          path: 'PreDesign',
          component: () => import('@/views/teacher/PreDesign.vue')
        },
        {
          path: 'questionfork',
          component: () => import('@/views/teacher/questionfork.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/layout/AdmLayout.vue'),
      redirect: '/admin/stuManage',
      children: [
        {
          path: 'info',
          component: () => import('@/views/admin/AdmInfo.vue')
        },
        {
          path: 'stuManage',
          component: () => import('@/views/admin/StuManage.vue')
        },
        {
          path: 'teaManage',
          component: () => import('@/views/admin/TeaManage.vue')
        },
        {
          path: 'processCourse',
          component: () => import('@/views/admin/ProcessCourse.vue')
        }
      ]
    }
  ]
})

export default router

// 路由前置守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (import.meta.env.DEV) {
    return true // 允许所有路由访问
  }
  //如果没有token，且访问非登录页，就跳转回来
  if (!userStore.token && to.path !== '/login') {
    ElMessage({
      message: '登录状态过期，请先登录',
      type: 'error'
    })
    router.push('/login')
  }
})
