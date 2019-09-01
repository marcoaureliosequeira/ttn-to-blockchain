import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import { ClientTable } from 'vue-tables-2';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import vuetify from './plugins/vuetify';
import Dialog from 'vue-dialog-loading'

Vue.use(ClientTable);

Vue.use(Dialog, {
  dialogBtnColor: '#0f0'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  el: '#app',
  store,
  components: { App },
  vuetify,
  template: '<App/>'
}).$mount('#app')

/**new Vue({
  render: h => h(App),
}).$mount('#app')**/
