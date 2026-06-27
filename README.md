# Social Connect

A modern social connect mobile app built with **React Native CLI**, **Firebase**, and the **React Context API**. Designed as an internship-grade task that exercises authentication, navigation, real-time data, push notifications, animations, and responsive UI.

> Modern social design — indigo-to-violet gradient (`#6366F1 → #8B5CF6`), rounded cards, soft shadows, system fonts.

---

## ✨ Features

### Core
- **Authentication** — Sign Up, Login, Forgot Password (Firebase Auth)
  - Form validation with **Formik** + **Yup**
  - Friendly, mapped error messages
- **Navigation** — React Navigation v6 (Stack + Bottom Tabs)
  - Auth Stack: Login → SignUp → ForgotPassword
  - Main Tabs: Home (feed) | Profile
  - Nested Home Stack: Feed → CreatePost → Comments → UserProfile
  - Nested Profile Stack: Profile → ProfileEdit → Settings
- **User Profile** — create / edit displayName, bio, profile picture
  - Image picker (camera + gallery) via `react-native-image-picker`
- **Post Management**
  - Create text-based posts with optional image
  - Posts persisted to Firebase Firestore (with Storage for images)
  - FlatList feed with timestamps
  - Pull-to-refresh
- **Like & Comment System**
  - Atomic like toggles using Firestore transactions
  - Inline comment modal AND a full-screen comments screen
  - Own-comment deletion
- **User Profiles** — view other users by tapping their name in the feed
- **State Management** — React Context API
  - `AuthContext` — auth state + current user's Firestore profile
  - `PostsContext` — global real-time feed + like/create actions
  - `ThemeContext` — design tokens (light mode now, dark mode ready)

### Advanced
- **Notifications** — Firebase Cloud Messaging + Notifee
  - Foreground + background message handlers
  - Android notification channel
  - FCM token persisted to user doc for server-side targeting
- **Real-time Updates** — Firestore `onSnapshot` listeners
  - Posts, comments, and user profile all update live
  - Optimistic local updates for likes (instant UX)
- **UI & Animations**
  - `react-native-reanimated` spring animations on like button (bounce + rotate)
  - Linear gradient hero on login + FAB
  - `react-native-responsive-fontsize` for cross-device text scaling
- **Polishing**
  - Safe area aware layouts
  - KeyboardAvoidingView on all forms
  - Empty states + loading spinners everywhere
  - Error boundaries-friendly structure
  - ESLint + Prettier pre-configured

---

## 📁 Project Structure

```
SocialConnect/
├── index.js
├── app.json
├── babel.config.js
├── metro.config.js
├── .eslintrc.js
├── .prettierrc.js
├── .gitignore
├── package.json
├── firebase.config.example.js
├── README.md
└── src/
    ├── App.js
    ├── api/
    │   ├── firebase.js          # Firebase init + collection refs
    │   ├── auth.js              # Sign in/up/out + error mapping
    │   ├── posts.js             # CRUD + onSnapshot real-time
    │   ├── comments.js          # Subcollection + transaction count
    │   ├── users.js             # Profile CRUD + FCM token mgmt
    │   └── notifications.js     # FCM + Notifee setup
    ├── components/
    │   ├── Avatar.js            # Photo or gradient-initials fallback
    │   ├── CommentItem.js
    │   ├── CommentModal.js      # Bottom sheet with live comments
    │   ├── EmptyState.js
    │   ├── FormTextInput.js     # Formik-friendly labeled input
    │   ├── GradientButton.js    # Brand gradient CTA
    │   ├── LikeButton.js        # Reanimated bounce + rotation
    │   ├── LoadingSpinner.js
    │   └── PostCard.js
    ├── contexts/
    │   ├── AuthContext.js
    │   ├── PostsContext.js
    │   └── ThemeContext.js
    ├── navigation/
    │   ├── AppNavigator.js      # Root switch (Auth ↔ Main)
    │   ├── AuthNavigator.js
    │   ├── HomeStack.js
    │   ├── ProfileStack.js
    │   └── MainTabs.js
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js
    │   │   ├── SignUpScreen.js
    │   │   └── ForgotPasswordScreen.js
    │   ├── HomeScreen.js
    │   ├── CreatePostScreen.js
    │   ├── CommentsScreen.js
    │   ├── ProfileScreen.js
    │   ├── ProfileEditScreen.js
    │   ├── SettingsScreen.js
    │   └── UserProfileScreen.js
    ├── theme/
    │   ├── colors.js
    │   ├── spacing.js
    │   ├── typography.js
    │   └── index.js
    └── utils/
        ├── validation.js        # Yup schemas
        ├── time.js              # timeAgo formatter
        ├── imagePicker.js       # Camera/gallery helpers
        └── string.js            # getInitials, colorFromString
```

---

## 🚀 Setup

