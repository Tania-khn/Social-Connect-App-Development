/**
 * App root component.
 *
 * Wraps the navigator in all global providers:
 *  - ThemeProvider  (design tokens)
 *  - AuthProvider   (Firebase Auth + user profile)
 *  - PostsProvider  (real-time post feed + actions)
 *
 * SafeAreaProvider is required by react-native-safe-area-context for
 * edge insets to work on notched devices.
 */
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import {AuthProvider} from '@contexts/AuthContext';
import {PostsProvider} from '@contexts/PostsContext';
import AppNavigator from '@navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PostsProvider>
            <AppNavigator />
          </PostsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
