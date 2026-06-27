/**
 * CreatePostScreen — compose a new text post (image optional).
 *
 * Uses Formik + Yup for validation. The image picker integrates
 * react-native-image-picker (camera + gallery choice).
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
import {usePosts} from '@contexts/PostsContext';
import {useAuth} from '@contexts/AuthContext';
import {postSchema} from '@utils/validation';
import {pickImageWithChoice} from '@utils/imagePicker';
import {colors, typography, spacing, radii} from '@theme/index';

const MAX_CHARS = 1000;

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const {addPost} = usePosts();
  const {user, profile} = useAuth();
  const [image, setImage] = useState(null);

  const formik = useFormik({
    initialValues: {content: ''},
    validationSchema: postSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        await addPost({content: values.content, image});
        navigation.goBack();
      } catch (err) {
        Alert.alert('Could not post', err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePickImage = async () => {
    const picked = await pickImageWithChoice();
    if (picked) {
      setImage(picked);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        {/* Header with Cancel + title */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBackBtn}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={24} color={colors.primary} />
            <Text style={styles.headerBackText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.authorRow}>
          <View style={styles.avatarPlaceholder}>
            <Icon name="account" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.authorName}>
              {profile?.displayName || user?.displayName || 'You'}
            </Text>
            <Text style={styles.authorSub}>Posting publicly</Text>
          </View>
        </View>

        <FormTextInput
          label="What's on your mind?"
          value={formik.values.content}
          onChangeText={formik.handleChange('content')}
          onBlur={formik.handleBlur('content')}
          placeholder="Share something with your community…"
          error={formik.errors.content}
          touched={formik.touched.content}
          multiline
          numberOfLines={6}
        />

        <View style={styles.counterRow}>
          <Text style={styles.counter}>
            {formik.values.content.length} / {MAX_CHARS}
          </Text>
        </View>

        {image ? (
          <View style={styles.imagePreviewWrap}>
            <Image source={{uri: image.uri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setImage(null)}>
              <Icon name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.attachmentBtn}
          onPress={handlePickImage}>
          <Icon name="image-multiple-outline" size={22} color={colors.primary} />
          <Text style={styles.attachmentBtnText}>
            {image ? 'Change photo' : 'Add photo'}
          </Text>
        </TouchableOpacity>

        <GradientButton
          label="Post"
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
          disabled={!formik.isValid || (!formik.values.content.trim() && !image)}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerBackText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '700',
  },
  headerRightSpacer: {
    width: 80, // balance the layout so title centers
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    ...typography.label,
    fontWeight: '700',
  },
  authorSub: {
    ...typography.caption,
  },
  counterRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  counter: {
    ...typography.caption,
  },
  imagePreviewWrap: {
    position: 'relative',
    marginBottom: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radii.md,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  attachmentBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
