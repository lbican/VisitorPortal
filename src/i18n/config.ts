import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from '../locales/en/translation.json';
import enDynamic from '../locales/en/dynamic-translation.json';
import enCountries from '../locales/en/countries.json';
import hrLocale from '../locales/hr/translation.json';
import hrDynamic from '../locales/hr/dynamic-translation.json';
import hrCountries from '../locales/hr/countries.json';

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    ...enLocale,
                    ...enDynamic,
                    ...enCountries,
                },
            },
            hr: {
                translation: {
                    ...hrLocale,
                    ...hrDynamic,
                    ...hrCountries,
                },
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
