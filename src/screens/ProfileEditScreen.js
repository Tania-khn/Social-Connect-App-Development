/**
 * ProfileEditScreen — edit display name, bio, and profile photo.
 *
 * Pulls current values from AuthContext.profile, saves via updateUserProfile,
 * and optimistically patches the local profile state so the UI updates instantly.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormTextInput from '@components/FormTextInput';
import GradientButton from '@components/GradientButton';
import Avatar from '@components/Avatar';
import {useAuth} from '@contexts/AuthContext';
import {updateUserProfile} from '@api/users';
import {profileEditSchema} from '@utils/validation';
import {pickImageWithChoice} from '@utils/imagePicker';
import {colors, typography, spacing, radii} from '@theme/index';

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const {user, profile, patchProfile} = useAuth();
  const [photo, setPhoto] = useState(null);

  const formik = useFormik({
    initialValues: {
      displayName: profile?.displayName || user?.displayName || '',
      bio: profile?.bio || '',
    },
    enableReinitialize: true,
    validationSchema: profileEditSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        const photoURL = await updateUserProfile({
          uid: user.uid,
          displayName: values.displayName,
          bio: values.bio,
          photo,
        });
        // Optimistic local patch
        patchProfile({
          displayName: values.displayName,
          bio: values.bio,
          ...(photoURL ? {photoURL} : {}),
        });
        navigation.goBack();
      } catch (err) {
        Alert.alert('Could not save profile', err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePickPhoto = async () => {
    const picked = await pickImageWithChoice();
    if (picked) {
      setPhoto(picked);
    }
  };

  const previewUri = photo?.uri || profile?.photoURL;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        {/* Avatar picker */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            onPress={handlePickPhoto}
            activeOpacity={0.85}
            style={styles.avatarTouchable}>
            {previewUri ? (
              <Image source={{uri: previewUri}} style={styles.avatarImage} />
            ) : (
              <Avatar
                name={formik.values.displayName || 'You'}
                size={110}
                ring
              />
            )}
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        <FormTextInput
          label="Display name"
          value={formik.values.displayName}
          onChangeText={formik.handleChange('displayName')}
          onBlur={formik.handleBlur('displayName')}
          placeholder="Your name"
          error={formik.errors.displayName}
          touched={formik.touched.displayName}
          autoCapitalize="words"
          icon={
            <Icon name="account-outline" size={20} color={colors.textMuted} />
          }
        />

        <FormTextInput
          label="Bio"
          value={formik.values.bio}
          onChangeText={formik.handleChange('bio')}
          onBlur={formik.handleBlur('bio')}
          placeholder="Tell people about yourself…"
          error={formik.errors.bio}
          touched={formik.touched.bio}
          multiline
          numberOfLines={4}
        />

        <View style={styles.counterRow}>
          <Text style={styles.counter}>
            {formik.values.bio.length} / 160
          </Text>
        </View>

        <GradientButton
          label="Save Changes"
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
          disabled={!formik.isValid}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.xxl,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  avatarHint: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  counterRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  counter: {
    ...typography.caption,
  },
});
