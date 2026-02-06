import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const storedLocale = localStorage.getItem('locale')
  const initialLocale = storedLocale || 'id-ID'

  const i18n = createI18n({
    locale: initialLocale,
    fallbackLocale: 'id-ID',
    globalInjection: true,
    messages,
  })

  // Set i18n instance on app
  app.use(i18n)
})
