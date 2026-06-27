/**
 * Notifications / FCM setup.
 *
 * Importing this module at app start (see `index.js`) configures:
 *  - Firebase Cloud Messaging permission requests
 *  - Foreground message handlers
 *  - Background message handlers
 *  - Notification channel (Android)
 *
 * The actual notification triggers (e.g., when someone likes a post)
 * should be implemented as Firebase Functions — see the README's
 * "Notifications" section for an example trigger.
 */
import {Platform, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {saveUserFcmToken} from './users';

/**
 * Request notification permissions from the OS.
 * On iOS this triggers the native permission dialog.
 */
export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

/**
 * Create an Android notification channel.
 * Required for Android 8+ to deliver notifications.
 */
export async function createAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: 'social-connect',
    name: 'Social Connect Notifications',
    importance: AndroidImportance.HIGH,
  });
}

/**
 * Foreground message handler — uses notifee to display a local notification
 * when a message arrives while the app is open.
 */
messaging().onMessage(async remoteMessage => {
  const {notification, data} = remoteMessage;
  await notifee.displayNotification({
    title: notification?.title || 'Social Connect',
    body: notification?.body || '',
    android: {
      channelId: 'social-connect',
      smallIcon: 'ic_notification',
      pressAction: {
        id: 'default',
      },
    },
    data,
  });
});

/**
 * Background message handler — MUST be a top-level registration,
 * not inside any component.
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Optionally log analytics or schedule background work here.
  // Do not call UI code from here.
});

/**
 * Fetch the FCM token for the current device and (optionally) persist
 * it to the user's profile so server-side triggers can target them.
 *
 * @param {string|null} uid - if provided, token is saved to user doc
 * @returns {Promise<string|null>}
 */
export async function registerFcmToken(uid = null) {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    if (uid && token) {
      await saveUserFcmToken(uid, token);
    }
    return token;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('FCM token registration failed:', err);
    return null;
  }
}

/**
 * Convenience helper: call from AuthContext right after login.
 */
export async function initNotificationsForUser(uid) {
  const granted = await requestNotificationPermission();
  if (!granted) {
    Alert.alert(
      'Notifications disabled',
      'You can enable them later from Settings to get notified about likes and comments.',
    );
    return null;
  }
  await createAndroidChannel();
  return registerFcmToken(uid);
}
