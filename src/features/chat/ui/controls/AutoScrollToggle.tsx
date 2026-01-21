import { Toggle } from '@/shared/ui'

type AutoScrollToggleProps = {
  enabled: boolean
  onToggle: () => void
}

function AutoScrollToggle({ enabled, onToggle }: AutoScrollToggleProps) {
  return (
    <Toggle
      onClick={onToggle}
      className={enabled ? 'bg-sky-900 text-sky-100' : 'bg-slate-900 text-slate-300'}
    >
      Auto-scroll
    </Toggle>
  )
}

export default AutoScrollToggle

