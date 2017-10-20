import Vuex from 'vuex'

const store = () => new Vuex.Store({

  state: {
    locales: ['en', 'ru'],
    locale: 'en'
  },
  mutations: {
    setLang (state, locale) {
      if (state.locales.indexOf(locale) !== -1) {
        state.locale = locale
      }
    }
  },
  actions: {

  }
})

export default store
