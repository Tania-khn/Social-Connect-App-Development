/**
 * Yup validation schemas for all forms in the app.
 *
 * Centralizing schemas here keeps form validation consistent and
 * makes it trivial to tweak validation rules in one place.
 */
import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signUpSchema = yup.object().shape({
  displayName: yup
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(40, 'Display name is too long')
    .required('Display name is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
});

export const profileEditSchema = yup.object().shape({
  displayName: yup
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(40, 'Display name is too long')
    .required('Display name is required'),
  bio: yup
    .string()
    .trim()
    .max(160, 'Bio is too long (160 chars max)')
    .notRequired()
    .default(''),
});

export const postSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, 'Write something to post')
    .max(1000, 'Post is too long (1000 chars max)')
    .required('Write something to post'),
});

export const commentSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment is too long')
    .required('Comment cannot be empty'),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(6, 'Current password must be at least 6 characters')
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required')
    .test(
      'not-same-as-current',
      'New password must be different from current password',
      function (value) {
        return value !== this.parent.currentPassword;
      },
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});
