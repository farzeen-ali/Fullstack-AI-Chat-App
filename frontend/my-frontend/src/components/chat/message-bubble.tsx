import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import type { ChatMessage } from '@/lib/chat-api';

type MessageBubbleProps = {
  message: ChatMessage;
  isDark: boolean;
  isStreaming?: boolean;
};

export function MessageBubble({
  message,
  isDark,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const entering = isUser
    ? FadeInUp.springify().damping(18).stiffness(120)
    : FadeInUp.delay(40).springify().damping(18).stiffness(120);

  return (
    <Animated.View
      entering={entering}
      className={`mb-3 max-w-[88%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      <View
        className={`rounded-3xl px-4 py-3 shadow-sm ${
          isUser
            ? isDark
              ? 'rounded-br-md bg-chat-dark-bubbleUser'
              : 'rounded-br-md bg-chat-light-bubbleUser'
            : isDark
              ? 'rounded-bl-md bg-chat-dark-bubbleAi'
              : 'rounded-bl-md bg-chat-light-bubbleAi'
        }`}>
        <Text
          className={`text-[15px] leading-[22px] ${
            isUser
              ? 'text-white'
              : isDark
                ? 'text-chat-dark-text'
                : 'text-chat-light-text'
          }`}>
          {message.content || (isStreaming ? ' ' : '')}
          {isStreaming && message.content.length === 0 ? (
            <Animated.Text entering={FadeInDown.duration(300)}>▍</Animated.Text>
          ) : null}
        </Text>
      </View>
    </Animated.View>
  );
}
