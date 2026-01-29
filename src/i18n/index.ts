import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import vi from './locales/vi.json'

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'zh',
  messages: {
    zh,
    vi,
  },
})

export default i18n
