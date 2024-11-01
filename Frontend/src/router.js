import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register'
import Login from './views/Login'

// admin
import Calendar from './views/admin/calendar'
import Message from './views/admin/message'
import MessageDialog from './views/admin/messageDialog'
import NewsList from './views/admin/newsList'
import NewsForm from './views/admin/newsForm'
import Setting from './views/admin/setting'
import UserInfo from './views/admin/userInfo'
import UserInfoForm from './views/admin/userInfoForm'
// buy
import BuyList from './views/buying/buyList'
import BuyFarmer from './views/buying/buyFarmer'
import TotalBuy from './views/buying/totalBuy'
// farmer
import FarmerStore from './views/farmer/farmerStroe'
import FarmerPresent from './views/farmer/farmerPresent'
// selling
import SellingList from './views/Selling/sellingList'
import SellingExpress from './views/Selling/sellingExpress'
import TotalSelling from './views/Selling/totalSelling'
// user
import Basket from './views/user/basket'
import Retail from './views/user/retail'
import WholeSale from './views/user/wholesale'
import YourProduct from './views/user/yourProduct'
import Order from './views/user/order'
import Location from './views/user/location'
// other
import Other_home from './views/other/home'
import Other_retail from './views/other/retail'
import Other_wholeSale from './views/other/wholesale'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/', name: 'home', component: Home, meta: { auth: true } },
///admin
    { path: '/admin/calendar', name: 'calendar', component: Calendar, meta: { auth: ['admin'] } },
    { path: '/admin/message', name: 'message', component: Message, meta: { auth: true } },
    { path: '/admin/message/dialog', name: 'message-dialog', component: MessageDialog, meta: { auth: true } },
    { path: '/admin/news/form', name: 'news-form', component: NewsForm, meta: { auth: ['admin'] } },
    { path: '/admin/news', name: 'news-list', component: NewsList, meta: { auth: ['admin'] } },
    { path: '/admin/userinfo', name: 'user-info', component: UserInfo, meta: { auth: ['admin'] } },
    { path: '/admin/userinfoForm', name: 'user-info-form', component: UserInfoForm, meta: { auth: ['admin'] } },
    { path: '/setting', name: 'setting', component: Setting, meta: { auth: true } },
///buy
    { path: '/buy/list', name: 'buy-list', component: BuyList, meta: { auth: true } },
    { path: '/buy/farmer', name: 'buy-farmer', component: BuyFarmer, meta: { auth: true } },
    { path: '/buy/total', name: 'total-buy', component: TotalBuy, meta: { auth: true } },
///farmer
    { path: '/farmer/store', name: 'farmer-store', component: FarmerStore, meta: { auth: true } },
    { path: '/farmer/present', name: 'farmer-present', component: FarmerPresent, meta: { auth: true } },
///selling
    { path: '/selling/total', name: 'total-selling', component: TotalSelling, meta: { auth: true } },
    { path: '/selling/list', name: 'selling-list', component: SellingList, meta: { auth: true } },
    { path: '/selling/express', name: 'selling-express', component: SellingExpress, meta: { auth: true } },
///user
    { path: '/user/basket', name: 'basket', component: Basket, meta: { auth: true } },
    { path: '/user/retail', name: 'retail', component: Retail, meta: { auth: true } },
    { path: '/user/wholesale', name: 'wholesale', component: WholeSale, meta: { auth: true } },
    { path: '/user/product', name: 'your-product', component: YourProduct, meta: { auth: true } },
    { path: '/user/order', name: 'order', component: Order, meta: { auth: true } },
    { path: '/user/location', name: 'location', component: Location, meta: { auth: true } },
///other
    { path: '/other/home', name: 'other-home', component: Other_home },
    { path: '/other/wholesale', name: 'other-wholesale', component: Other_wholeSale },
    { path: '/other/retail', name: 'other-retail', component: Other_retail },
  ]
})

// ตรวจสอบสิทธิ์การเข้าถึงหน้า
router.beforeEach((to, from, next) => {
  const auth = to.meta.auth
  if (!auth) return next();
  router.app.$store.dispatch('get_user_login')
    .then(() => {
      if(!Array.isArray(auth)) return next();
      const userLogin = router.app.$store.state.user
      if(auth.indexOf(userLogin.u_role) >= 0) return next();
    })
    .catch(() => next({ name: 'other-home' }));
    // .catch(() => next({ name: 'login' }));
})

export default router;