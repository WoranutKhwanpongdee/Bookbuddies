import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useBook } from '../context/BookContext';

const PostBookScreen = ({ navigation, route }) => {
  const { postBook, updateBook, loading, error } = useBook();
  const isEditing = route.params?.isEditing;
  const existingBook = route.params?.book;

  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fiction');
  const [bookImage, setBookImage] = useState(null);
  const [localError, setLocalError] = useState('');

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'Art & Design',
    'Business'
  ];

  useEffect(() => {
    if (isEditing && existingBook) {
      setBookTitle(existingBook.title);
      setAuthor(existingBook.author);
      setPrice(existingBook.price.toString());
      setDescription(existingBook.description);
      setCategory(existingBook.category);
      setBookImage(existingBook.image);
    }
  }, [isEditing, existingBook]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setBookImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!bookTitle.trim() || !author.trim() || !price.trim() || !description.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    const bookData = {
      title: bookTitle,
      author,
      price: parseFloat(price),
      description,
      image: bookImage,
      category,
    };

    let result;
    if (isEditing && existingBook) {
      result = await updateBook(existingBook.id, bookData);
    } else {
      result = await postBook(bookData);
    }

    if (result.success) {
      navigation.goBack();
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>{isEditing ? 'Edit Book' : 'Post Book to Sell'}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.content}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {bookImage ? (
                <Image source={{ uri: bookImage }} style={styles.bookImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Add Book Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Book Title"
            value={bookTitle}
            onChangeText={setBookTitle}
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Author"
            value={author}
            onChangeText={setAuthor}
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Price (THB)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    category === cat && styles.categoryPillSelected
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryPillText,
                    category === cat && styles.categoryPillTextSelected
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Book Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
          />

          {(localError || error) && (
            <Text style={styles.error}>{localError || error}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            labelStyle={styles.buttonText}
            loading={loading}
            disabled={loading}
          >
            {isEditing ? 'Update Book' : 'Post Book'}
          </Button>
        </Surface>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    margin: 16,
    borderRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  categoryPillSelected: {
    backgroundColor: '#87CEEB',
  },
  categoryPillText: {
    color: '#666',
    fontSize: 14,
  },
  categoryPillTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#87CEEB',
  },
  buttonText: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default PostBookScreen; 