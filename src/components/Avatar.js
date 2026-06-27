/**
 * Avatar — renders the user's profile photo, or a deterministic
 * gradient fallback with initials when no photo is set.
 */
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {gradients} from '@theme/index';
import {getInitials, colorFromString} from '@utils/string';

export default function Avatar({uri, name = '', size = 44, ring = false}) {
  const fontSize = Math.max(14, size * 0.4);
  const fallbackColor = colorFromString(name || 'A');

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return (
      <View
        style={[
          containerStyle,
          ring && {
            borderColor: gradients.primary[0],
            borderWidth: 2,
          },
        ]}>
        <Image
          source={{uri}}
          style={[containerStyle, styles.image]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[fallbackColor, gradients.primary[1]]}
      style={[containerStyle, styles.centered]}>
      <Text style={[styles.initials, {fontSize}]}>{getInitials(name)}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
