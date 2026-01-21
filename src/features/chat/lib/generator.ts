const loremChunks = [
  "Если интерфейс лагает, пользователь начинает сомневаться в своей жизни. ",
  "Хороший чат не дергается, даже когда в него летит тонна текста. ",
  "Стриминг — это когда ответ уже идет, а сервер еще думает, что сказать дальше. ",
  "Главное правило UI: если ничего не происходит — значит что-то сломалось. ",
  "Разработчики любят код, но еще больше они любят, когда код не мешает читать текст. ",
  "Когда автоскролл работает правильно, ты этого даже не замечаешь. ",
  "Если автоскролл работает неправильно — ты замечаешь это сразу. ",
  "Рендер без фризов — это не фича, это уважение к пользователю. ",
  "Виртуализация списка — момент, когда фронтендер начинает чувствовать себя взрослым. ",
  "Если DOM весит пять мегабайт, браузер имеет право обидеться. ",
];

const codeChunks = [
  "const buffer: string[] = [];\n",
  "function appendChunk(chunk: string) {\n",
  "  buffer.push(chunk)\n",
  "}\n",
  "export function flush() {\n",
  '  return buffer.join("")\n',
  "}\n",
];

type TextGeneratorState = {
  wordCount: number;
  targetWords: number;
  index: number;
  mode: "text" | "code";
};

export function createTextGenerator(targetWords = 10000) {
  const state: TextGeneratorState = {
    wordCount: 0,
    targetWords,
    index: 0,
    mode: "text",
  };

  function takeChunk(): string | null {
    if (state.wordCount >= state.targetWords) {
      return null;
    }

    const useCode = state.mode === "code";
    const pool = useCode ? codeChunks : loremChunks;

    const piece = pool[state.index % pool.length];
    state.index += 1;

    if (!piece || piece.trim().length === 0) {
      return takeChunk();
    }

    if (useCode) {
      const tokens = piece.match(/[A-Za-zА-Яа-я0-9_]+/g) ?? [];
      state.wordCount += tokens.length;
    } else {
      const words = piece.split(/\s+/).filter(Boolean).length;
      state.wordCount += words;
    }

    if (state.index % 7 === 0) {
      state.mode = state.mode === "text" ? "code" : "text";
    }

    return piece;
  }

  return {
    nextChunk: takeChunk,
  };
}
