import { createRouter, createWebHistory } from 'vue-router'

import Home from '@src/pages/Home/Home.vue'
import TodoPage from '@src/pages/TodoPage/index.vue'
import MoneyBoxPage from '@src/pages/MoneyBoxPage/index.vue'
import StudyDiaryPage from '@src/pages/StudyDiaryPage/index.vue'

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
    {
      path: '/moneybox',
      name: 'moneybox',
      component: MoneyBoxPage,
    },
    {
      path: '/study-diary',
      name: 'study-diary',
      component: StudyDiaryPage,
    },
  ],
})

export default router
