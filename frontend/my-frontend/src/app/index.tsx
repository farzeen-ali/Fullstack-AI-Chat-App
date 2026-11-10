import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ErrorBanner } from '@/components/chat/error-banner';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { useAppTheme } from '@/context/app-theme';
import {
  ChatApiError,
  type ChatMessage,
  streamChat,
} from '@/lib/chat-api';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hi! I run through your NestJS backend — your OpenAI key never leaves the server. Ask me anything.',
};

export default function ChatScreen() {
  const { colorScheme, toggleLightDark } = useAppTheme();
  const isDark = colorScheme === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, showTyping, scrollToEnd]);

  const handleSend = useCallback(
    async (text: string) => {
      setError(null);
      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content: text,
      };

      const assistantId = createId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
      };

      const nextMessages = [...messages, userMessage];
      setMessages([...nextMessages, assistantPlaceholder]);
      setIsStreaming(true);
      setShowTyping(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const payload = nextMessages.map(({ role, content }) => ({ role, content }));

      try {
        let firstChunk = true;
        await streamChat({
          messages: payload,
          signal: controller.signal,
          onChunk: (chunk) => {
            if (firstChunk) {
              setShowTyping(false);
              firstChunk = false;
            }
            setMessages((current) =>
              current.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk }
                  : m,
              ),
            );
          },
        });
      } catch (err) {
        if (err instanceof ChatApiError) {
          setError(err.message);
        } else if (
          err instanceof Error &&
          err.name !== 'AbortError'
        ) {
          setError(err.message);
        }
        setMessages((current) =>
          current.filter((m) => m.id !== assistantId || m.content.length > 0),
        );
      } finally {
        setShowTyping(false);
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages],
  );

  return (
    <View
      className={`flex-1 ${isDark ? 'bg-chat-dark-bg' : 'bg-chat-light-bg'}`}>
      <ChatHeader
        isDark={isDark}
        isStreaming={isStreaming}
        onToggleTheme={toggleLightDark}
      />

      {error ? (
        <ErrorBanner
          message={error}
          isDark={isDark}
          onDismiss={() => setError(null)}
        />
      ) : null}

      <Animated.FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition.springify().damping(20)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToEnd}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isDark={isDark}
            isStreaming={
              isStreaming &&
              item.role === 'assistant' &&
              item.id === messages[messages.length - 1]?.id
            }
          />
        )}
        ListFooterComponent={
          showTyping
            ? () => <TypingIndicator isDark={isDark} />
            : undefined
        }
      />

      <ChatInput isDark={isDark} disabled={isStreaming} onSend={handleSend} />
    </View>
  );
}
