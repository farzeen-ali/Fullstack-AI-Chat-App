export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type StreamChatOptions = {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
  onChunk: (text: string) => void;
  signal?: AbortSignal;
};

export class ChatApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ChatApiError';
  }
}

function getBackendUrl(): string {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new ChatApiError(
      'EXPO_PUBLIC_BACKEND_URL is not set. Point it to your NestJS server (e.g. http://192.168.x.x:3000).',
    );
  }
  return url.replace(/\/$/, '');
}

export async function streamChat({
  messages,
  onChunk,
  signal,
}: StreamChatOptions): Promise<void> {
  const base = getBackendUrl();
  let response: Response;

  try {
    response = await fetch(`${base}/ai/chat`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch {
    throw new ChatApiError(
      'Cannot reach the backend. Check that NestJS is running and EXPO_PUBLIC_BACKEND_URL matches your LAN IP.',
    );
  }

  if (response.status === 429) {
    throw new ChatApiError(
      'Rate limit reached (10 requests per minute). Please wait and try again.',
      429,
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new ChatApiError(
      detail || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (!response.body) {
    const full = await response.text();
    if (full) onChunk(full);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) onChunk(chunk);
  }
}
