import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
window.$ = require('jquery')
window._ = require('lodash')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

Vue.prototype.$http = Axios;