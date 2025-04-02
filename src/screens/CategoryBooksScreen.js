import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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

const CategoryBooksScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  
  const books = booksData[category] || [];

  const getBookImage = (title) => {
    return bookImages[title] || require('../../assets/icon.png');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <View style={styles.bookContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={getBookImage(item.title)}
            style={styles.bookImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category}</Text>
        </View>
      </SafeAreaView>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#87CEEB" />
          <Text style={styles.emptyText}>No books found in this category</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingTop: 8,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 100,
    height: 150,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    marginTop: 16,
  },
});

export default CategoryBooksScreen; 