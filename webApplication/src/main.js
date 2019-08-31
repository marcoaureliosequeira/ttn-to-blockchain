import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import { ClientTable } from 'vue-tables-2';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

Vue.use(ClientTable);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')

/**new Vue({
  render: h => h(App),
}).$mount('#app')**/
