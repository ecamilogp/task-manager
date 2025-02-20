import { createRouter, createWebHistory } from 'vue-router';
import LoginUser from '@/views/LoginUser.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginUser,
  },
  {
    path: '/task-list',
    name: 'taskList',
    component: () => import('@/views/TaskList.vue'),
  },
  {
    path: '/register-user',
    name: 'registerUser',
    component: () => import('@/views/RegisterUser.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
