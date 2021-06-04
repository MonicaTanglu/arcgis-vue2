import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import store from "./store/";
import drag from './directive/drag.js'
Vue.config.productionTip = false
Vue.use(Antd);
Vue.use(drag)
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
