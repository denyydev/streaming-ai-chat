import { Button, Textarea } from '@/shared/ui'
import AutoScrollToggle from './controls/AutoScrollToggle'
import GenerateButton from './controls/GenerateButton'
import StopButton from './controls/StopButton'

function Composer() {
  return (
    <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <Textarea placeholder="Type a message..." />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <AutoScrollToggle />
          </div>
          <div className="flex items-center gap-2">
            <GenerateButton />
            <StopButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Composer

