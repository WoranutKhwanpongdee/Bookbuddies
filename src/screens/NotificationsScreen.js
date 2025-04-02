import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order for "The Midnight Library" has been confirmed',
    time: '2 hours ago',
    read: false,
    icon: 'cart',
    color: '#87CEEB',
  },
  {
    id: '2',
    type: 'discount',
    title: 'Special Offer',
    message: 'Get 20% off on all Science books this weekend!',
    time: '5 hours ago',
    read: false,
    icon: 'pricetag',
    color: '#FF6B6B',
  },
  {
    id: '3',
    type: 'new',
    title: 'New Arrival',
    message: 'Check out our latest book: "The Pragmatic Programmer"',
    time: '1 day ago',
    read: true,
    icon: 'book',
    color: '#4CAF50',
  },
  {
    id: '4',
    type: 'review',
    title: 'Review Request',
    message: 'How was your experience with "Atomic Habits"?',
    time: '2 days ago',
    read: true,
    icon: 'star',
    color: '#FFD700',
  },
  {
    id: '5',
    type: 'shipping',
    title: 'Shipping Update',
    message: 'Your order is on the way! Expected delivery: Tomorrow',
    time: '3 days ago',
    read: true,
    icon: 'car',
    color: '#9C27B0',
  },
];

const NotificationItem = ({ item, onPress }) => (
  <TouchableOpacity 
    style={[styles.notificationItem, !item.read && styles.unreadNotification]}
    onPress={onPress}
  >
    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
      <Ionicons name={item.icon} size={24} color="#fff" />
    </View>
    <View style={styles.notificationContent}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
  </TouchableOpacity>
);

const NotificationsScreen = () => {
  const navigation = useNavigation();

  const handleNotificationPress = (notification) => {
    // Handle different notification types
    switch (notification.type) {
      case 'order':
        navigation.navigate('OrderSummary');
        break;
      case 'discount':
        navigation.navigate('Explore');
        break;
      case 'new':
        navigation.navigate('BookDetail', { 
          book: { title: 'The Pragmatic Programmer' }
        });
        break;
      case 'review':
        navigation.navigate('BookDetail', { 
          book: { title: 'Atomic Habits' }
        });
        break;
      case 'shipping':
        navigation.navigate('OrderSummary');
        break;
      default:
        break;
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={mockNotifications}
        renderItem={({ item }) => (
          <NotificationItem 
            item={item} 
            onPress={() => handleNotificationPress(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
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
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadNotification: {
    backgroundColor: '#F0F9FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NotificationsScreen; 