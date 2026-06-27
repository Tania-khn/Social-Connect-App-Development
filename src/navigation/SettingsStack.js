/**
 * Settings Stack — nested inside the Settings tab.
 *
 * Screens:
 *  - Settings (main)
 *  - ChangePassword
 *  - NotificationSettings
 *  - PrivacyPolicy
 *  - HelpSupport
 *  - EmailInfo
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsScreen from '@screens/SettingsScreen';
import ChangePasswordScreen from '@screens/ChangePasswordScreen';
import NotificationSettingsScreen from '@screens/NotificationSettingsScreen';
import PrivacyPolicyScreen from '@screens/PrivacyPolicyScreen';
import HelpSupportScreen from '@screens/HelpSupportScreen';
import EmailInfoScreen from '@screens/EmailInfoScreen';
import {useTheme} from '@contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
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
        name="SettingsMain"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{title: 'Change Password', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{title: 'Notifications', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{title: 'Privacy Policy', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{title: 'Help & Support', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="EmailInfo"
        component={EmailInfoScreen}
        options={{title: 'Your Email', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
}
