import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const FloatingCartButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.floatingCartButton}
      onPress={() => navigation.navigate('Cart')}
    >
      <LinearGradient
        colors={['#87CEEB', '#79C3E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.floatingCartGradient}
      >
        <Ionicons name="cart-outline" size={24} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingCartButton: {
    position: 'absolute',
    bottom: 130, 
    right: 20,
    zIndex: 10,
  },
  floatingCartGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default FloatingCartButton; 