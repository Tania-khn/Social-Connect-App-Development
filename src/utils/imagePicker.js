/**
 * Helpers for picking images with react-native-image-picker.
 * Includes permission-aware wrappers for camera and gallery.
 */
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Platform, Alert, Linking} from 'react-native';
import {check, request, RESULTS, PERMISSIONS} from 'react-native-permissions';

/**
 * Pick a single image from the device gallery.
 * Returns null if the user cancels.
 *
 * @returns {Promise<{uri: string, name?: string, type?: string}|null>}
 */
export async function pickFromGallery() {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    quality: 0.7,
    includeBase64: false,
  });
  if (result.didCancel || result.errorCode) {
    return null;
  }
  const asset = result.assets?.[0];
  return asset ? normalizeAsset(asset) : null;
}

/**
 * Capture a single photo with the camera.
 * Returns null if the user cancels.
 */
export async function pickFromCamera() {
  const granted = await ensureCameraPermission();
  if (!granted) {
    return null;
  }
  const result = await launchCamera({
    mediaType: 'photo',
    cameraType: 'back',
    quality: 0.7,
    includeBase64: false,
  });
  if (result.didCancel || result.errorCode) {
    return null;
  }
  const asset = result.assets?.[0];
  return asset ? normalizeAsset(asset) : null;
}

/**
 * Show a bottom-sheet-like alert asking the user to pick a source.
 */
export async function pickImageWithChoice() {
  return new Promise(resolve => {
    Alert.alert(
      'Choose a photo',
      'Where would you like to pick from?',
      [
        {text: 'Cancel', onPress: () => resolve(null), style: 'cancel'},
        {text: 'Camera', onPress: () => resolve(pickFromCamera())},
        {text: 'Gallery', onPress: () => resolve(pickFromGallery())},
      ],
      {cancelable: true, onDismiss: () => resolve(null)},
    );
  });
}

function normalizeAsset(asset) {
  return {
    uri: asset.uri,
    name: asset.fileName || `photo-${Date.now()}.jpg`,
    type: asset.type || 'image/jpeg',
    width: asset.width,
    height: asset.height,
  };
}

async function ensureCameraPermission() {
  const perm =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  const status = await check(perm);
  if (status === RESULTS.GRANTED) {
    return true;
  }
  if (status === RESULTS.BLOCKED) {
    Alert.alert(
      'Camera permission required',
      'Please enable camera access in Settings to take a photo.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ],
    );
    return false;
  }
  const req = await request(perm);
  return req === RESULTS.GRANTED;
}
