/**
 * Auth Navigator — Stack shown when the user is NOT signed in.
 * Screens: Login → SignUp → ForgotPassword
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@screens/auth/LoginScreen';
import SignUpScreen from '@screens/auth/SignUpScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import {useTheme} from '@contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.background},
        headerTitleStyle: {fontWeight: '700'},
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{title: 'Sign Up', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{title: 'Reset Password', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
}
