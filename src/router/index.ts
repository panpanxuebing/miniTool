import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import TodoPage from '../pages/TodoPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/todo',
      name: 'todo',
      component: TodoPage,
    },
  ],
})

export default router
