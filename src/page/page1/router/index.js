import Vue from 'vue'
import Router from 'vue-router'
import Test from '../components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Test',
      name: 'Test',
      component: Test
    }
  ]
})