### 1. Prerequisites
- Node.js ≥ 18
- For Android: Android Studio + JDK 17
- For iOS: macOS + Xcode 15+ + CocoaPods
- A Firebase project (free tier is fine)

### 2. Install dependencies

```bash
cd SocialConnect
yarn install      # or: npm install
```

For iOS:
```bash
cd ios && pod install && cd ..
```

### 3. Configure Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) → create a project.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Create a **Cloud Firestore** database (start in production or test mode).
4. Enable **Storage** (default rules are fine for development).
5. Register an Android app and an iOS app:
   - **Android**: download `google-services.json` and place it in `android/app/`
   - **iOS**: download `GoogleService-Info.plist` and place it in `ios/SocialConnect/`
6. (Optional) For push notifications on iOS, upload your APNs auth key in Project Settings → Cloud Messaging.

> The app reads Firebase config from the native JSON/plist files, not a JS config object. The `firebase.config.example.js` file is just documentation.

### 4. Firestore Security Rules (recommended starting point)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any profile, but only edit their own.
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Posts: any signed-in user can read; only the author can write/delete.
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.authorId;
      allow update, delete: if request.auth.uid == resource.data.authorId;

      // Likes: anyone signed in can toggle the like array, but only that.
      // (Stricter rules can validate the diff to only allow like changes.)

      // Comments: subcollection
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth.uid == request.resource.data.authorId;
        allow delete: if request.auth.uid == resource.data.authorId;
      }
    }
  }
}
```

### 5. Run the app

```bash
# Start Metro
yarn start

# In another terminal:
yarn android    # or: yarn ios
```

---

## 🔔 Push Notifications (Server Side)

The app registers FCM tokens and persists them to `users/{uid}.fcmTokens[]`. To actually send notifications when someone likes or comments, deploy a Firebase Cloud Function. Example trigger for new comments:

```js
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.notifyOnComment = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snap, ctx) => {
    const comment = snap.data();
    const postSnap = await admin.firestore().doc(`posts/${ctx.params.postId}`).get();
    const post = postSnap.data();
    if (!post || post.authorId === comment.authorId) {
      return; // don't notify yourself
    }
    const userSnap = await admin.firestore().doc(`users/${post.authorId}`).get();
    const user = userSnap.data();
    const tokens = user?.fcmTokens || [];
    if (tokens.length === 0) {
      return;
    }
    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title: `${comment.authorName} commented on your post`,
        body: comment.content,
      },
      data: {postId: ctx.params.postId},
    });
  });
```

Deploy with:
```bash
cd functions
npm install
firebase deploy --only functions
```

---

## 🎨 Design System

| Token | Value |
|------|-------|
| Primary | `#6366F1` (Indigo) |
| Secondary | `#8B5CF6` (Violet) |
| Accent | `#EC4899` (Pink) |
| Background | `#F8F9FE` |
| Surface | `#FFFFFF` |
| Text | `#0F172A` |
| Text Muted | `#94A3B8` |
| Error | `#EF4444` |
| Like | `#EF4444` |
| Gradient | `['#6366F1', '#8B5CF6']` |

Typography uses the system font with `react-native-responsive-fontsize` (RFValue) for cross-device scaling.

---

## 🧪 Linting & Formatting

```bash
yarn lint          # run ESLint
yarn lint:fix      # auto-fix lint issues
yarn format        # run Prettier
```

---

## 🛠 Tech Stack

- **React Native** 0.74 (CLI, not Expo)
- **React Navigation** v6 (Stack + Bottom Tabs)
- **Firebase** v20 modular SDK
  - Authentication
  - Cloud Firestore (with persistence + real-time listeners)
  - Cloud Storage (for post images + avatars)
  - Cloud Messaging (push notifications)
- **Notifee** for local notification rendering
- **React Context API** for state management
- **Formik** + **Yup** for forms and validation
- **react-native-reanimated** for animations
- **react-native-image-picker** for media selection
- **react-native-permissions** for runtime permissions
- **react-native-responsive-fontsize** for responsive typography
- **react-native-linear-gradient** for brand gradients
- **react-native-vector-icons** (MaterialCommunityIcons)
- **ESLint** + **Prettier** for code quality

---

## 📦 What Interns Can Extend

1. **Dark mode** — `ThemeContext` already has a `mode` field; add a `darkColors` palette and a switch in Settings.
2. **Follow / unfollow** — new `follows` collection + filtered feed query.
3. **Direct messages** — subcollection under `chats/{chatId}/messages`.
4. **Stories** — 24h TTL posts with image-only.
5. **Search** — Algolia or Firestore `where` queries on `displayName`.
6. **Image moderation** — Firebase Functions + Cloud Vision API.
7. **Offline queue** — already get free Firestore offline cache; add explicit retry UI for failed posts.

---

## 📝 License

MIT — free to use, modify, and learn from. Built for the Social Connect internship task.
