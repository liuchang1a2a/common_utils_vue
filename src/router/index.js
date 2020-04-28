import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CheckCode from '@/components/CheckCode'
import User from '@/components/User'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      redirect:'/home'
    },{
      path: '/home',
      name:'home',
      component: Home,
      children: [
        {
          path:'checkcode',
          component: CheckCode
        },
        {
          path: '',
          component: CheckCode
        }
      ]
    },{
      path: '/user/:id',
      name:'user',
      component: User
    }
  ]
})
