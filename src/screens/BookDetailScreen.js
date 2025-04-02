import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPrice } from '../utils/calculations';

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

const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Inappropriate Content' },
  { id: 'copyright', label: 'Copyright Violation' },
  { id: 'spam', label: 'Spam or Misleading' },
  { id: 'quality', label: 'Poor Quality' },
  { id: 'fake', label: 'Fake or Counterfeit Book' },
  { id: 'damaged', label: 'Damaged or Defective' },
  { id: 'wrong_book', label: 'Wrong Book Listed' },
  { id: 'price_issue', label: 'Price Issue' },
  { id: 'seller_issue', label: 'Seller Issue' },
  { id: 'description_mismatch', label: 'Description Mismatch' },
  { id: 'out_of_stock', label: 'Out of Stock' },
  { id: 'other', label: 'Other' }
];

const BookDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Ensure book price is a number, handling both string and number inputs
  const bookPrice = typeof book.price === 'string' 
    ? parseFloat(book.price.replace(/[^0-9.-]+/g, '')) || 0
    : book.price || 0;

  useEffect(() => {
    checkFavoriteStatus();
    checkCartStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.some(fav => fav.id === book.id));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const checkCartStatus = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        const cartArray = JSON.parse(cart);
        const cartItem = cartArray.find(item => item.id === book.id);
        setIsInCart(!!cartItem);
        if (cartItem) {
          setQuantity(cartItem.quantity);
        }
      }
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoritesArray = favoritesArray.filter(fav => fav.id !== book.id);
      } else {
        favoritesArray.push(book);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const addToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartArray = cart ? JSON.parse(cart) : [];

      const existingItem = cartArray.find(item => item.id === book.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartArray.push({ ...book, quantity });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cartArray));
      setIsInCart(true);
      Alert.alert('Success', 'Book added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add book to cart');
    }
  };

  const removeFromCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        const cartArray = JSON.parse(cart);
        const updatedCart = cartArray.filter(item => item.id !== book.id);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setIsInCart(false);
        Alert.alert('Success', 'Book removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove book from cart');
    }
  };

  // Get the book image based on whether it's a posted book or static book
  const getBookImage = () => {
    if (book.image) {
      return { uri: book.image };
    }
    return bookImages[book.title] || require('../../assets/icon.png');
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    try {
      // Here you would typically send the report to your backend
      // For now, we'll just show a success message
      Alert.alert(
        'Success',
        'Thank you for your report. We will review it shortly.',
        [{ text: 'OK', onPress: () => {
          setShowReportModal(false);
          setSelectedReason('');
          setAdditionalDetails('');
        }}]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={handleReport}
            >
              <Ionicons name="flag-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#ff6b6b" : "#333"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <Image 
              source={getBookImage()}
              style={styles.bookImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.author}</Text>
            <Text style={styles.category}>{book.category}</Text>
            <Text style={styles.price}>{formatPrice(bookPrice)}</Text>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Ionicons name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.cartButton, isInCart && styles.removeFromCartButton]}
              onPress={isInCart ? removeFromCart : addToCart}
            >
              <Text style={styles.cartButtonText}>
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          </View>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              <TouchableOpacity 
                style={styles.writeReviewButton}
                onPress={() => navigation.navigate('Reviews', { book })}
              >
                <Ionicons name="pencil" size={20} color="#87CEEB" />
                <Text style={styles.writeReviewText}>Write Review</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewSummary}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingNumber}>4.5</Text>
                <View style={styles.starsContainer}>
                  {renderStars(4.5)}
                </View>
                <Text style={styles.reviewCount}>12 reviews</Text>
              </View>
              <View style={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <View key={star} style={styles.ratingBar}>
                    <Text style={styles.starLabel}>{star}</Text>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { width: `${star * 20}%` }]} />
                    </View>
                    <Text style={styles.barCount}>{star * 2}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.recentReviews}>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>J</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>John Doe</Text>
                      <View style={styles.starsContainer}>
                        {renderStars(5)}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>2 days ago</Text>
                </View>
                <Text style={styles.reviewText}>
                  Great book! The condition was perfect and delivery was fast.
                </Text>
              </View>

              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>S</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>Sarah Smith</Text>
                      <View style={styles.starsContainer}>
                        {renderStars(4)}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>1 week ago</Text>
                </View>
                <Text style={styles.reviewText}>
                  Good condition, but delivery took a bit longer than expected.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={showReportModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report Book</Text>
              <Text style={styles.modalSubtitle}>Please select a reason for reporting this book:</Text>
              
              <ScrollView style={styles.reasonsContainer}>
                {REPORT_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason.id}
                    style={[
                      styles.reasonButton,
                      selectedReason === reason.id && styles.selectedReason
                    ]}
                    onPress={() => setSelectedReason(reason.id)}
                  >
                    <Text style={[
                      styles.reasonText,
                      selectedReason === reason.id && styles.selectedReasonText
                    ]}>
                      {reason.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.modalSubtitle}>Additional Details (Optional):</Text>
              <TextInput
                style={styles.reportInput}
                multiline
                numberOfLines={3}
                placeholder="Provide any additional details about your report..."
                value={additionalDetails}
                onChangeText={setAdditionalDetails}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowReportModal(false);
                    setSelectedReason('');
                    setAdditionalDetails('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={submitReport}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookImage: {
    width: 250,
    height: 350,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#87CEEB',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  removeFromCartButton: {
    backgroundColor: '#ff6b6b',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  reasonsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  reasonButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedReason: {
    backgroundColor: '#87CEEB',
    borderColor: '#87CEEB',
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedReasonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#ff6b6b',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  reviewsSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  writeReviewText: {
    color: '#87CEEB',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewSummary: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  ratingBars: {
    flex: 1,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starLabel: {
    width: 20,
    fontSize: 14,
    color: '#666',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  barCount: {
    width: 24,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  recentReviews: {
    marginTop: 16,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default BookDetailScreen; 