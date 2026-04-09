import { createRouter, createWebHashHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const AdminView = () => import('../views/AdminView.vue')

const router = createRouter({
  // GitHub Pages 為靜態主機，使用 hash 模式可避免重新整理 /admin 時 404
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    }
  ]
})

export default router