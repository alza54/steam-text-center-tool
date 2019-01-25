// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'
import VModal from 'vue-js-modal'
import App from './App'
import VueRouter from 'vue-router'
import axios from 'axios'
import Index from './components/Index'

Vue.prototype.$http = axios // Similar to the call method of vue-resource

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(VueClipboard)
Vue.use(Toasted, { position: 'top-right', duration: 5000, theme: 'bubble' })
Vue.use(VModal)

const i18n = new VueI18n({
  locale: 'en'
})

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

new Vue({
  i18n,
  router: router,
  render: h => h(App)
}).$mount('#app')
