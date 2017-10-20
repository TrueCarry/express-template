export default function ({ app, store, route, params, error, redirect, hotReload }) {
  // Check if middleware called from hot-reloading, ignore
  if (hotReload) return
  // Get locale from params
  const locale = params.lang || 'en'
  if (store.state.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  // Set locale
  store.commit('setLang', locale)
  app.i18n.locale = store.state.locale
}
