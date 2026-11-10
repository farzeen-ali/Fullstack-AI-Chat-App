import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Pressable, Text, View } from 'react-native';

type ErrorBannerProps = {
  message: string;
  onDismiss: () => void;
  isDark: boolean;
};

export function ErrorBanner({ message, onDismiss, isDark }: ErrorBannerProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(280)}
      exiting={FadeOutUp.duration(200)}
      className="absolute left-4 right-4 top-14 z-50">
      <View
        className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-lg ${
          isDark
            ? 'border-red-500/40 bg-red-950/90'
            : 'border-red-200 bg-red-50'
        }`}>
        <Text
          className={`flex-1 pr-3 text-sm font-medium ${
            isDark ? 'text-red-100' : 'text-red-800'
          }`}>
          {message}
        </Text>
        <Pressable
          onPress={onDismiss}
          className="rounded-full bg-black/10 px-3 py-1 dark:bg-white/10"
          accessibilityRole="button"
          accessibilityLabel="Dismiss error">
          <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-red-900'}`}>
            Dismiss
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
