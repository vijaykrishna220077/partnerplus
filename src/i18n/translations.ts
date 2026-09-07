import { enLocales } from '../locales/en';
import { taLocales } from '../locales/ta';
import { hiLocales } from '../locales/hi';
import { teLocales } from '../locales/te';
import { knLocales } from '../locales/kn';
import { mlLocales } from '../locales/ml';
import { bnLocales } from '../locales/bn';
import { mrLocales } from '../locales/mr';
import { LanguageCode } from '../types';

// Helper to flatten nested locale domain properties to top-level key/values for backwards compatibility
function createLanguageDictionary<T extends Record<string, any>>(domainLocales: T) {
  const flattened: Record<string, string> = {};
  Object.keys(domainLocales).forEach((domainKey) => {
    const domainObj = domainLocales[domainKey];
    if (typeof domainObj === 'object' && domainObj !== null) {
      Object.keys(domainObj).forEach((propKey) => {
        flattened[propKey] = domainObj[propKey];
      });
    }
  });
  return {
    ...domainLocales,
    ...flattened,
    // Add essential legacy legacy flat properties
    appName: "PartnerPlus",
    appTagline: "Cooperative Gig Services Platform",
    navHome: domainLocales.common?.all || "Home",
    navServices: domainLocales.common?.search || "Services",
    navBookService: domainLocales.booking?.bookNow || "Book a Service",
    navHelp: domainLocales.common?.helpline || "Help & Support",
  };
}

export const translations = {
  en: createLanguageDictionary(enLocales),
  ta: createLanguageDictionary(taLocales),
  hi: createLanguageDictionary(hiLocales),
  te: createLanguageDictionary(teLocales),
  kn: createLanguageDictionary(knLocales),
  ml: createLanguageDictionary(mlLocales),
  bn: createLanguageDictionary(bnLocales),
  mr: createLanguageDictionary(mrLocales),
};

export type TranslationKey = keyof typeof translations['en'];

/**
 * Global helper function to get translated text with nested key support,
 * variable interpolation, pluralization, and English fallback.
 *
 * Examples:
 *   t('en', 'common.bookNow') => "Book Now"
 *   t('ta', 'worker.availableCount', { count: 5 }) => "5 பணியாளர்கள் உள்ளனர்"
 */
function humanizeKey(key: string): string {
  const lastPart = key.includes('.') ? key.split('.').pop() || key : key;
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export function getTranslatedText(
  lang: LanguageCode,
  pathOrKey: string,
  params?: Record<string, any>
): string {
  const langDict = translations[lang] || translations.en;
  const englishDict = translations.en;

  let text: string | undefined = undefined;

  // 1. Check dot notation e.g. "common.bookNow"
  if (pathOrKey.includes('.')) {
    const parts = pathOrKey.split('.');
    let current: any = langDict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }
    if (typeof current === 'string') {
      text = current;
    }

    // Fallback to English if not found
    if (!text) {
      let engCurrent: any = englishDict;
      for (const part of parts) {
        if (engCurrent && typeof engCurrent === 'object' && part in engCurrent) {
          engCurrent = engCurrent[part];
        } else {
          engCurrent = undefined;
          break;
        }
      }
      if (typeof engCurrent === 'string') {
        text = engCurrent;
      }
    }
  }

  // 2. Direct property lookup fallback e.g. "bookNow"
  if (!text) {
    const flatVal = (langDict as any)[pathOrKey] || (englishDict as any)[pathOrKey];
    if (typeof flatVal === 'string') {
      text = flatVal;
    }
  }

  // 3. Fallback to humanized text if missing (never render raw keys like 'jobs.cleaningJob')
  if (!text) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing translation for key: "${pathOrKey}" in language "${lang}"`);
    }
    text = humanizeKey(pathOrKey);
  }

  // 4. Perform parameter interpolation e.g. { count: 5 }
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      const paramVal = params[key];
      text = text!.replace(new RegExp(`{\\s*${key}\\s*}`, 'g'), String(paramVal));
    });
  }

  return text;
}

/**
 * Format currency according to locale
 */
export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date | string, lang: LanguageCode = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const localeMap: Record<LanguageCode, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
  };
  return d.toLocaleDateString(localeMap[lang] || 'en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
