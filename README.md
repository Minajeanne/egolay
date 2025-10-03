# Egolay Mobile App

Egolay is a personalized book recommendation mobile app that suggests books based on user interests, previous reads, mood, age, and other personalized features, while connecting readers with local independent bookstores for purchases.

## Features

- **Personalized Recommendations**: Smart book suggestions based on your profile, reading history, and current mood
- **Multi-Factor Authentication**: Secure your account with TOTP-based 2FA
- **Local Bookstore Integration**: Find and support independent bookstores in your area
- **Reading History**: Track books you've read and maintain a wishlist
- **Dynamic Theming**: 7 beautiful themes optimized for different reading moods
- **Cross-Platform**: Works on both iOS and Android

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend services (auth, database, edge functions)
- **React Navigation** for navigation
- **Expo Vector Icons** for consistent iconography

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Use the Expo Go app on your phone or run in a simulator:
   - For iOS: Press `i` to open in iOS Simulator
   - For Android: Press `a` to open in Android Emulator
   - For web: Press `w` to open in web browser

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookCard.tsx    # Book display component
│   ├── TabBarIcon.tsx  # Icon component wrapper
│   ├── ThemeSelector.tsx # Theme selection component
│   └── MFAModal.tsx    # Multi-factor auth setup
├── screens/            # Main app screens
│   ├── AuthScreen.tsx  # Login/signup
│   ├── BookRecommendationsScreen.tsx
│   ├── UserProfileScreen.tsx
│   ├── BookstoreLocatorScreen.tsx
│   ├── ReadingHistoryScreen.tsx
│   └── LoadingScreen.tsx
├── utils/              # Utility functions
│   ├── theme.tsx       # Theme system
│   └── supabase/       # Backend integration
└── App.tsx             # Main app component
```

## Backend

The app uses Supabase for:
- User authentication with MFA support
- User profiles and preferences storage
- Reading history and wishlist management
- Book recommendations engine
- Local bookstore directory

## Themes

Egolay includes 7 carefully crafted themes:
- **Light**: Clean and bright
- **Dark**: Easy on the eyes
- **Warm & Cozy**: For comfort reading
- **Nature**: For mindful reading
- **Ocean**: For deep focus reading
- **Sunset**: For evening reading
- **Minimal**: Distraction-free reading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.