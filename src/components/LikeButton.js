/**
 * LikeButton — heart toggle with Reanimated spring + Lottie-style
 * bounce when transitioning from unliked → liked.
 */
import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {colors, typography, spacing} from '@theme/index';

const SPRING_CONFIG = {
  damping: 6,
  stiffness: 200,
  mass: 0.6,
  overshootClamping: false,
};

export default function LikeButton({liked, count, onPress, testID}) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // When `liked` transitions to true, run a bounce + slight rotation.
  useEffect(() => {
    if (liked) {
      scale.value = withSequence(
        withSpring(1.35, SPRING_CONFIG),
        withSpring(1, SPRING_CONFIG),
      );
      rotation.value = withSequence(
        withTiming(-15, {duration: 100}),
        withTiming(0, {duration: 100}),
      );
    } else {
      scale.value = withSpring(0.9, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
    }
  }, [liked, scale, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {rotate: `${rotation.value}deg`},
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Unlike post' : 'Like post'}
      style={({pressed}) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.content}>
        <Animated.View style={animatedIconStyle}>
          <Icon
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? colors.like : colors.textMuted}
          />
        </Animated.View>
        <Text
          style={[
            styles.count,
            {color: liked ? colors.like : colors.textMuted},
          ]}>
          {count > 0 ? count : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
  },
  pressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 36,
  },
  count: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
});
