import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import BookListingScreen from '../screens/BookListingScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContactScreen from '../screens/ContactScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CategoryBooksScreen from '../screens/CategoryBooksScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import VerifyAccountScreen from '../screens/VerifyAccountScreen';
import PostBookScreen from '../screens/PostBookScreen';
import BookManagementScreen from '../screens/BookManagementScreen';
import ExchangeHistoryScreen from '../screens/ExchangeHistoryScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import ReceiptScreen from '../screens/ReceiptScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="BookListing" component={BookListingScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
    <Stack.Screen name="Receipt" component={ReceiptScreen} />
    <Stack.Screen name="Reviews" component={ReviewsScreen} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ExploreScreen" 
      component={ExploreScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="CategoryBooks" 
      component={CategoryBooksScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="BookDetail" 
      component={BookDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Contact') {
            iconName = focused ? 'mail' : 'mail-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#87CEEB',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: [{ translateX: 20 }],
          width: 360,
          borderRadius: 20,
          height: 60,
          backgroundColor: '#fff',
          paddingBottom: 5,
          paddingTop: 5,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          borderWidth: 1,
          borderColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (routeName === 'OrderSummary') {
            return { display: 'none' };
          }
          return {
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: [{ translateX: 20 }],
            width: 360,
            borderRadius: 20,
            height: 60,
            backgroundColor: '#fff',
            paddingBottom: 5,
            paddingTop: 5,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            borderWidth: 1,
            borderColor: '#e0e0e0',
          };
        })(route),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          unmountOnBlur: true,
          tabBarButton: props => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                {...props}
                onPress={() => navigation.navigate('Home', { screen: 'HomeScreen' })}
              />
            );
          }
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreStack}
      />
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen 
            name="VerifyAccount" 
            component={VerifyAccountScreen}
            options={{
              tabBarStyle: { display: 'none' }
            }}
          />
          <Stack.Screen name="PostBook" component={PostBookScreen} />
          <Stack.Screen name="BookManagement" component={BookManagementScreen} />
          <Stack.Screen name="ExchangeHistory" component={ExchangeHistoryScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 