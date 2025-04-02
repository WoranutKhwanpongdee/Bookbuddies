import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const BookContext = createContext();

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const { user } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's books from AsyncStorage
  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const storedBooks = await AsyncStorage.getItem('postedBooks');
      if (storedBooks) {
        const allBooks = JSON.parse(storedBooks);
        // Filter books for current user
        const userBooks = allBooks.filter(book => book.userId === user.id);
        setMyBooks(userBooks);
      }
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Fetch exchange history
  const fetchExchangeHistory = async () => {
    try {
      setLoading(true);
      const storedHistory = await AsyncStorage.getItem('exchangeHistory');
      if (storedHistory) {
        const allHistory = JSON.parse(storedHistory);
        // Filter history for current user
        const userHistory = allHistory.filter(record => record.userId === user.id);
        setExchangeHistory(userHistory);
      }
    } catch (err) {
      setError('Failed to fetch exchange history');
    } finally {
      setLoading(false);
    }
  };

  // Post a new book
  const postBook = async (bookData) => {
    try {
      setLoading(true);
      // Get existing books
      const storedBooks = await AsyncStorage.getItem('postedBooks');
      const existingBooks = storedBooks ? JSON.parse(storedBooks) : [];
      
      // Create new book with unique ID and user ID
      const newBook = {
        ...bookData,
        id: Date.now().toString(), // Simple unique ID
        userId: user.id,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Add new book to existing books
      const updatedBooks = [...existingBooks, newBook];
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('postedBooks', JSON.stringify(updatedBooks));
      
      // Update state
      setMyBooks([...myBooks, newBook]);
      
      return { success: true, data: newBook };
    } catch (err) {
      setError('Failed to post book');
      return { success: false, error: 'Failed to post book' };
    } finally {
      setLoading(false);
    }
  };

  // Update a book
  const updateBook = async (bookId, bookData) => {
    try {
      setLoading(true);
      const storedBooks = await AsyncStorage.getItem('postedBooks');
      const existingBooks = storedBooks ? JSON.parse(storedBooks) : [];
      
      const updatedBooks = existingBooks.map(book => 
        book.id === bookId ? { ...book, ...bookData } : book
      );
      
      await AsyncStorage.setItem('postedBooks', JSON.stringify(updatedBooks));
      
      setMyBooks(myBooks.map(book => 
        book.id === bookId ? { ...book, ...bookData } : book
      ));
      
      return { success: true };
    } catch (err) {
      setError('Failed to update book');
      return { success: false, error: 'Failed to update book' };
    } finally {
      setLoading(false);
    }
  };

  // Delete a book
  const deleteBook = async (bookId) => {
    try {
      setLoading(true);
      const storedBooks = await AsyncStorage.getItem('postedBooks');
      const existingBooks = storedBooks ? JSON.parse(storedBooks) : [];
      
      const updatedBooks = existingBooks.filter(book => book.id !== bookId);
      
      await AsyncStorage.setItem('postedBooks', JSON.stringify(updatedBooks));
      
      setMyBooks(myBooks.filter(book => book.id !== bookId));
      return { success: true };
    } catch (err) {
      setError('Failed to delete book');
      return { success: false, error: 'Failed to delete book' };
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = () => {
    fetchMyBooks();
    fetchExchangeHistory();
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const value = {
    myBooks,
    exchangeHistory,
    loading,
    error,
    postBook,
    updateBook,
    deleteBook,
    refreshData,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}; 