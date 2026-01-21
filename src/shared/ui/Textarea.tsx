import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-[80px] w-full resize-none rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 ${className}`}
      {...props}
    />
  )
}

export default Textarea

