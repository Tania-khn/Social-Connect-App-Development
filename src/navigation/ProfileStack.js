/**
 * Profile Stack — nested inside the Profile tab.
 * Screens: Profile → ProfileEdit → Settings
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '@screens/ProfileScreen';
import ProfileEditScreen from '@screens/ProfileEditScreen';
import SettingsScreen from '@screens/SettingsScreen';
import {useTheme} from '@contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.background},
        headerTitleStyle: {fontWeight: '700', color: colors.text},
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{title: 'Edit Profile', headerBackTitle: 'Cancel'}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
}
