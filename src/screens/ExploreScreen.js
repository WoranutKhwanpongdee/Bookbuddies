import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import booksData from '../data/books.json';

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

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { id: '0', name: 'All', icon: 'apps' },
    { id: '1', name: 'Fiction', icon: 'book' },
    { id: '2', name: 'Non-Fiction', icon: 'library' },
    { id: '3', name: 'Science', icon: 'flask' },
    { id: '4', name: 'Technology', icon: 'laptop' },
    { id: '5', name: 'Art & Design', icon: 'color-palette' },
    { id: '6', name: 'Business', icon: 'briefcase' },
  ];

  // Convert books object to array and combine with posted books
  const getAllBooks = async () => {
    try {
      setLoading(true);
      // Get static books
      const staticBooks = Object.entries(booksData).reduce((acc, [category, books]) => {
        return [...acc, ...books.map(book => ({ ...book, category, isPosted: false }))];
      }, []);

      // Get posted books
      const storedBooks = await AsyncStorage.getItem('postedBooks');
      const postedBooks = storedBooks ? JSON.parse(storedBooks) : [];
      
      // Combine both arrays
      return [...staticBooks, ...postedBooks.map(book => ({ ...book, isPosted: true }))];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadBooks = async () => {
    const allBooks = await getAllBooks();
    let filtered = allBooks;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadBooks();
    }, [searchQuery, selectedCategory])
  );

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

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <View style={styles.bookContent}>
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
          <Text style={styles.categoryTag}>{item.category}</Text>
          <Text style={styles.bookPrice}>{item.price}</Text>
          <Text style={styles.bookDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Explore Books</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books by title, author, or description"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filter */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.categoryPill,
                  selectedCategory === item.name && styles.categoryPillSelected
                ]}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Ionicons 
                  name={item.icon} 
                  size={16} 
                  color={selectedCategory === item.name ? '#fff' : '#87CEEB'} 
                />
                <Text 
                  style={[
                    styles.categoryPillText,
                    selectedCategory === item.name && styles.categoryPillTextSelected
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Books List */}
        <View style={styles.booksListContainer}>
          {filteredBooks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No books found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredBooks}
              renderItem={renderBook}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.booksContainer}
              refreshing={loading}
              onRefresh={loadBooks}
            />
          )}
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
    marginTop: 70,
    marginBottom: 100,
  },
  headerContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesList: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    width: 120,
    height: 40,
    justifyContent: 'center',
  },
  categoryPillSelected: {
    backgroundColor: '#87CEEB',
  },
  categoryPillText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#87CEEB',
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryPillTextSelected: {
    color: '#fff',
  },
  booksListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  booksContainer: {
    paddingTop: 8,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 100,
    height: 150,
    marginRight: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 12,
    color: '#87CEEB',
    marginBottom: 4,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#87CEEB',
    marginBottom: 4,
  },
  bookDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ExploreScreen; 