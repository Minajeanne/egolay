import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

// Import screens
import { BookRecommendationsScreen } from './src/screens/BookRecommendationsScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { BookstoreLocatorScreen } from './src/screens/BookstoreLocatorScreen';
import { ReadingHistoryScreen } from './src/screens/ReadingHistoryScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';

// Import utilities
import { EgolayAPI, supabase } from './src/utils/supabase/client';
import { ThemeProvider, useTheme } from './src/utils/theme';
import { TabBarIcon } from './src/components/TabBarIcon';

export interface UserProfile {
  name: string;
  age: number;
  readingLevel: string;
  preferredLength: number;
  favoriteGenres: string[];
  currentMoods: string[];
  favoriteAuthors: string;
  recentFavorite: string;
  lookingFor: string;
  theme?: string;
}

export interface ReadBook {
  id: string;
  title: string;
  author: string;
  genre: string[];
  rating: number;
  myRating?: number;
  dateRead: string;
  review?: string;
  coverUrl: string;
}

const Tab = createBottomTabNavigator();

const prefix = Linking.createURL('/');

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [readBooks, setReadBooks] = useState<ReadBook[]>([]);
  const { theme } = useTheme();
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    age: 0,
    readingLevel: "",
    preferredLength: 250,
    favoriteGenres: [],
    currentMoods: [],
    favoriteAuthors: "",
    recentFavorite: "",
    lookingFor: "",
    theme: "default"
  });

  // Check for existing session on app load
  useEffect(() => {
    checkUserSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          resetUserData();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserSession = async () => {
    try {
      const session = await EgolayAPI.getCurrentSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserData();
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      // Load user profile
      const profileResponse = await EgolayAPI.getProfile();
      if (profileResponse.profile) {
        setUserProfile(profileResponse.profile);
      }

      // Load wishlist
      const wishlistResponse = await EgolayAPI.getWishlist();
      if (wishlistResponse.wishlist) {
        setWishlist(wishlistResponse.wishlist.map((item: any) => item.id));
      }

      // Load reading history
      const historyResponse = await EgolayAPI.getReadingHistory();
      if (historyResponse.readingHistory) {
        setReadBooks(historyResponse.readingHistory);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const resetUserData = () => {
    setUserProfile({
      name: "",
      age: 0,
      readingLevel: "",
      preferredLength: 250,
      favoriteGenres: [],
      currentMoods: [],
      favoriteAuthors: "",
      recentFavorite: "",
      lookingFor: "",
      theme: "default"
    });
    setWishlist([]);
    setReadBooks([]);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticating(false);
    // User data will be loaded automatically via auth state change listener
  };

  const handleSignOut = async () => {
    try {
      await EgolayAPI.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleAddToWishlist = async (bookId: string, bookData?: any) => {
    try {
      if (!wishlist.includes(bookId)) {
        await EgolayAPI.addToWishlist(bookId, bookData);
        setWishlist([...wishlist, bookId]);
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      await EgolayAPI.removeFromWishlist(bookId);
      setWishlist(wishlist.filter(id => id !== bookId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleMarkAsRead = async (bookId: string, bookData?: any) => {
    try {
      if (bookData) {
        await EgolayAPI.addToReadingHistory(bookData);
        setReadBooks([...readBooks, bookData]);
      }
      handleRemoveFromWishlist(bookId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <TabBarIcon 
                name={getTabIconName(route.name)} 
                focused={focused} 
                color={color}
                size={size}
              />
            ),
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.muted,
            tabBarStyle: {
              backgroundColor: theme.colors.card,
              borderTopColor: theme.colors.border,
            },
            headerStyle: {
              backgroundColor: theme.colors.card,
              borderBottomColor: theme.colors.border,
            },
            headerTintColor: theme.colors.foreground,
            headerTitleStyle: {
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen 
            name="Recommendations" 
            options={{ title: 'For You' }}
          >
            {() => (
              <BookRecommendationsScreen
                userProfile={userProfile}
                onAddToWishlist={handleAddToWishlist}
                onMarkAsRead={handleMarkAsRead}
                wishlist={wishlist}
              />
            )}
          </Tab.Screen>
          <Tab.Screen 
            name="Profile"
            options={{ title: 'Profile' }}
          >
            {() => (
              <UserProfileScreen
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
                onSignOut={handleSignOut}
              />
            )}
          </Tab.Screen>
          <Tab.Screen 
            name="Bookstores"
            options={{ title: 'Local Stores' }}
          >
            {() => <BookstoreLocatorScreen />}
          </Tab.Screen>
          <Tab.Screen 
            name="History"
            options={{ title: 'My Books' }}
          >
            {() => (
              <ReadingHistoryScreen
                readBooks={readBooks}
                wishlist={wishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

function getTabIconName(routeName: string): string {
  switch (routeName) {
    case 'Recommendations':
      return 'library';
    case 'Profile':
      return 'user';
    case 'Bookstores':
      return 'map-pin';
    case 'History':
      return 'book-open';
    default:
      return 'home';
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});