/**
 * Main Tabs — bottom tab navigator shown when the user IS signed in.
 * Tabs: Home (feed) | Profile | Settings
 *
 * Matches the spec: "Add screens for Home, Profile, and Settings."
 */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import SettingsStack from './SettingsStack';
import {useTheme} from '@contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home-variant-outline" size={size} color={color} />
          ),
          tabBarActiveIcon: ({color, size}) => (
            <Icon name="home-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="account-outline" size={size} color={color} />
          ),
          tabBarActiveIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          title: 'Settings',
          tabBarIcon: ({color, size}) => (
            <Icon name="cog-outline" size={size} color={color} />
          ),
          tabBarActiveIcon: ({color, size}) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
