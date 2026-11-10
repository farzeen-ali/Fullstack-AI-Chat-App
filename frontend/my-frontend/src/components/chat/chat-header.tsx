import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChatHeaderProps = {
  isDark: boolean;
  isStreaming: boolean;
  onToggleTheme: () => void;
};

export function ChatHeader({
  isDark,
  isStreaming,
  onToggleTheme,
}: ChatHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{ paddingTop: insets.top + 8 }}
      className={`border-b px-4 pb-3 ${
        isDark
          ? 'border-chat-dark-border bg-chat-dark-surface/95'
          : 'border-chat-light-border bg-chat-light-surface/95'
      }`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text
            className={`text-xl font-bold tracking-tight ${
              isDark ? 'text-chat-dark-text' : 'text-chat-light-text'
            }`}>
            AI Assistant
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <View
              className={`h-2 w-2 rounded-full ${
                isStreaming
                  ? 'bg-amber-400'
                  : isDark
                    ? 'bg-emerald-400'
                    : 'bg-emerald-500'
              }`}
            />
            <Text
              className={`text-xs font-medium ${
                isDark ? 'text-chat-dark-muted' : 'text-chat-light-muted'
              }`}>
              {isStreaming ? 'Streaming response…' : 'Online · proxied via NestJS'}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onToggleTheme}
          className={`rounded-2xl border px-3 py-2 ${
            isDark
              ? 'border-chat-dark-border bg-chat-dark-bg'
              : 'border-chat-light-border bg-chat-light-bg'
          }`}
          accessibilityRole="button"
          accessibilityLabel="Toggle color theme">
          <Text
            className={`text-xs font-semibold ${
              isDark ? 'text-chat-dark-text' : 'text-chat-light-text'
            }`}>
            {isDark ? 'Light' : 'Dark'}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
