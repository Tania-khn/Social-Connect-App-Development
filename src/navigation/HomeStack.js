/**
 * Home Stack — nested inside the Home tab.
 * Screens: Feed → CreatePost → Comments → UserProfile → Search → DiscoverPeople
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import CreatePostScreen from '@screens/CreatePostScreen';
import CommentsScreen from '@screens/CommentsScreen';
import UserProfileScreen from '@screens/UserProfileScreen';
import SearchScreen from '@screens/SearchScreen';
import DiscoverPeopleScreen from '@screens/DiscoverPeopleScreen';
import {useTheme} from '@contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
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
        name="Feed"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{title: 'New Post', headerBackTitle: 'Cancel'}}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{title: 'Comments', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{title: 'Profile', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{title: 'Search', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="DiscoverPeople"
        component={DiscoverPeopleScreen}
        options={{title: 'Discover People', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
}
