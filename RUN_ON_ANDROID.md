# 📱 How to Run Social Connect on Android Studio

This guide walks you through running the React Native app on Android Studio (emulator or real device).

---

## ✅ Prerequisites

Before you start, install these on your computer:

### 1. Node.js (≥ 18)
Download from [nodejs.org](https://nodejs.org/) and install the LTS version.

Verify:
```bash
node --version    # should print v18.x or higher
npm --version
```

### 2. Java Development Kit (JDK 17)
React Native 0.74 requires JDK 17.

- **Recommended**: Install via [Adoptium / Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17)
- Or use Android Studio's bundled JDK (usually at `C:\Program Files\Android\Android Studio\jbr` on Windows)

Verify:
```bash
java -version    # should print 17.x.x
```

### 3. Android Studio
Download from [developer.android.com/studio](https://developer.android.com/studio).

During installation, make sure these components are checked:
- ✅ Android SDK
- ✅ Android SDK Platform
- ✅ Android Virtual Device (AVD)

### 4. Android SDK Configuration
After installing Android Studio:

1. Open Android Studio → **More Actions** → **SDK Manager**
2. Install **Android 14 (API 34)** or higher
3. Go to **SDK Tools** tab and install:
   - ✅ Android SDK Build-Tools (latest)
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM) — Windows/Linux only

### 5. Environment Variables

#### On Windows:
1. Search "Environment Variables" in Start menu
2. Add a new system variable:
   - **Name**: `ANDROID_HOME`
   - **Value**: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
3. Add to `Path`:
   - `%LOCALAPPDATA%\Android\Sdk\platform-tools`
   - `%LOCALAPPDATA%\Android\Sdk\emulator`

#### On macOS/Linux:
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk   # macOS
# OR
export ANDROID_HOME=$HOME/Android/Sdk            # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload:
```bash
source ~/.bashrc    # or: source ~/.zshrc
```

Verify:
```bash
adb --version      # should print Android Debug Bridge version
```

---

## 🚀 Running the App

### Step 1: Open the project folder
```bash
cd SocialConnect
```

### Step 2: Install dependencies
```bash
npm install
# OR (faster):
yarn install
```

> **Note**: If you see peer dependency warnings, run:
> ```bash
> npm install --legacy-peer-deps
> ```

### Step 3: Set up Firebase (REQUIRED)
The app uses Firebase for auth, database, and storage. You MUST create a Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Create project**
2. Add an **Android app** with package name: `com.socialconnect`
3. Download `google-services.json`
4. Place it in: `android/app/google-services.json`
5. Enable in Firebase Console:
   - **Authentication** → Sign-in method → **Email/Password**
   - **Cloud Firestore** → Create database (start in test mode)
   - **Storage** → Get started

See the main `README.md` for full Firebase setup + security rules.

### Step 4: Start an Android Emulator
1. Open Android Studio
2. Click **More Actions** → **Virtual Device Manager**
3. Click **Create Device** → pick **Pixel 7** (or similar)
4. Select a system image (recommend **API 34** / Android 14)
5. Click **Finish**, then ▶️ to start the emulator

Wait until the emulator fully boots and shows the Android home screen.

### Step 5: Start Metro bundler
Open a terminal in the project folder:
```bash
npm start
# OR:
npx react-native start
```

Keep this terminal running. You should see:
```
┌────────────────────────────────────────────────────────────────────────────┐
│ Metro waiting on http://localhost:8081
```

### Step 6: Build & run the app
Open a **new terminal** in the same folder:
```bash
npm run android
# OR:
npx react-native run-android
```

The first build takes **5-15 minutes** (downloads Gradle, compiles native code). Subsequent builds are much faster (30 sec - 2 min).

When successful, you'll see:
```
BUILD SUCCESSFUL in 3m 24s
info Installing the app...
info Launching app...
```

The Social Connect app will open on the emulator! 🎉

---

## 📲 Running on a Real Android Device

Instead of an emulator, you can run on your physical phone:

1. Enable **Developer Options** on your phone:
   - Go to **Settings → About phone**
   - Tap **Build number** 7 times
2. Enable **USB Debugging**:
   - Go to **Settings → System → Developer options**
   - Turn on **USB debugging**
3. Connect your phone via USB
4. Accept the "Allow USB debugging?" prompt on your phone
5. Verify connection:
   ```bash
   adb devices
   # Should show your device, e.g.:
   # List of devices attached
   # R5CT30XXXXX    device
   ```
6. Run the app:
   ```bash
   npm run android
   ```

---

## 🔄 Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler |
| `npm run android` | Build & run on Android (emulator or device) |
| `npm run ios` | Build & run on iOS (macOS only) |
| `npm run lint` | Check code for errors |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Clear Metro cache (fixes weird errors) |

---

## 🛠 Troubleshooting

### "Android SDK not found"
Make sure `ANDROID_HOME` is set correctly (see Environment Variables above).

### "Failed to install the app"
- Make sure the emulator is running
- Run `adb devices` to confirm it's connected
- Try: `cd android && ./gradlew clean && cd ..` then re-run

### "Unable to load script" / Metro connection error
- Make sure Metro is running (`npm start`)
- Press `r` inside the Metro terminal to reload
- Or press `R` twice inside the app (on emulator) to reload

### Gradle build fails with "OutOfMemoryError"
Edit `android/gradle.properties` and increase:
```
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

### App crashes immediately
- Check that Firebase `google-services.json` is in `android/app/`
- Verify Firebase project has Auth + Firestore + Storage enabled
- Check Firestore security rules aren't blocking access

### Build is very slow (first time)
This is normal — Gradle downloads many dependencies. Subsequent builds are 10x faster.

### Port 8081 already in use
```bash
# Find and kill the process
npx kill-port 8081
# OR
lsof -i :8081      # macOS/Linux
kill -9 <PID>
```

---

## ✅ Quick Checklist

Before asking for help, verify:
- [ ] Node.js ≥ 18 installed
- [ ] JDK 17 installed and `JAVA_HOME` set
- [ ] Android Studio installed with SDK
- [ ] `ANDROID_HOME` environment variable set
- [ ] `adb devices` shows your emulator/device
- [ ] Firebase project created + `google-services.json` in `android/app/`
- [ ] Ran `npm install` successfully
- [ ] Metro running (`npm start`)
- [ ] Ran `npm run android`

If all ✅, the app should build and launch. If you see the landing page with the gradient + logo, you're in! 🚀
