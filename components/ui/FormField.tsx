interface FormFieldProps {
  label: string
  children: React.ReactNode
  hint?: string
}

export default function FormField({ label, children, hint }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 600,
        color: 'var(--text-secondary)', marginBottom: 6,
        fontFamily: 'var(--font-main)',
      }}>
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-main)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}