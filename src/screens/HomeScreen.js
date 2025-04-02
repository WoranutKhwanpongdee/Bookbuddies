import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingCartButton from '../components/FloatingCartButton';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import booksData from '../data/books.json';

// Helper function to get icon for each category
function getCategoryIcon(category) {
  const icons = {
    'Fiction': 'book',
    'Non-Fiction': 'school',
    'Science': 'flask',
    'Technology': 'laptop',
    'Art & Design': 'color-palette',
    'Business': 'briefcase'
  };
  return icons[category] || 'book';
}

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

// Categories from books.json
const categories = Object.keys(booksData).map(category => ({
  icon: getCategoryIcon(category),
  name: category
}));

// Reusable Components
const CategoryItem = ({ icon, name, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.categoryIconContainer}>
      <Ionicons name={icon} size={28} color="#666" />
    </View>
    <Text style={styles.categoryText}>{name}</Text>
  </TouchableOpacity>
);

const BookCard = ({ title, author, price, image, onPress }) => (
  <TouchableOpacity style={styles.bookCard} onPress={onPress}>
    <View style={styles.imageContainer}>
      <Image 
        source={image} 
        style={styles.bookImage}
        resizeMode="cover"
      />
    </View>
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle} numberOfLines={2}>{title}</Text>
      <Text style={styles.bookAuthor}>{author}</Text>
      <Text style={styles.bookPrice}>{price}</Text>
    </View>
  </TouchableOpacity>
);

const Section = ({ title, data, renderItem, onSeeAll }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {data.map((item, index) => (
        <View key={index} style={styles.sectionItem}>
          {renderItem(item)}
        </View>
      ))}
    </ScrollView>
  </View>
);

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Combine all books from all categories
    const allBooks = Object.values(booksData).flat();
    setFilteredBooks(allBooks);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const allBooks = Object.values(booksData).flat();
      const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(Object.values(booksData).flat());
    }
  }, [searchQuery]);

  const getBookImage = (title) => {
    return bookImages[title] || require('../../assets/icon.png');
  };

  const handleCategoryPress = (category) => {
    console.log('Navigating to category:', category);
    navigation.navigate('Explore', {
      screen: 'CategoryBooks',
      params: { category }
    });
  };

  const handleSeeAllPress = () => {
    navigation.navigate('Explore', {
      screen: 'ExploreScreen'
    });
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  // Get books for different sections
  const featuredBooks = filteredBooks.slice(0, 3);
  const newArrivals = filteredBooks.slice(3, 6);
  const bestSellers = filteredBooks.slice(6, 9);
  const allBooks = filteredBooks;

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Header />
      </SafeAreaView>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Section
          title="Categories"
          data={categories}
          renderItem={(item) => (
            <CategoryItem 
              {...item} 
              onPress={() => handleCategoryPress(item.name)}
            />
          )}
          onSeeAll={() => handleSeeAllPress()}
        />

        <Section
          title="Featured Books"
          data={featuredBooks}
          renderItem={(item) => (
            <BookCard 
              {...item}
              image={getBookImage(item.title)}
              onPress={() => handleBookPress(item)}
            />
          )}
          onSeeAll={() => handleSeeAllPress()}
        />

        <Section
          title="New Arrivals"
          data={newArrivals}
          renderItem={(item) => (
            <BookCard 
              {...item}
              image={getBookImage(item.title)}
              onPress={() => handleBookPress(item)}
            />
          )}
          onSeeAll={() => handleSeeAllPress()}
        />

        <Section
          title="Best Sellers"
          data={bestSellers}
          renderItem={(item) => (
            <BookCard 
              {...item}
              image={getBookImage(item.title)}
              onPress={() => handleBookPress(item)}
            />
          )}
          onSeeAll={() => handleSeeAllPress()}
        />

        <Section
          title="All Books"
          data={allBooks}
          renderItem={(item) => (
            <BookCard 
              {...item}
              image={getBookImage(item.title)}
              onPress={() => handleBookPress(item)}
            />
          )}
          onSeeAll={() => handleSeeAllPress()}
        />
      </ScrollView>

      <FloatingCartButton />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  content: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: '#87CEEB',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionItem: {
    marginRight: 16,
    marginLeft: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  bookCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  bookInfo: {
    padding: 12,
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
  bookPrice: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: 'bold',
  },
});

export default HomeScreen; 