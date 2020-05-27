// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs'
import Video from 'video.js'
import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://127.0.0.1:8080/common_utils/';
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.prototype.$qs=qs;
Vue.prototype.$video = Video;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
