import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ExchangeHistoryScreen = ({ navigation }) => {
  // TODO: Replace with actual data from your backend
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      bookTitle: 'Sample Book 1',
      author: 'Author 1',
      price: '299',
      image: 'https://via.placeholder.com/150',
      date: '2024-03-15',
      status: 'completed',
      seller: 'John Doe'
    },
    {
      id: '2',
      bookTitle: 'Sample Book 2',
      author: 'Author 2',
      price: '399',
      image: 'https://via.placeholder.com/150',
      date: '2024-03-14',
      status: 'completed',
      seller: 'Jane Smith'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTransactionItem = ({ item }) => (
    <Surface style={styles.transactionCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.transactionInfo}>
        <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.sellerInfo}>Seller: {item.seller}</Text>
        <View style={styles.transactionDetails}>
          <Text style={styles.price}>฿{item.price}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons 
            name={item.status === 'completed' ? 'checkmark-circle' : 
                  item.status === 'pending' ? 'time' : 'close-circle'} 
            size={14} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </Surface>
  );

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Exchange History</Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  bookImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sellerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#87CEEB',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ExchangeHistoryScreen; 