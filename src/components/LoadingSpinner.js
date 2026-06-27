/**
 * LoadingSpinner — centered spinner with optional label.
 */
import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {colors, typography, spacing} from '@theme/index';

export default function LoadingSpinner({label = 'Loading…', size = 'large'}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
