import { createRouter, createWebHistory } from 'vue-router';
import LoginAdmin from './pages/admin/Login.vue';
import DashboardAdmin from './pages/admin/Dashboard.vue';
import Bank from './pages/admin/Bank.vue';
import Transaction from './pages/admin/Transaction.vue';
import Trade from './pages/admin/Trade.vue';
import TradeList from './pages/admin/TradeList.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', meta: { requiresAuth: false }, redirect: '/dashboard' },
    { path: '/login', component: LoginAdmin, meta: { requiresAuth: false } },
    { path: '/dashboard', component: DashboardAdmin, meta: { requiresAuth: true, isAdmin: true } },
    { path: '/bank', component: Bank, meta: { requiresAuth: true, isAdmin: true } },
    { path: '/transaction', component: Transaction, meta: { requiresAuth: true, isAdmin: true } },
    { path: '/trade', component: Trade, meta: { requiresAuth: true, isAdmin: true } },
    { path: '/order', component: TradeList, meta: { requiresAuth: true, isAdmin: true } },
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
    next('/login');
  } else {
    next();
  }
});

export default router;
