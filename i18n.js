/**
 * @file
 * Contains i18n localization configurations.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import WhiteLabel from "./configs/whiteLabel.config";
import en from "./configs/i18n/en/translations.json";

// import LanguageDetector from 'i18next-browser-languagedetectosr';
// || navigator.language

const resources = {
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: WhiteLabel.defaultLanguage,
  debug: false,
  keySeparator: false,
});
