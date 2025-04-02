import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Button, Surface, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBook } from '../context/BookContext';

const BookManagementScreen = ({ navigation }) => {
  const { myBooks, deleteBook, updateBook, refreshData } = useBook();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const handleEdit = (book) => {
    navigation.navigate('PostBook', { book, isEditing: true });
  };

  const handleDelete = async (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const result = await deleteBook(bookId);
            if (!result.success) {
              Alert.alert("Error", "Failed to delete book");
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  const handleStatusChange = async (book) => {
    const newStatus = book.status === 'active' ? 'sold' : 'active';
    setLoading(true);
    const result = await updateBook(book.id, { status: newStatus });
    if (!result.success) {
      Alert.alert("Error", "Failed to update book status");
    }
    setLoading(false);
  };

  const renderBook = ({ item }) => (
    <Surface style={styles.bookCard}>
      <View style={styles.bookContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={item.image ? { uri: item.image } : require('../../assets/icon.png')}
            style={styles.bookImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          <Text style={styles.bookPrice}>฿{item.price}</Text>
          <Text style={styles.bookCategory}>{item.category}</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              item.status === 'active' ? styles.statusActive : styles.statusSold
            ]}>
              {item.status === 'active' ? 'Available' : 'Sold'}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => handleEdit(item)}
            disabled={loading}
          />
          <IconButton
            icon={item.status === 'active' ? 'check-circle' : 'refresh'}
            size={24}
            onPress={() => handleStatusChange(item)}
            disabled={loading}
          />
          <IconButton
            icon="delete"
            size={24}
            onPress={() => handleDelete(item.id)}
            disabled={loading}
          />
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
        <Text style={styles.header}>Manage My Books</Text>
      </View>

      {myBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#87CEEB" />
          <Text style={styles.emptyText}>You haven't posted any books yet</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('PostBook')}
            style={styles.addButton}
          >
            Post Your First Book
          </Button>
        </View>
      ) : (
        <FlatList
          data={myBooks}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={refreshData}
        />
      )}
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
  bookCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  bookContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 80,
    height: 120,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
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
  bookPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#87CEEB',
    marginBottom: 4,
  },
  bookCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  statusSold: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  actionButtons: {
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 150,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#87CEEB',
  },
});

export default BookManagementScreen; 