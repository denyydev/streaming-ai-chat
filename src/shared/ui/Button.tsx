import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-50 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

