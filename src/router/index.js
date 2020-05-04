import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: () => import('components/recommend/recommend'),
      children: [
        {
          path: ':id',
          component: () => import('components/recomlist-detail/recomlist-detail')
        }
      ]
    },
    {
      path: '/rank',
      component: () => import('components/rank/rank')
    },
    {
      path: '/singer',
      component: () => import('components/singer/singer'),
      children: [
        {
          path: ':id',
          component: () => import('components/singer-detail/singer-detail')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('components/search/search')
    },
    {
      path: '/user',
      component: () => import('components/user/user')
    }
  ]
})
