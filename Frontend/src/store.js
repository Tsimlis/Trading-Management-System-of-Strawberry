import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    news: [],
    userinfo: [],
    messages: [],
  },
  //
  mutations: {
    set_user: (state, user) => state.user = user,
    set_news: (state, news) => state.news = news,
    set_userinfo: (state, userinfo) => state.userinfo = userinfo,
    set_message: (state, message) => state.message = message,
    
  },
  //
  actions: {
    get_user_login: ({ commit }) => Axios.post('/api/account/getUserLogin').then(res => commit('set_user', res.data)),
    set_news: ({ commit }, params = { page: 1 }) => Axios.get('/api/news', {params}).then(res => commit('set_news', res.data)),
    set_userinfo: ({ commit }, params = { page: 1 }) => Axios.get('/api/userinfo', {params}).then(res => commit('set_userinfo', res.data)),
    set_message: ({ commit }, params = { page: 1 }) => Axios.get('/api/message',{params}).then(res => commit('set_message', res.data)),
    

  }
})
