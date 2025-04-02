import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatPrice, calculateOrderTotals } from '../utils/calculations';

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

const OrderSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('credit_card');
  const [shippingOptions] = useState([
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 5.99,
      estimatedDays: '5-7',
      description: 'Regular delivery with tracking',
      icon: 'car-outline'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 12.99,
      estimatedDays: '2-3',
      description: 'Fast delivery with priority tracking',
      icon: 'flash-outline'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 24.99,
      estimatedDays: '1',
      description: 'Next day delivery',
      icon: 'rocket-outline'
    }
  ]);
  const [paymentMethods] = useState([
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: 'card-outline',
      description: 'Pay with Visa, Mastercard, or American Express',
      color: '#4CAF50'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'logo-paypal',
      description: 'Pay securely with your PayPal account',
      color: '#FFC107'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: 'business-outline',
      description: 'Direct bank transfer to our account',
      color: '#2196F3'
    }
  ]);

  // Calculate order totals using the utility function
  const { subtotal, tax, total, formattedSubtotal, formattedTax, formattedTotal } = calculateOrderTotals(cartItems);

  // Get selected shipping option
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);

  // Calculate final total including shipping
  const finalTotal = total + (selectedShippingOption?.price || 0);

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

  const formatItemPrice = (item) => {
    // Price is already a number from CartScreen processing
    return formatPrice(item.price * (item.quantity || 1));
  };

  const calculateTotal = () => {
    const shipping = shippingOptions.find(option => option.id === selectedShipping)?.price || 0;
    return (subtotal + shipping).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll just simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Clear the cart
      await AsyncStorage.setItem('cart', JSON.stringify([]));
      
      // Generate a random order ID (in a real app, this would come from the backend)
      const orderId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      
      // Get selected shipping option
      const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
      
      // Get selected payment method
      const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPayment);
      
      // Navigate to ReceiptScreen with order details
      navigation.navigate('Receipt', {
        orderDetails: {
          orderId,
          items: cartItems,
          subtotal,
          tax,
          total: finalTotal,
          shipping: selectedShippingOption,
          payment: selectedPaymentMethod
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image 
        source={getBookImage(item)}
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Summary</Text>
        </View>

        <View style={styles.mainContent}>
          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Image 
                    source={getBookImage(item)}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <Text style={styles.bookAuthor}>{item.author}</Text>
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                    <Text style={styles.price}>${item.price}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shipping Options</Text>
              {shippingOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.shippingOption,
                    selectedShipping === option.id && styles.selectedShipping
                  ]}
                  onPress={() => setSelectedShipping(option.id)}
                >
                  <View style={styles.shippingOptionHeader}>
                    <View style={styles.shippingOptionLeft}>
                      <Ionicons name={option.icon} size={24} color="#87CEEB" />
                      <View style={styles.shippingOptionInfo}>
                        <Text style={styles.shippingOptionName}>{option.name}</Text>
                        <Text style={styles.shippingOptionDescription}>{option.description}</Text>
                      </View>
                    </View>
                    <Text style={styles.shippingOptionPrice}>${option.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.shippingOptionDays}>
                    Estimated delivery: {option.estimatedDays} days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    selectedPayment === method.id && styles.selectedPayment
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <View style={styles.paymentOptionHeader}>
                    <View style={styles.paymentOptionLeft}>
                      <View style={[styles.paymentIconContainer, { backgroundColor: method.color + '20' }]}>
                        <Ionicons name={method.icon} size={24} color={method.color} />
                      </View>
                      <View style={styles.paymentOptionInfo}>
                        <Text style={styles.paymentOptionName}>{method.name}</Text>
                        <Text style={styles.paymentOptionDescription}>{method.description}</Text>
                      </View>
                    </View>
                    {selectedPayment === method.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#87CEEB" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Total</Text>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalAmount}>{formattedSubtotal}</Text>
              </View>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Tax (10%):</Text>
                <Text style={styles.totalAmount}>{formattedTax}</Text>
              </View>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Shipping:</Text>
                <Text style={styles.totalAmount}>${selectedShippingOption?.price.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={[styles.totalContainer, styles.finalTotal]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>${finalTotal.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
              onPress={handlePlaceOrder}
              disabled={isProcessing}
            >
              <Text style={styles.placeOrderButtonText}>
                {isProcessing ? 'Processing...' : `Pay with ${paymentMethods.find(m => m.id === selectedPayment)?.name}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#87CEEB',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 50,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shippingOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedShipping: {
    backgroundColor: '#e3f2fd',
    borderColor: '#87CEEB',
  },
  shippingOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shippingOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shippingOptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  shippingOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  shippingOptionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  shippingOptionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#87CEEB',
  },
  shippingOptionDays: {
    fontSize: 14,
    color: '#666',
    marginLeft: 36,
  },
  paymentOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedPayment: {
    backgroundColor: '#e3f2fd',
    borderColor: '#87CEEB',
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default OrderSummaryScreen;