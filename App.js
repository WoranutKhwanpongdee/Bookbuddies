import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { BookProvider } from './src/context/BookContext';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BookProvider>
          <CartProvider>
            <FavoritesProvider>
              <AppNavigator />
            </FavoritesProvider>
          </CartProvider>
        </BookProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}