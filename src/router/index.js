import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CheckCode from '@/components/CheckCode'
import MarkImg from '@/components/MarkImg'
import User from '@/components/User'
import QrCode from '@/components/QrCode'
import Compress from '@/components/Compress'
import Upload from '@/components/Upload'

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
          path:'markimg',
          component: MarkImg
        },{
          path:'qrcode',
          component: QrCode
        },{
          path:'compress',
          component: Compress
        },{
          path:'upload',
          component: Upload
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
