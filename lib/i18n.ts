import en from '../locales/en.json'
import he from '../locales/he.json'
import ar from '../locales/ar.json'
import { useLangStore } from '@/store/langStore'

export type TranslationKey = keyof typeof en

export const translations: Record<string, Record<TranslationKey, string>> = {
  EN: en,
  HE: he as Record<TranslationKey, string>,
  AR: ar as Record<TranslationKey, string>
}

export function useT() {
  // Subscribing to the store makes the translations instantly reactive
  const lang = useLangStore((state) => state.lang)
  return (key: TranslationKey) => translations[lang]?.[key] ?? en[key]
}