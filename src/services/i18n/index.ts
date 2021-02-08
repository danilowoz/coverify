import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './en'
import pt from './pt'

const resources = { en, pt }

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  resources,
})

export default i18n
