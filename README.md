# CarbonHub Mobile

A modern mobile application built with React Native and Expo, designed to help users track and manage their carbon footprint while promoting sustainable living practices.

## 🚀 Features

- Modern and intuitive user interface
- Dark mode support
- Responsive design
- Cross-platform compatibility (iOS & Android)

## 🛠️ Tech Stack

### Core Technologies
- [React Native](https://reactnative.dev/) - Mobile app framework
- [Expo](https://expo.dev/) - Development platform and build tools
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

### UI & Styling
- [Gluestack UI](https://gluestack.io/) - Modern UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [Expo Vector Icons](https://icons.expo.fyi/) - Icon library

### Navigation & Routing
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [React Native Screens](https://github.com/software-mansion/react-native-screens) - Native navigation container

### State Management & Storage
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Local storage solution

### Animation & Gestures
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animation library
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Gesture system
- [Legend Motion](https://legendapp.com/motion/) - Animation utilities

## 📱 Getting Started

### Prerequisites
- Node.js (LTS version)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd carbonhub-mobile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
```bash
# For iOS
npm run ios
# For Android
npm run android
```

## 🌙 Dark Mode

The application supports system-based dark mode. You can run the app with dark mode enabled using:
```bash
# iOS
DARK_MODE=media npm run ios
# Android
DARK_MODE=media npm run android
```

## 📦 Project Structure

```
carbonhub-mobile/
├── app/              # Main application screens and routing
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── lib/            # Utility functions and shared logic
└── ...
```