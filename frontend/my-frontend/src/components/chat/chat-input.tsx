import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInUp, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChatInputProps = {
  isDark: boolean;
  disabled: boolean;
  onSend: (text: string) => void;
};

export function ChatInput({ isDark, disabled, onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const sendEnabled = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText('');
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(disabled ? 0.85 : 1, { duration: 180 }),
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
      <Animated.View
        entering={FadeInUp.delay(120).duration(360)}
        style={[containerStyle, { paddingBottom: Math.max(insets.bottom, 12) }]}
        className={`border-t px-4 pt-3 ${
          isDark
            ? 'border-chat-dark-border bg-chat-dark-surface'
            : 'border-chat-light-border bg-chat-light-surface'
        }`}>
        <View
          className={`flex-row items-end gap-2 rounded-3xl border px-3 py-2 ${
            isDark
              ? 'border-chat-dark-border bg-chat-dark-bg'
              : 'border-chat-light-border bg-chat-light-bg'
          }`}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message the assistant…"
            placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
            multiline
            maxLength={4000}
            editable={!disabled}
            className={`max-h-32 min-h-[44px] flex-1 py-2 text-base ${
              isDark ? 'text-chat-dark-text' : 'text-chat-light-text'
            }`}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            disabled={!sendEnabled}
            className={`mb-0.5 rounded-2xl px-4 py-2.5 ${
              sendEnabled
                ? isDark
                  ? 'bg-violet-500'
                  : 'bg-violet-600'
                : isDark
                  ? 'bg-slate-700'
                  : 'bg-slate-200'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Send message">
            {disabled ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-sm font-bold text-white">Send</Text>
            )}
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
