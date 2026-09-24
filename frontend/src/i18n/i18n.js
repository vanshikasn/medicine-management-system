import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'

// Set up i18next with our translation files.
// To add a new language later (e.g. Hindi), create hi.json and add it to "resources".
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en', // current language
    fallbackLng: 'en', // used if a key is missing in the current language
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
  })

export default i18n
