import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation strings for the static UI shell
const resources = {
  en: {
    translation: {
      "nav": {
        "updates": "Updates",
        "countries": "Countries",
        "visa_categories": "Visa Categories",
        "timeline": "Timeline",
        "compare": "Compare",
        "eligibility": "Eligibility",
        "watchlist": "Watchlist",
        "admin": "Admin"
      },
      "common": {
        "search": "Search...",
        "loading": "Loading..."
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "updates": "Actualizaciones",
        "countries": "Países",
        "visa_categories": "Tipos de Visa",
        "timeline": "Cronología",
        "compare": "Comparar",
        "eligibility": "Elegibilidad",
        "watchlist": "Favoritos",
        "admin": "Admin"
      },
      "common": {
        "search": "Buscar...",
        "loading": "Cargando..."
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "updates": "Mises à jour",
        "countries": "Pays",
        "visa_categories": "Catégories de Visa",
        "timeline": "Chronologie",
        "compare": "Comparer",
        "eligibility": "Éligibilité",
        "watchlist": "Liste de suivi",
        "admin": "Admin"
      },
      "common": {
        "search": "Recherche...",
        "loading": "Chargement..."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
