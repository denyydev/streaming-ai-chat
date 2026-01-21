import type { MarkdownNode } from '../model/types'

type RequestPayload = {
  id: string
  version: number
  text: string
}

type ResponsePayload = {
  id: string
  version: number
  ast: MarkdownNode[]
}

let markdownWorker: Worker | null = null

const cache = new Map<string, MarkdownNode[]>()
const inFlight = new Map<string, Promise<MarkdownNode[]>>()

function getWorker() {
  if (!markdownWorker) {
    markdownWorker = new Worker(
      new URL('./markdown.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    )
  }

  return markdownWorker
}

export function requestMarkdownParse(input: RequestPayload): Promise<MarkdownNode[]> {
  const key = `${input.id}:${input.version}`

  const cached = cache.get(key)
  if (cached) {
    return Promise.resolve(cached)
  }

  const pending = inFlight.get(key)
  if (pending) {
    return pending
  }

  const worker = getWorker()

  const promise = new Promise<MarkdownNode[]>((resolve, reject) => {
    function handleMessage(event: MessageEvent<ResponsePayload>) {
      const { id, version, ast } = event.data
      const eventKey = `${id}:${version}`

      if (eventKey !== key) {
        return
      }

      cache.set(eventKey, ast)
      inFlight.delete(eventKey)
      worker.removeEventListener('message', handleMessage as EventListener)
      resolve(ast)
    }

    function handleError(error: ErrorEvent) {
      inFlight.delete(key)
      worker.removeEventListener('message', handleMessage as EventListener)
      reject(error)
    }

    worker.addEventListener('message', handleMessage as EventListener)
    worker.addEventListener('error', handleError as EventListener, { once: true } as AddEventListenerOptions)

    const message: RequestPayload = {
      id: input.id,
      version: input.version,
      text: input.text,
    }

    worker.postMessage(message)
  })

  inFlight.set(key, promise)

  return promise
}


