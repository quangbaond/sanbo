import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Trading from './pages/Trading.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Dashboard from './pages/Dashboard.vue';
import History from './pages/History.vue';
import Deposit from './pages/Deposit.vue';
import Withdraw from './pages/WithDraw.vue';
import Profile from './pages/Profile.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, meta: { requiresAuth: false } },
    // { path: '/trade', component: Trading, meta: { requiresAuth: true, selectedkey: ['2'] }, name: 'trade' },
    { path: '/trade/:time', component: Trading, meta: { requiresAuth: true }, name: 'trade' },
    { path: '/login', component: Login, meta: { requiresAuth: false }, name: 'login' },
    { path: '/register', component: Register, meta: { requiresAuth: false } },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/history', component: History, meta: { requiresAuth: true } },
    { path: '/deposit', component: Deposit, meta: { requiresAuth: true } },
    { path: '/withdraw', component: Withdraw, meta: { requiresAuth: true } },
    { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  ],
});

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};
const isAdmin = () => {
  return JSON.parse(localStorage.getItem('user')).role === 'admin';
};
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else if (to.meta.isAdmin && !isAdmin()) {
    console.log('admin');
    next('/admin/login');
  } else {
    next();
  }
});

export default router;
