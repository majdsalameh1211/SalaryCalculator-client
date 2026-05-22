'use client'

import { useState } from 'react'
import { useLangStore } from '@/store/langStore'
import { translations } from '@/lib/i18n'

interface FABProps {
  onAddShift: () => void
  onAddFuel: () => void
  onAddParking: () => void
}

const FAB_ITEMS = [
  {
    key: 'shift',
    labelKey: 'shift' as const,
    color: '#1D9E75',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    key: 'fuel',
    labelKey: 'fuel' as const,
    color: '#BA7517',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 22V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
        <path d="M14 9h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0V8l-3-3" />
        <line x1="3" y1="22" x2="14" y2="22" />
        <rect x="5" y="8" width="6" height="4" rx="1" />
      </svg>
    ),
  },
  {
    key: 'parking',
    labelKey: 'parking' as const,
    color: '#534AB7',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
  },
]

export default function FAB({ onAddShift, onAddFuel, onAddParking }: FABProps) {
  const [open, setOpen] = useState(false)
  const { lang } = useLangStore()
  const t = (k: keyof typeof translations.EN) => translations[lang]?.[k] ?? translations.EN[k]

  const handlers: Record<string, () => void> = {
    shift: () => { onAddShift(); setOpen(false) },
    fuel: () => { onAddFuel(); setOpen(false) },
    parking: () => { onAddParking(); setOpen(false) },
  }

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 98 }}
        />
      )}

      <div
        dir="ltr"
        style={{
          position: 'fixed', bottom: 80, zIndex: 99,
          width: '100%', maxWidth: 480,
          left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          paddingRight: 20
        }}
      >
        <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {/* Mini buttons */}
          {open && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', marginBottom: 12 }}>
              {/* Inside the return block, the simplified map function */}
              {FAB_ITEMS.map((item) => (
                <button
                  key={item.key} // Moved the key here
                  onClick={handlers[item.key]}
                  aria-label={t(item.labelKey)} // Crucial for accessibility
                  style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    background: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  {item.icon}
                </button>

              ))}
            </div>
          )}

          {/* Main FAB */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="add entry"
            style={{
              width: 50, height: 50,
              borderRadius: '50%',
              border: 'none',
              background: '#378add',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(55,138,221,0.4)',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div >
    </>
  )
}