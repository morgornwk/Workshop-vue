import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GradeView from '../views/GradeCalculator.vue'
import SignInView from '../views/auth/SignInView.vue'
import SignUpView from '../views/auth/SignUpView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/grade',
    name: 'grade',
    component: GradeView,
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignInView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
