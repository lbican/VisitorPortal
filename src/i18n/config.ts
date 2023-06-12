import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from '../locales/en/translation.json';
import hrLocale from '../locales/hr/translation.json';

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enLocale,
            },
            hr: {
                translation: hrLocale,
            },
        },
        lng: 'hr',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })
    .catch((error) => {
        console.error(error);
    });

export default i18n;
