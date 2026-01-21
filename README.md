# AI Chat – Test Task

High-performance chat UI for LLMs.

## Stack

React 18, TypeScript, Vite  
Zustand, Tailwind CSS  
@tanstack/react-virtual

## Features

- Virtualized message list (large history, long messages)
- Streaming text generation (10–20ms chunks)
- Large responses (~10k words)
- No UI freezes during streaming
- Auto-scroll with manual override
- Async markdown parsing (worker)

## Run

```bash
npm install
npm run dev
```
