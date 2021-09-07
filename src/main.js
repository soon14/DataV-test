// The Vue build version to load with the `import` command
import Vue from 'vue'
import App from './App'
import router from "./router"
import store  from './store'
import ElementUI  from 'element-ui'
import dataV from '@jiaminghi/data-view'
import Charts from '@jiaminghi/charts'
import moment from 'moment'
import animated from 'animate.css'
import axios from 'axios'
// import "./permission.js"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/reset.css"
import "babel-polyfill"
import promise from 'es6-promise'
import * as filters from './utils/validate'
Object.keys(filters).forEach(key => {//注册全局过滤器
  Vue.filter(key, filters[key])
})
promise.polyfill();
Vue.use(ElementUI)
Vue.use(dataV)
Vue.use(animated)
Vue.config.productionTip = false
Vue.prototype.$Charts = Charts
Vue.prototype.$moment = moment
Vue.prototype.axios = axios
import {post} from './utils/http'
Vue.prototype.$post=post;
// axios.defaults.baseURL = "https://monitor.dingrennet.cn"
// axios.interceptors.request.use(
//   config => {
//     if (config.url === '/' || config.url == "https://free-api.heweather.net/s6/weather/now") {
//     } else {
//       if (sessionStorage.getItem('Authorization')) {
//         config.headers.Authorization = sessionStorage.getItem('Authorization')
//       }
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
})
