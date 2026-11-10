import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type TypingIndicatorProps = {
  isDark: boolean;
};

function PulseDot({ delay, isDark }: { delay: number; isDark: boolean }) {
  const scale = useSharedValue(0.65);
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(0.65, { duration: 420, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420 }),
          withTiming(0.35, { duration: 420 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={style}
      className={`mx-0.5 h-2.5 w-2.5 rounded-full ${isDark ? 'bg-violet-300' : 'bg-violet-500'}`}
    />
  );
}

export function TypingIndicator({ isDark }: TypingIndicatorProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      className={`mr-auto max-w-[85%] rounded-3xl rounded-bl-md px-4 py-3 ${
        isDark ? 'bg-chat-dark-bubbleAi' : 'bg-chat-light-bubbleAi'
      }`}>
      <View className="flex-row items-center">
        <PulseDot delay={0} isDark={isDark} />
        <PulseDot delay={120} isDark={isDark} />
        <PulseDot delay={240} isDark={isDark} />
      </View>
    </Animated.View>
  );
}
