import { create } from "zustand";
import type {
  ChatRole,
  ChatState,
  Message,
  MessageId,
  MessageStatus,
} from "./types";

const MAX_STREAM_BUFFER_CHUNKS = 300;

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createMessage(input: {
  role: ChatRole;
  text: string;
  status?: MessageStatus;
}): Message {
  const now = Date.now();

  return {
    id: createId(),
    role: input.role,
    text: input.text,
    createdAt: now,
    updatedAt: now,
    status: input.status ?? "done",
  };
}

function updateMessage(
  messagesById: Record<MessageId, Message>,
  id: MessageId,
  update: (message: Message) => Message,
) {
  const existing = messagesById[id];

  if (!existing) {
    return messagesById;
  }

  return {
    ...messagesById,
    [id]: update(existing),
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  messageIds: [],
  messagesById: {},
  streamingMessageId: null,
  generationId: null,
  isGenerating: false,
  streamBuffer: [],
  commitVersion: 0,
  scrollToBottomVersion: 0,
  addMessage: (input) => {
    const message = createMessage(input);

    set((state) => ({
      messageIds: [...state.messageIds, message.id],
      messagesById: {
        ...state.messagesById,
        [message.id]: message,
      },
    }));

    return message.id;
  },
  reset: () => {
    set({
      messageIds: [],
      messagesById: {},
      streamingMessageId: null,
      generationId: null,
      isGenerating: false,
      streamBuffer: [],
      commitVersion: 0,
      scrollToBottomVersion: 0,
    });
  },
  startGenerating: () => {
    const { isGenerating } = get();
    if (isGenerating) {
      return;
    }

    const message = createMessage({
      role: "assistant",
      text: "",
      status: "streaming",
    });

    const generationId = createId();

    set((state) => ({
      messageIds: [...state.messageIds, message.id],
      messagesById: {
        ...state.messagesById,
        [message.id]: message,
      },
      streamingMessageId: message.id,
      generationId,
      isGenerating: true,
      streamBuffer: [],
      scrollToBottomVersion: state.scrollToBottomVersion + 1,
    }));
  },
  stopGenerating: () => {
    const { isGenerating } = get();
    if (!isGenerating) {
      return;
    }

    get().finalizeStream("stopped");
  },
  appendStreamChunk: (chunk) => {
    const { isGenerating } = get();
    if (!isGenerating) {
      return;
    }

    set((state) => ({
      streamBuffer: [...state.streamBuffer, chunk],
    }));

    const size = get().streamBuffer.length;
    if (size > MAX_STREAM_BUFFER_CHUNKS) {
      get().commitStream();
    }
  },
  commitStream: () => {
    const { streamingMessageId } = get();

    if (!streamingMessageId) {
      return;
    }

    set((state) => {
      if (!state.streamBuffer.length) {
        return state;
      }

      const joined = state.streamBuffer.join("");

      return {
        ...state,
        messagesById: updateMessage(
          state.messagesById,
          streamingMessageId,
          (message) => ({
            ...message,
            text: message.text + joined,
            updatedAt: Date.now(),
          }),
        ),
        streamBuffer: [],
        commitVersion: state.commitVersion + 1,
      };
    });
  },
  finalizeStream: (status) => {
    const { streamingMessageId } = get();

    if (!streamingMessageId) {
      return;
    }

    set((state) => {
      const hasBuffer = state.streamBuffer.length > 0;

      const nextMessagesById = hasBuffer
        ? updateMessage(state.messagesById, streamingMessageId, (message) => ({
            ...message,
            text: message.text + state.streamBuffer.join(""),
            updatedAt: Date.now(),
          }))
        : state.messagesById;

      const finalMessagesById = updateMessage(
        nextMessagesById,
        streamingMessageId,
        (message) => ({
          ...message,
          status,
          updatedAt: Date.now(),
        }),
      );

      return {
        ...state,
        messagesById: finalMessagesById,
        streamingMessageId: null,
        generationId: null,
        isGenerating: false,
        streamBuffer: [],
        commitVersion: state.commitVersion + 1,
      };
    });
  },
  requestScrollToBottom: () => {
    set((state) => ({
      scrollToBottomVersion: state.scrollToBottomVersion + 1,
    }));
  },
}));
