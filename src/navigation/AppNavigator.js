/**
 * App Navigator — root navigator that switches between Auth and Main
 * based on the current auth state.
 *
 * Uses a single conditional render rather than a navigation container
 * with two stacks — this avoids an unnecessary remount of the bottom
 * tabs when auth state changes.
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '@contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import {ActivityIndicator, View} from 'react-native';
import {useTheme} from '@contexts/ThemeContext';

export default function AppNavigator() {
  const {initializing, isAuthenticated} = useAuth();
  const {colors} = useTheme();

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
