import Vue from 'vue'
import Router from 'vue-router'
import login from "../components/login";
import register from "../components/register";
import index from "../components/index";
import error from "../components/error";

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/error',
      name: 'error',
      component: error
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '*',
      redirect: '/error'
    }
  ]
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  //判断该路由是否需要登录权限,不需要直接跳转
  if (!to.meta.requireAuth) {
    //用户已经登录的话不准跳转到登录页面
    if (to.path === '/'||to.path === '/register') {
      let token = window.sessionStorage.getItem('token');
      if (token !== null) {
        next('/index');
      }
    }
    next();
  } else {
    let token = window.sessionStorage.getItem('token');
    // 本地不存在token,跳转到登录界面
    if (token === null || token === '') {
      next('/');
    } else {
      next();
    }
  }
});

export default router;
