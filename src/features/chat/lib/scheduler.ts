import { useChatStore } from "../model/store";
import { createTextGenerator } from "./generator";

let chunkTimer: ReturnType<typeof setInterval> | null = null;
let commitTimer: ReturnType<typeof setInterval> | null = null;
let activeGenerationId: string | null = null;

const chunkIntervalMs = 15;
let commitIntervalMs = 80;
const minCommitIntervalMs = 60;
const maxCommitIntervalMs = 180;
let chunksPerTick = 1;
const commitDurations: number[] = [];
const maxTrackedCommits = 10;

function resetScheduling() {
  commitIntervalMs = 80;
  chunksPerTick = 1;
  commitDurations.length = 0;
}

export function stopStreamingGeneration() {
  if (chunkTimer) {
    clearInterval(chunkTimer);
    chunkTimer = null;
  }

  if (commitTimer) {
    clearInterval(commitTimer);
    commitTimer = null;
  }

  activeGenerationId = null;
  resetScheduling();
}

type GenerationOptions = {
  targetWords?: number;
};

function scheduleCommitTimer(run: () => void) {
  if (commitTimer) {
    clearInterval(commitTimer);
  }

  commitTimer = setInterval(run, commitIntervalMs);
}

export function startStreamingGeneration(options?: GenerationOptions) {
  stopStreamingGeneration();

  const initialState = useChatStore.getState();

  if (initialState.isGenerating) {
    return;
  }

  initialState.startGenerating();

  const afterStart = useChatStore.getState();
  const generationId = afterStart.generationId;

  if (!generationId) {
    return;
  }

  activeGenerationId = generationId;

  const generator = createTextGenerator(options?.targetWords ?? 4000);

  const firstState = useChatStore.getState();
  const firstChunk = generator.nextChunk();

  if (!firstChunk) {
    firstState.finalizeStream("done");
    stopStreamingGeneration();
    return;
  }

  firstState.appendStreamChunk(firstChunk);
  firstState.commitStream();

  chunkTimer = setInterval(() => {
    const state = useChatStore.getState();

    if (
      !state.isGenerating ||
      !state.generationId ||
      state.generationId !== activeGenerationId
    ) {
      stopStreamingGeneration();
      return;
    }

    for (let index = 0; index < chunksPerTick; index += 1) {
      const chunk = generator.nextChunk();

      if (!chunk) {
        state.finalizeStream("done");
        stopStreamingGeneration();
        return;
      }

      state.appendStreamChunk(chunk);
    }
  }, chunkIntervalMs);

  const runCommit = () => {
    const state = useChatStore.getState();

    if (
      !state.isGenerating ||
      !state.generationId ||
      state.generationId !== activeGenerationId
    ) {
      stopStreamingGeneration();
      return;
    }

    const startedAt = performance.now();
    state.commitStream();
    const duration = performance.now() - startedAt;

    commitDurations.push(duration);
    if (commitDurations.length > maxTrackedCommits) {
      commitDurations.shift();
    }

    const sum = commitDurations.reduce((value, item) => value + item, 0);
    const average = sum / commitDurations.length;

    let updated = false;

    if (average > 12 && commitIntervalMs < maxCommitIntervalMs) {
      commitIntervalMs = Math.min(maxCommitIntervalMs, commitIntervalMs + 20);
      updated = true;
    } else if (average < 6 && commitIntervalMs > minCommitIntervalMs) {
      commitIntervalMs = Math.max(minCommitIntervalMs, commitIntervalMs - 10);
      updated = true;
    }

    if (updated) {
      const ratio = Math.max(1, Math.round(commitIntervalMs / chunkIntervalMs));
      chunksPerTick = Math.min(4, ratio);
      scheduleCommitTimer(runCommit);
    }
  };

  scheduleCommitTimer(runCommit);
}
