import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { calculateTotalPrice, formatPrice, calculateOrderTotals } from '../utils/calculations';

// Static mapping of book titles to their image assets
const bookImages = {
  'The Midnight Library': require('../../assets/The Midnight Library.png'),
  'The Seven Husbands of Evelyn Hugo': require('../../assets/The Seven Husbands of Evelyn Hugo.png'),
  'Atomic Habits': require('../../assets/Atomic Habits.png'),
  'Sapiens': require('../../assets/Sapiens.png'),
  'A Brief History of Time': require('../../assets/A Brief History of Time.png'),
  'The Elegant Universe': require('../../assets/The Elegant Universe.png'),
  'Clean Code': require('../../assets/Clean Code.png'),
  'The Pragmatic Programmer': require('../../assets/The Pragmatic Programmer.png'),
  'The Story of Art': require('../../assets/The Story of Art.png'),
  'Ways of Seeing': require('../../assets/Ways of Seeing.png'),
  'Good to Great': require('../../assets/Good to Great.png'),
  'Zero to One': require('../../assets/Zero to One.png'),
};

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        // Ensure all prices are numbers and handle currency symbols
        const processedItems = items.map(item => ({
          ...item,
          price: typeof item.price === 'string' 
            ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) || 0
            : parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1
        }));
        setCartItems(processedItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== bookId);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      Alert.alert('Success', 'Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checking out.');
      return;
    }
    // Pass only the processed cart items
    navigation.navigate('OrderSummary', { cartItems });
  };

  const getBookImage = (book) => {
    // For posted books, use the image URL if available
    if (book.isPosted && book.image) {
      return { uri: book.image };
    }
    
    // For static books, use the mapping
    const localImage = bookImages[book.title];
    if (localImage) {
      return localImage;
    }
    
    // Fallback to app icon
    return require('../../assets/icon.png');
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>
        <Image 
          source={getBookImage(item)}
          style={styles.bookImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemTotal}>Total: {formatPrice(item.price * item.quantity)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  const orderTotals = calculateOrderTotals(cartItems);

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Shopping Cart</Text>
        {!cartItems || cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
            />
            <View style={styles.footer}>
              <View style={styles.totalsContainer}>
                <Text style={styles.subtotalText}>Subtotal: {orderTotals.formattedSubtotal}</Text>
                <Text style={styles.taxText}>Tax (10%): {orderTotals.formattedTax}</Text>
                <Text style={styles.totalText}>Total: {orderTotals.formattedTotal}</Text>
              </View>
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  imageContainer: {
    width: 80,
    height: 120,
    marginRight: 15,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookPrice: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  totalsContainer: {
    marginBottom: 16,
  },
  subtotalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginBottom: 4,
  },
  taxText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#87CEEB',
  },
  checkoutButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTotal: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default CartScreen;