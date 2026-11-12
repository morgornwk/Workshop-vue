import Vue from 'vue'
import VueRouter from 'vue-router'
import { useAlert } from '@/hook/useAlert'
import HomeView from '../views/HomeView.vue'
import GradeView from '../views/GradeCalculator.vue'
import SignInView from '../views/auth/SignInView.vue'
import SignUpView from '../views/auth/SignUpView.vue'
import ShopView from '../views/shop/ShopView.vue'
import AddProductView from '../views/shop/AddProductView.vue'
import ProductDetailView from '../views/shop/ProductDetailView.vue'
import CartView from '../views/shop/CartView.vue'
import EditProductView from '../views/shop/EditProductView.vue'

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
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView
  },
  {
    path: '/add_product',
    name: 'add-product',
    component: AddProductView
  },
  {
    path: '/shop/:id',
    name: 'product-detail',
    component: ProductDetailView,
    props: true
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/edit_product/:id',
    name: 'edit_product',
    component: EditProductView,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
})

router.afterEach(() => {
  useAlert().closeDialog(false)
})

export default router
