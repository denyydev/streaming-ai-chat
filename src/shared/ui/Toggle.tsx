import type { ButtonHTMLAttributes } from 'react'

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement>

function Toggle({ className = '', children, ...props }: ToggleProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Toggle

