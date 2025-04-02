import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ReviewsScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      review: 'Great book! The condition was perfect.',
      pros: 'Fast delivery, good condition',
      cons: 'None',
      date: '2024-03-15',
      images: [],
    },
    // Add more sample reviews as needed
  ]);

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!review.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      user: 'Current User', // Replace with actual user name
      rating,
      review,
      pros,
      cons,
      date: new Date().toISOString().split('T')[0],
      images: [],
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setReview('');
    setPros('');
    setCons('');
    setShowReviewForm(false);

    Alert.alert('Success', 'Your review has been submitted!');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={20}
        color="#FFD700"
      />
    ));
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{book.title}</Text>
      </View>

      <ScrollView style={styles.container}>
        <TouchableOpacity 
          style={styles.writeReviewButton}
          onPress={() => setShowReviewForm(true)}
        >
          <LinearGradient
            colors={['#87CEEB', '#4A90E2']}
            style={styles.writeReviewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.writeReviewContent}>
              <View style={styles.writeReviewIconContainer}>
                <Ionicons name="pencil" size={28} color="#fff" />
              </View>
              <View style={styles.writeReviewTextContainer}>
                <Text style={styles.writeReviewButtonText}>Write a Review</Text>
                <Text style={styles.writeReviewSubText}>Share your thoughts about this book</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {showReviewForm && (
          <View style={styles.reviewForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Share Your Experience</Text>
              <TouchableOpacity 
                onPress={() => setShowReviewForm(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>How would you rate this book?</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={32}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {rating === 0 ? 'Select a rating' : `${rating} ${rating === 1 ? 'star' : 'stars'}`}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Review</Text>
              <TextInput
                style={[styles.input, styles.reviewInput]}
                placeholder="Share your thoughts about this book..."
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={4}
                placeholderTextColor="#666"
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>What did you like?</Text>
              <TextInput
                style={[styles.input, styles.prosInput]}
                placeholder="Share the highlights of your experience..."
                value={pros}
                onChangeText={setPros}
                multiline
                numberOfLines={2}
                placeholderTextColor="#666"
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>What could be improved?</Text>
              <TextInput
                style={[styles.input, styles.consInput]}
                placeholder="Share your suggestions for improvement..."
                value={cons}
                onChangeText={setCons}
                multiline
                numberOfLines={2}
                placeholderTextColor="#666"
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
                <Ionicons name="send-outline" size={20} color="#fff" style={styles.submitIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.reviewsList}>
          <Text style={styles.reviewsTitle}>All Reviews</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.user.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{review.user}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.starsContainer}>
                  {renderStars(review.rating)}
                </View>
              </View>
              
              <Text style={styles.reviewText}>{review.review}</Text>
              
              {review.pros && (
                <View style={styles.prosContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.prosText}>{review.pros}</Text>
                </View>
              )}
              
              {review.cons && (
                <View style={styles.consContainer}>
                  <Ionicons name="close-circle" size={16} color="#F44336" />
                  <Text style={styles.consText}>{review.cons}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  writeReviewButton: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  writeReviewGradient: {
    padding: 16,
  },
  writeReviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  writeReviewIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeReviewTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  writeReviewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  writeReviewSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  reviewForm: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reviewInput: {
    height: 120,
  },
  prosInput: {
    height: 80,
  },
  consInput: {
    height: 80,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitIcon: {
    marginLeft: 8,
  },
  reviewsList: {
    padding: 16,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  prosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  prosText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: 8,
    flex: 1,
  },
  consContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
  },
  consText: {
    fontSize: 14,
    color: '#C62828',
    marginLeft: 8,
    flex: 1,
  },
});

export default ReviewsScreen; 