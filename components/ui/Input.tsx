import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export default function Input({ error, style, ...props }: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '11px 13px',
        fontSize: 14,
        fontFamily: 'var(--font-main)',
        background: error ? 'var(--status-red-bg)' : 'var(--input-bg)',
        border: `0.5px solid ${error ? 'var(--status-red-border)' : 'var(--input-border)'}`,
        borderRadius: 10,
        color: 'var(--text-primary)',
        outline: 'none',
        ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = error ? '#e24b4a' : '#378add'; props.onFocus?.(e) }}
      onBlur={(e) => { e.target.style.borderColor = error ? 'var(--status-red-border)' : 'var(--input-border)'; props.onBlur?.(e) }}
    />
  )
}